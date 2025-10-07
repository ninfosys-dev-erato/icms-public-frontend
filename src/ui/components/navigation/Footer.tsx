'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { 
  Email, 
  Phone, 
  Location,
  LogoFacebook,
  LogoTwitter,
  LogoYoutube,
  LogoInstagram
} from '@carbon/icons-react'
import { getLocalizedContent } from '@/lib/i18n-utils'
import type { Locale } from '@/lib/i18n-utils'

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  const locale = useLocale() as Locale
  const t = useTranslations('footer')
  const headerT = useTranslations('header')

  // Mock footer data - this will come from MediaService in real implementation
  const quickLinks = [
    { id: '1', title: { ne: 'गृह पृष्ठ', en: 'Home' }, url: '/', isActive: true },
    { id: '2', title: { ne: 'समाचार', en: 'News' }, url: '/news', isActive: true },
    { id: '3', title: { ne: 'सूचना', en: 'Notices' }, url: '/notices', isActive: true },
    { id: '4', title: { ne: 'सेवाहरू', en: 'Services' }, url: '/services', isActive: true },
    { id: '5', title: { ne: 'सम्पर्क', en: 'Contact' }, url: '/contact', isActive: true }
  ]

  const importantLinks = [
    { id: '1', title: { ne: 'राष्ट्रपतिको कार्यालय', en: 'Office of the President' }, url: 'https://president.gov.np', isActive: true },
    { id: '2', title: { ne: 'प्रधानमन्त्रीको कार्यालय', en: 'Office of the Prime Minister' }, url: 'https://opmcm.gov.np', isActive: true },
    { id: '3', title: { ne: 'नेपाल सरकार', en: 'Government of Nepal' }, url: 'https://nepal.gov.np', isActive: true },
    { id: '4', title: { ne: 'सर्वोच्च अदालत', en: 'Supreme Court' }, url: 'https://supremecourt.gov.np', isActive: true }
  ]

  const contactInfo = {
    address: {
      ne: 'काठमाडौं, नेपाल',
      en: 'Kathmandu, Nepal'
    },
    phone: '+977-1-4200000',
    email: 'info@example.gov.np',
    website: 'www.example.gov.np'
  }

  const socialLinks = [
    { icon: LogoFacebook, url: '#', label: 'Facebook' },
    { icon: LogoTwitter, url: '#', label: 'Twitter' },
    { icon: LogoYoutube, url: '#', label: 'YouTube' },
    { icon: LogoInstagram, url: '#', label: 'Instagram' }
  ]

  return (
    <footer className={`gov-footer ${className}`}>
      {/* Main Footer */}
      <div className="footer-main">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Quick Links Section */}
            <div className="footer-section">
              <h3 className="footer-title">
                {t('quickLinks')}
              </h3>
              <ul className="footer-links">
                {quickLinks.filter(link => link.isActive).map(link => (
                  <li key={link.id}>
                    <Link href={link.url}>
                      {getLocalizedContent(link.title, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Links Section */}
            <div className="footer-section">
              <h3 className="footer-title">
                {t('importantLinks')}
              </h3>
              <ul className="footer-links">
                {importantLinks.filter(link => link.isActive).map(link => (
                  <li key={link.id}>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {getLocalizedContent(link.title, locale)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="footer-section">
              <h3 className="footer-title">
                {t('contactInfo')}
              </h3>
              <div className="contact-info">
                <div className="contact-item">
                  <Location className="contact-icon" size={16} />
                  <div className="contact-text">
                    <strong>{t('address')}:</strong><br />
                    {getLocalizedContent(contactInfo.address, locale)}
                  </div>
                </div>
                
                <div className="contact-item">
                  <Phone className="contact-icon" size={16} />
                  <div className="contact-text">
                    <strong>{t('phone')}:</strong><br />
                    <a href={`tel:${contactInfo.phone}`}>
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
                
                <div className="contact-item">
                  <Email className="contact-icon" size={16} />
                  <div className="contact-text">
                    <strong>{t('email')}:</strong><br />
                    <a href={`mailto:${contactInfo.email}`}>
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Government Logo and Social */}
            <div className="footer-section">
              <h3 className="footer-title">
                {headerT('govNepal')}
              </h3>
              <div className="mb-4">
                <div className="gov-emblem w-16 h-16 mb-4 bg-white rounded-full flex items-center justify-center">
                  {/* Government emblem placeholder */}
                  <span className="text-2xl">🇳🇵</span>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  {locale === 'ne' 
                    ? 'जनताको सेवामा सदैव तत्पर' 
                    : 'Always ready to serve the people'
                  }
                </p>
              </div>
              
              {/* Social Media Links */}
              <div className="social-media">
                <h4 className="text-sm font-semibold mb-2">
                  {t('socialMedia')}
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      aria-label={social.label}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="container mx-auto px-4">
          <div className="footer-bottom-links">
            <Link href="/privacy">
              {t('privacyPolicy')}
            </Link>
            <Link href="/terms">
              {t('termsOfUse')}
            </Link>
            <Link href="/accessibility">
              {locale === 'ne' ? 'पहुँच नीति' : 'Accessibility'}
            </Link>
            <Link href="/sitemap">
              {locale === 'ne' ? 'साइट नक्सा' : 'Sitemap'}
            </Link>
          </div>
          
          <div className="copyright-text">
            © {new Date().getFullYear()} {headerT('govNepal')}. {t('copyright')}.
            <br />
            <span className="text-xs">
              {locale === 'ne' 
                ? 'यो वेबसाइट नेपाल सरकारको आधिकारिक वेबसाइट हो।'
                : 'This is an official website of the Government of Nepal.'
              }
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          color: var(--nepal-gray-300);
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .social-link:hover {
          background: var(--nepal-blue);
          color: white;
          transform: translateY(-2px);
        }

        .copyright-text {
          text-align: center;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .footer-main .grid {
            grid-template-columns: 1fr;
          }
          
          .footer-section {
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </footer>
  )
}