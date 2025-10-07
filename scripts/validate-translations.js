#!/usr/bin/env node

/**
 * Translation Validation Script
 * 
 * This script validates translations to ensure:
 * 1. All translation keys exist in both en.json and ne.json
 * 2. No missing or unused translation keys
 * 3. Consistent structure between language files
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../src/messages');
const SRC_DIR = path.join(__dirname, '../src');

function loadTranslations() {
  try {
    const enPath = path.join(MESSAGES_DIR, 'en.json');
    const nePath = path.join(MESSAGES_DIR, 'ne.json');
    
    const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const ne = JSON.parse(fs.readFileSync(nePath, 'utf8'));
    
    return { en, ne };
  } catch (error) {
    console.error('Error loading translation files:', error.message);
    process.exit(1);
  }
}

function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
}

function findUsedTranslationKeys(dir) {
  const usedKeys = new Set();
  const translationRegex = /useTranslations\(['"`]([^'"`]+)['"`]\)/g;
  const translationCallRegex = /t\(['"`]([^'"`]+)['"`]\)/g;
  
  function searchFiles(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        searchFiles(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Find translation namespaces
          let match;
          const namespaces = [];
          
          while ((match = translationRegex.exec(content)) !== null) {
            namespaces.push(match[1]);
          }
          
          // Find translation calls
          const keyRegex = /t\(['"`]([^'"`]+)['"`]\)/g;
          while ((match = keyRegex.exec(content)) !== null) {
            const key = match[1];
            
            // For each namespace found in this file, add the full key path
            for (const namespace of namespaces) {
              if (key.includes('.')) {
                usedKeys.add(`${namespace}.${key}`);
              } else {
                usedKeys.add(`${namespace}.${key}`);
              }
            }
            
            // Also add the key as-is in case it's used with root namespace
            usedKeys.add(key);
          }
          
        } catch (error) {
          console.warn(`Warning: Could not read file ${filePath}:`, error.message);
        }
      }
    }
  }
  
  searchFiles(dir);
  return Array.from(usedKeys);
}

function validateTranslations() {
  console.log('🔍 Validating translations...\n');
  
  const { en, ne } = loadTranslations();
  const flatEn = flattenObject(en);
  const flatNe = flattenObject(ne);
  
  const enKeys = Object.keys(flatEn);
  const neKeys = Object.keys(flatNe);
  
  let hasErrors = false;
  
  // Check for missing keys in Nepali
  const missingInNe = enKeys.filter(key => !neKeys.includes(key));
  if (missingInNe.length > 0) {
    console.error('❌ Missing keys in ne.json:');
    missingInNe.forEach(key => console.error(`   - ${key}`));
    console.error('');
    hasErrors = true;
  }
  
  // Check for missing keys in English
  const missingInEn = neKeys.filter(key => !enKeys.includes(key));
  if (missingInEn.length > 0) {
    console.error('❌ Missing keys in en.json:');
    missingInEn.forEach(key => console.error(`   - ${key}`));
    console.error('');
    hasErrors = true;
  }
  
  // Check for empty values
  const emptyInEn = enKeys.filter(key => !flatEn[key] || flatEn[key].toString().trim() === '');
  if (emptyInEn.length > 0) {
    console.warn('⚠️  Empty values in en.json:');
    emptyInEn.forEach(key => console.warn(`   - ${key}`));
    console.warn('');
  }
  
  const emptyInNe = neKeys.filter(key => !flatNe[key] || flatNe[key].toString().trim() === '');
  if (emptyInNe.length > 0) {
    console.warn('⚠️  Empty values in ne.json:');
    emptyInNe.forEach(key => console.warn(`   - ${key}`));
    console.warn('');
  }
  
  // Find used translation keys in code
  console.log('🔍 Analyzing code usage...');
  const usedKeys = findUsedTranslationKeys(SRC_DIR);
  
  // Check for unused translations
  const unusedKeys = enKeys.filter(key => {
    return !usedKeys.some(usedKey => {
      // Handle both direct matches and partial matches for nested keys
      return usedKey === key || 
             usedKey.includes(key) || 
             key.startsWith(usedKey.split('.').slice(0, -1).join('.'));
    });
  });
  
  if (unusedKeys.length > 0) {
    console.warn('⚠️  Potentially unused translation keys:');
    unusedKeys.forEach(key => console.warn(`   - ${key}`));
    console.warn('');
  }
  
  // Summary
  console.log('📊 Summary:');
  console.log(`   Total English keys: ${enKeys.length}`);
  console.log(`   Total Nepali keys: ${neKeys.length}`);
  console.log(`   Used keys found in code: ${usedKeys.length}`);
  console.log(`   Missing in Nepali: ${missingInNe.length}`);
  console.log(`   Missing in English: ${missingInEn.length}`);
  console.log(`   Potentially unused: ${unusedKeys.length}`);
  
  if (!hasErrors) {
    console.log('\n✅ Translation validation passed!');
    return true;
  } else {
    console.log('\n❌ Translation validation failed!');
    return false;
  }
}

// Run validation
if (require.main === module) {
  const success = validateTranslations();
  process.exit(success ? 0 : 1);
}

module.exports = { validateTranslations };
