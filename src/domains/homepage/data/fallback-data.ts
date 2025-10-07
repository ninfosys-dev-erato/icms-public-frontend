import { FallbackData } from '../types/homepage';

export const fallbackHomepageData: FallbackData = {
  header: {
    logo: {
      url: '/icons/favicon.svg',
      alt: 'Nepal Government Logo'
    },
    officeName: {
      en: 'Department of Information Technology',
      ne: 'सूचना प्रविधि विभाग'
    },
    officeDescription: {
      en: 'Ministry of Communication and Information Technology',
      ne: 'सञ्चार तथा सूचना प्रविधि मन्त्रालय'
    },
    navigation: [
      {
        id: '1',
        title: { en: 'About Us', ne: 'हाम्रोबारे' },
        url: '/about',
        order: 1,
        isActive: true,
        children: [
          {
            id: '1-1',
            title: { en: 'Introduction', ne: 'परिचय' },
            url: '/about/introduction',
            order: 1,
            isActive: true
          },
          {
            id: '1-2',
            title: { en: 'Objectives', ne: 'उद्देश्यहरू' },
            url: '/about/objectives',
            order: 2,
            isActive: true
          }
        ]
      },
      {
        id: '2',
        title: { en: 'Services', ne: 'सेवाहरू' },
        url: '/services',
        order: 2,
        isActive: true,
        children: [
          {
            id: '2-1',
            title: { en: 'Digital Services', ne: 'डिजिटल सेवाहरू' },
            url: '/services/digital',
            order: 1,
            isActive: true
          },
          {
            id: '2-2',
            title: { en: 'Technical Support', ne: 'प्राविधिक सहयोग' },
            url: '/services/technical',
            order: 2,
            isActive: true
          }
        ]
      },
      {
        id: '3',
        title: { en: 'Resources', ne: 'स्रोतहरू' },
        url: '/resources',
        order: 3,
        isActive: true
      },
      {
        id: '4',
        title: { en: 'Media Center', ne: 'मिडिया केन्द्र' },
        url: '/media',
        order: 4,
        isActive: true
      },
      {
        id: '5',
        title: { en: 'Downloads', ne: 'डाउनलोडहरू' },
        url: '/downloads',
        order: 5,
        isActive: true
      },
      {
        id: '6',
        title: { en: 'Online Services', ne: 'अनलाइन सेवाहरू' },
        url: '/online-services',
        order: 6,
        isActive: true
      }
    ],
    searchEnabled: true,
    languageSwitcherEnabled: true,
    socialMedia: {
      facebook: 'https://facebook.com/doitnepal',
      twitter: 'https://twitter.com/doitnepal',
      email: 'info@doit.gov.np'
    }
  },
  hero: {
    title: {
      en: 'Government Integrated Office Management System',
      ne: 'एकिकृत कार्यालय व्यवस्थापन प्रणाली'
    },
    subtitle: {
      en: 'Integrated Office Management System',
      ne: 'एकिकृत कार्यालय व्यवस्थापन प्रणाली'
    },
    backgroundImage: '/images/hero-bg.jpg',
    statistics: [
      {
        id: '1',
        icon: '🏢',
        label: { en: 'Office', ne: 'कार्यालय' },
        value: 77,
        color: '#FF6B35'
      },
      {
        id: '2',
        icon: '📝',
        label: { en: 'Registration', ne: 'दर्ता' },
        value: 271062,
        color: '#4CAF50'
      },
      {
        id: '3',
        icon: '📤',
        label: { en: 'Dispatch', ne: 'चलानी' },
        value: 54555,
        color: '#2196F3'
      },
      {
        id: '4',
        icon: '💬',
        label: { en: 'Comments', ne: 'टिप्पणी' },
        value: 5519,
        color: '#3F51B5'
      }
    ],
    fiscalYearInfo: {
      en: 'Up to Fiscal Year 2080/81 Ashadh Month',
      ne: 'आर्थिक वर्ष २०८०/८१ असार मसान्तसम्म'
    },
    callToAction: {
      text: { en: 'View More', ne: 'थप हेर्नुहोस्' },
      url: '/dashboard'
    }
  },
  services: [
    {
      id: '1',
      title: {
        en: 'Integrated Website Management System',
        ne: 'एकीकृत वेबसाइट व्यवस्थापन प्रणाली'
      },
      description: {
        en: 'Manage multiple government websites from a single platform',
        ne: 'एकै प्लेटफर्मबाट धेरै सरकारी वेबसाइटहरू व्यवस्थापन गर्नुहोस्'
      },
      icon: '🌐',
      url: '/services/website-management',
      order: 1,
      isActive: true
    },
    {
      id: '2',
      title: {
        en: 'Integrated Office Management System',
        ne: 'एकिकृत कार्यालय व्यवस्थापन प्रणाली'
      },
      description: {
        en: 'Streamline office operations and workflow management',
        ne: 'कार्यालयको कार्यहरू र कार्यप्रवाह व्यवस्थापन सुव्यवस्थित गर्नुहोस्'
      },
      icon: '🏛️',
      url: '/services/office-management',
      order: 2,
      isActive: true
    },
    {
      id: '3',
      title: {
        en: 'Government Cloud',
        ne: 'सरकारी क्लाउड'
      },
      description: {
        en: 'Secure cloud infrastructure for government services',
        ne: 'सरकारी सेवाहरूको लागि सुरक्षित क्लाउड बुनियादी ढाँचा'
      },
      icon: '☁️',
      url: '/services/cloud',
      order: 3,
      isActive: true
    },
    {
      id: '4',
      title: {
        en: 'Centralized E-Attendance',
        ne: 'केन्द्रीकृत ई-हाजिरी'
      },
      description: {
        en: 'Digital attendance tracking system for government employees',
        ne: 'सरकारी कर्मचारीहरूको लागि डिजिटल हाजिरी ट्र्याकिङ प्रणाली'
      },
      icon: '👥',
      url: '/services/e-attendance',
      order: 4,
      isActive: true
    },
    {
      id: '5',
      title: {
        en: 'Centralized SMS Gateway',
        ne: 'केन्द्रिकृत एस एम एस गेटवे'
      },
      description: {
        en: 'Unified SMS communication platform for government',
        ne: 'सरकारको लागि एकीकृत एसएमएस सञ्चार प्लेटफर्म'
      },
      icon: '📱',
      url: '/services/sms-gateway',
      order: 5,
      isActive: true
    },
    {
      id: '6',
      title: {
        en: 'Security Audit',
        ne: 'सुरक्षा अडिट'
      },
      description: {
        en: 'Comprehensive security assessment and monitoring',
        ne: 'व्यापक सुरक्षा मूल्याङ्कन र निगरानी'
      },
      icon: '🔒',
      url: '/services/security-audit',
      order: 6,
      isActive: true
    }
  ],
  highlights: [
    {
      id: '1',
      title: {
        en: 'Information regarding list registration',
        ne: 'सूची दर्ता गर्ने सम्बन्धी सूचना'
      },
      date: '4 Saun, 2082',
      url: '/highlights/list-registration',
      isActive: true,
      order: 1
    },
    {
      id: '2',
      title: {
        en: 'Information regarding scholarship selection',
        ne: 'छात्रवृत्ति छनोट सम्बन्धी सूचना'
      },
      date: '21 Ashar, 2082',
      url: '/highlights/scholarship-selection',
      isActive: true,
      order: 2
    },
    {
      id: '3',
      title: {
        en: 'Important notice regarding office relocation',
        ne: 'कार्यालय भवन सरेको सम्बन्धमा महत्त्वपूर्ण सूचना'
      },
      date: '15 Baisakh, 2082',
      url: '/highlights/office-relocation',
      isActive: true,
      order: 3
    }
  ],
  news: [
    {
      id: '1',
      title: {
        en: 'GIWMS affiliation request letter sample',
        ne: 'GIWMS मा आवद्ध हुन अनुरोध पत्रको नमूना'
      },
      excerpt: {
        en: 'Sample request letter for GIWMS affiliation',
        ne: 'GIWMS मा आवद्ध हुन अनुरोध पत्रको नमूना'
      },
      date: '10 Ashar, 2082',
      imageUrl: '/images/news/gigms-sample.jpg',
      downloadUrl: '/downloads/giwms-sample.pdf',
      isActive: true,
      order: 1
    },
    {
      id: '2',
      title: {
        en: 'New digital services launched',
        ne: 'नयाँ डिजिटल सेवाहरू सुरु गरियो'
      },
      excerpt: {
        en: 'Government launches new digital services for citizens',
        ne: 'सरकारले नागरिकहरूको लागि नयाँ डिजिटल सेवाहरू सुरु गर्यो'
      },
      date: '5 Ashar, 2082',
      imageUrl: '/images/news/digital-services.jpg',
      downloadUrl: '/downloads/digital-services-guide.pdf',
      isActive: true,
      order: 2
    },
    {
      id: '3',
      title: {
        en: 'IT infrastructure upgrade completed',
        ne: 'आईटी बुनियादी ढाँचा अपग्रेड पूरा भयो'
      },
      excerpt: {
        en: 'Major IT infrastructure upgrade project completed successfully',
        ne: 'मुख्य आईटी बुनियादी ढाँचा अपग्रेड परियोजना सफलतापूर्वक पूरा भयो'
      },
      date: '1 Ashar, 2082',
      imageUrl: '/images/news/infrastructure.jpg',
      downloadUrl: '/downloads/infrastructure-report.pdf',
      isActive: true,
      order: 3
    }
  ],
  contact: {
    directorGeneral: {
      id: '1',
      name: {
        en: 'Shree Ramesh Sharma Paudyal',
        ne: 'श्री रमेश शर्मा पौड्याल'
      },
      title: {
        en: 'Director General',
        ne: 'महानिर्देशक'
      },
      phone: '1-4112334',
      email: 'dg@doit.gov.np',
      imageUrl: '/images/contacts/director-general.jpg'
    },
    informationOfficer: {
      id: '2',
      name: {
        en: 'Shree Prakash Dawadi',
        ne: 'श्री प्रकाश दवाडी'
      },
      title: {
        en: 'Information Technology Officer (Information Officer)',
        ne: 'सूचना प्रविधि अधिकृत (सूचना अधिकारी)'
      },
      phone: '117',
      email: 'prakash.dawadi@nepal.gov.np',
      imageUrl: '/images/contacts/information-officer.jpg'
    }
  },
  footer: {
    officeInfo: {
      name: {
        en: 'Department of Information Technology',
        ne: 'सूचना प्रविधि विभाग'
      },
      address: {
        en: 'Hulak Parisar, Babarmahal, Kathmandu',
        ne: 'हुलाक परिसर, बबरमहल, काठमाडौं'
      },
      officeHours: {
        winter: {
          sundayToThursday: '10:00 - 4:00',
          friday: '10:00 - 3:00',
          period: {
            en: 'Winter (Kartik 16 to Magh 15)',
            ne: 'जाडो (कार्तिक १६ देखि माघ १५)'
          }
        },
        summer: {
          sundayToThursday: '10:00 - 5:00',
          friday: '10:00 - 3:00',
          period: {
            en: 'Summer (Magh 16 to Kartik 15)',
            ne: 'गर्मी (माघ १६ देखि कार्तिक १५)'
          }
        }
      }
    },
    importantLinks: [
      {
        id: '1',
        title: { en: 'Ministry of Home Affairs', ne: 'गृह मन्त्रालय' },
        url: 'https://moha.gov.np',
        order: 1,
        isActive: true
      },
      {
        id: '2',
        title: { 
          en: 'Integrated Data Management Center (National Information Technology Center)', 
          ne: 'एकिकृत डाटा व्यवस्थापन केन्द्र (राष्ट्रिय सूचना प्रविधि केन्द्र)' 
        },
        url: 'https://nitc.gov.np',
        order: 2,
        isActive: true
      },
      {
        id: '3',
        title: { 
          en: 'Ministry of Federal Affairs and General Administration', 
          ne: 'सङ्घीय मामिला तथा सामान्य प्रशासन मन्त्रालय' 
        },
        url: 'https://mofaga.gov.np',
        order: 3,
        isActive: true
      },
      {
        id: '4',
        title: { en: 'Privacy Statement', ne: 'गोपनीयता बिज्ञापन' },
        url: '/privacy',
        order: 4,
        isActive: true
      },
      {
        id: '5',
        title: { en: 'Ministry of Finance', ne: 'अर्थ मन्त्रालय' },
        url: 'https://mof.gov.np',
        order: 5,
        isActive: true
      },
      {
        id: '6',
        title: { 
          en: 'Ministry of Communication and Information Technology', 
          ne: 'सञ्चार तथा सूचना प्रविधि मन्त्रालय' 
        },
        url: 'https://mocit.gov.np',
        order: 6,
        isActive: true
      },
      {
        id: '7',
        title: { 
          en: 'Office of the Prime Minister and Council of Ministers', 
          ne: 'प्रधानमन्त्री तथा मन्त्रिपरिषद्‌को कार्यालय' 
        },
        url: 'https://opmcm.gov.np',
        order: 7,
        isActive: true
      },
      {
        id: '8',
        title: { 
          en: 'Integrated Public Financial Management', 
          ne: 'एकीकृत सार्वजनिक वित्तीय व्यवस्थापन' 
        },
        url: 'https://ipfm.gov.np',
        order: 8,
        isActive: true
      }
    ],
    contactInfo: {
      address: {
        en: 'Hulak Parisar, Babarmahal, Kathmandu',
        ne: 'हुलाक परिसर, बबरमहल, काठमाडौं'
      },
      email: 'info@doit.gov.np',
      phone: '1-4112334, 1-4117940'
    }
  }
};
