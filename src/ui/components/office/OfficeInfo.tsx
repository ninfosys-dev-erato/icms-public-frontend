'use client'

import { useLocale, useTranslations } from 'next-intl'
import { 
  Accordion,
  AccordionItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Card,
  CardBody,
  Tag,
  Button
} from '@carbon/react'
import { 
  Building,
  Phone,
  Email,
  Location,
  User,
  Organization,
  Document,
  Information,
  Target
} from '@carbon/icons-react'
import { getLocalizedContent } from '@/lib/i18n-utils'
import type { Locale } from '@/lib/i18n-utils'
import type { 
  OfficeSettingsResponse, 
  OfficeDescriptionResponse, 
  DepartmentResponse,
  EmployeeResponse 
} from '@/models'

interface OfficeInfoProps {
  officeSettings?: OfficeSettingsResponse
  officeDescriptions?: OfficeDescriptionResponse[]
  departments?: DepartmentResponse[]
  employees?: EmployeeResponse[]
  variant?: 'full' | 'summary' | 'contact-only'
  className?: string
}

export function OfficeInfo({
  officeSettings,
  officeDescriptions = [],
  departments = [],
  employees = [],
  variant = 'full',
  className = ''
}: OfficeInfoProps) {
  const locale = useLocale() as Locale
  const t = useTranslations('office')
  const commonT = useTranslations('common')

  // Group descriptions by type
  const descriptionsByType = officeDescriptions.reduce((acc, desc) => {
    acc[desc.type] = desc
    return acc
  }, {} as Record<string, OfficeDescriptionResponse>)

  // Contact-only variant
  if (variant === 'contact-only') {
    return (
      <Card className={`office-contact-card ${className}`}>
        <CardBody>
          <div className="contact-header">
            <Building size={24} className="contact-icon" />
            <div>
              <h3 className="contact-title">
                {officeSettings ? getLocalizedContent(officeSettings.officeName, locale) : t('contactInfo')}
              </h3>
              {officeSettings?.officeType && (
                <p className="contact-subtitle">
                  {getLocalizedContent(officeSettings.officeType, locale)}
                </p>
              )}
            </div>
          </div>

          <div className="contact-details">
            {officeSettings?.address && (
              <div className="contact-item">
                <Location size={16} />
                <span>{getLocalizedContent(officeSettings.address, locale)}</span>
              </div>
            )}
            
            {officeSettings?.phone && (
              <div className="contact-item">
                <Phone size={16} />
                <a href={`tel:${officeSettings.phone}`}>{officeSettings.phone}</a>
              </div>
            )}
            
            {officeSettings?.email && (
              <div className="contact-item">
                <Email size={16} />
                <a href={`mailto:${officeSettings.email}`}>{officeSettings.email}</a>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    )
  }

  // Summary variant
  if (variant === 'summary') {
    const introduction = descriptionsByType['INTRODUCTION']
    const objective = descriptionsByType['OBJECTIVE']

    return (
      <div className={`office-summary ${className}`}>
        {introduction && (
          <Card className="mb-4">
            <CardBody>
              <h3 className="card-title">
                <Information size={20} />
                {t('introduction')}
              </h3>
              <div 
                className="office-content"
                dangerouslySetInnerHTML={{ 
                  __html: getLocalizedContent(introduction.content, locale) 
                }}
              />
            </CardBody>
          </Card>
        )}

        {objective && (
          <Card className="mb-4">
            <CardBody>
              <h3 className="card-title">
                <Target size={20} />
                {t('objective')}
              </h3>
              <div 
                className="office-content"
                dangerouslySetInnerHTML={{ 
                  __html: getLocalizedContent(objective.content, locale) 
                }}
              />
            </CardBody>
          </Card>
        )}

        {departments.length > 0 && (
          <Card>
            <CardBody>
              <h3 className="card-title">
                <Organization size={20} />
                {t('departments')} ({departments.length})
              </h3>
              <div className="department-grid">
                {departments.slice(0, 6).map(dept => (
                  <div key={dept.id} className="department-item">
                    <h4>{getLocalizedContent(dept.name, locale)}</h4>
                    {dept.description && (
                      <p className="text-sm text-gray-600">
                        {getLocalizedContent(dept.description, locale)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {departments.length > 6 && (
                <Button kind="tertiary" size="sm" className="mt-3">
                  {commonT('viewAll')} ({departments.length})
                </Button>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    )
  }

  // Full variant
  return (
    <div className={`office-info ${className}`}>
      <Tabs>
        <TabList aria-label="Office information tabs">
          <Tab>{t('introduction')}</Tab>
          <Tab>{t('organizationalStructure')}</Tab>
          <Tab>{t('employees')}</Tab>
          <Tab>{locale === 'ne' ? 'सम्पर्क विवरण' : 'Contact Details'}</Tab>
        </TabList>

        <TabPanels>
          {/* Introduction Tab */}
          <TabPanel>
            <div className="tab-content">
              {descriptionsByType['INTRODUCTION'] && (
                <Card className="mb-4">
                  <CardBody>
                    <h3 className="section-title">
                      <Information size={20} />
                      {t('introduction')}
                    </h3>
                    <div 
                      className="office-content"
                      dangerouslySetInnerHTML={{ 
                        __html: getLocalizedContent(descriptionsByType['INTRODUCTION'].content, locale) 
                      }}
                    />
                  </CardBody>
                </Card>
              )}

              {descriptionsByType['OBJECTIVE'] && (
                <Card className="mb-4">
                  <CardBody>
                    <h3 className="section-title">
                      <Target size={20} />
                      {t('objective')}
                    </h3>
                    <div 
                      className="office-content"
                      dangerouslySetInnerHTML={{ 
                        __html: getLocalizedContent(descriptionsByType['OBJECTIVE'].content, locale) 
                      }}
                    />
                  </CardBody>
                </Card>
              )}

              {descriptionsByType['WORK_DETAILS'] && (
                <Card>
                  <CardBody>
                    <h3 className="section-title">
                      <Document size={20} />
                      {t('workDetails')}
                    </h3>
                    <div 
                      className="office-content"
                      dangerouslySetInnerHTML={{ 
                        __html: getLocalizedContent(descriptionsByType['WORK_DETAILS'].content, locale) 
                      }}
                    />
                  </CardBody>
                </Card>
              )}
            </div>
          </TabPanel>

          {/* Organizational Structure Tab */}
          <TabPanel>
            <div className="tab-content">
              {descriptionsByType['ORGANIZATIONAL_STRUCTURE'] && (
                <Card className="mb-4">
                  <CardBody>
                    <h3 className="section-title">
                      <Organization size={20} />
                      {t('organizationalStructure')}
                    </h3>
                    <div 
                      className="office-content"
                      dangerouslySetInnerHTML={{ 
                        __html: getLocalizedContent(descriptionsByType['ORGANIZATIONAL_STRUCTURE'].content, locale) 
                      }}
                    />
                  </CardBody>
                </Card>
              )}

              {departments.length > 0 && (
                <Card>
                  <CardBody>
                    <h3 className="section-title">
                      <Building size={20} />
                      {t('departments')}
                    </h3>
                    
                    <Accordion>
                      {departments.map(dept => (
                        <AccordionItem
                          key={dept.id}
                          title={
                            <div className="department-title">
                              <span>{getLocalizedContent(dept.name, locale)}</span>
                              {dept.isActive && (
                                <Tag type="green" size="sm">
                                  {locale === 'ne' ? 'सक्रिय' : 'Active'}
                                </Tag>
                              )}
                            </div>
                          }
                        >
                          <div className="department-details">
                            {dept.description && (
                              <p className="mb-3">
                                {getLocalizedContent(dept.description, locale)}
                              </p>
                            )}
                            
                            {dept.headOfDepartment && (
                              <div className="dept-head">
                                <User size={16} />
                                <span>
                                  <strong>
                                    {locale === 'ne' ? 'विभाग प्रमुख:' : 'Head of Department:'}
                                  </strong>{' '}
                                  {dept.headOfDepartment}
                                </span>
                              </div>
                            )}
                            
                            {dept.contactInfo && (
                              <div className="dept-contact">
                                {dept.contactInfo.phone && (
                                  <div className="contact-item">
                                    <Phone size={14} />
                                    <a href={`tel:${dept.contactInfo.phone}`}>
                                      {dept.contactInfo.phone}
                                    </a>
                                  </div>
                                )}
                                {dept.contactInfo.email && (
                                  <div className="contact-item">
                                    <Email size={14} />
                                    <a href={`mailto:${dept.contactInfo.email}`}>
                                      {dept.contactInfo.email}
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardBody>
                </Card>
              )}
            </div>
          </TabPanel>

          {/* Employees Tab */}
          <TabPanel>
            <div className="tab-content">
              {employees.length > 0 ? (
                <Card>
                  <CardBody>
                    <h3 className="section-title">
                      <User size={20} />
                      {t('employees')} ({employees.length})
                    </h3>
                    
                    <StructuredListWrapper>
                      <StructuredListHead>
                        <StructuredListRow head>
                          <StructuredListCell head>
                            {locale === 'ne' ? 'नाम' : 'Name'}
                          </StructuredListCell>
                          <StructuredListCell head>
                            {locale === 'ne' ? 'पद' : 'Position'}
                          </StructuredListCell>
                          <StructuredListCell head>
                            {locale === 'ne' ? 'विभाग' : 'Department'}
                          </StructuredListCell>
                          <StructuredListCell head>
                            {locale === 'ne' ? 'सम्पर्क' : 'Contact'}
                          </StructuredListCell>
                        </StructuredListRow>
                      </StructuredListHead>
                      
                      <StructuredListBody>
                        {employees.map(employee => (
                          <StructuredListRow key={employee.id}>
                            <StructuredListCell>
                              <div className="employee-name">
                                {getLocalizedContent(employee.fullName, locale)}
                                {!employee.isActive && (
                                  <Tag type="red" size="sm" className="ml-2">
                                    {locale === 'ne' ? 'निष्क्रिय' : 'Inactive'}
                                  </Tag>
                                )}
                              </div>
                            </StructuredListCell>
                            <StructuredListCell>
                              {employee.position ? getLocalizedContent(employee.position, locale) : '-'}
                            </StructuredListCell>
                            <StructuredListCell>
                              {employee.department ? getLocalizedContent(employee.department.name, locale) : '-'}
                            </StructuredListCell>
                            <StructuredListCell>
                              <div className="employee-contact">
                                {employee.email && (
                                  <a href={`mailto:${employee.email}`} className="contact-link">
                                    <Email size={14} />
                                  </a>
                                )}
                                {employee.phone && (
                                  <a href={`tel:${employee.phone}`} className="contact-link">
                                    <Phone size={14} />
                                  </a>
                                )}
                              </div>
                            </StructuredListCell>
                          </StructuredListRow>
                        ))}
                      </StructuredListBody>
                    </StructuredListWrapper>
                  </CardBody>
                </Card>
              ) : (
                <Card>
                  <CardBody>
                    <p className="text-center text-gray-500">
                      {locale === 'ne' ? 'कुनै कर्मचारी जानकारी उपलब्ध छैन।' : 'No employee information available.'}
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </TabPanel>

          {/* Contact Details Tab */}
          <TabPanel>
            <div className="tab-content">
              {officeSettings && (
                <Card>
                  <CardBody>
                    <h3 className="section-title">
                      <Building size={20} />
                      {locale === 'ne' ? 'सम्पर्क विवरण' : 'Contact Details'}
                    </h3>
                    
                    <div className="contact-grid">
                      <div className="contact-section">
                        <h4>{locale === 'ne' ? 'कार्यालय जानकारी' : 'Office Information'}</h4>
                        <div className="contact-details">
                          <div className="contact-item">
                            <Building size={16} />
                            <div>
                              <strong>{locale === 'ne' ? 'कार्यालयको नाम:' : 'Office Name:'}</strong>
                              <span>{getLocalizedContent(officeSettings.officeName, locale)}</span>
                            </div>
                          </div>
                          
                          {officeSettings.officeType && (
                            <div className="contact-item">
                              <Organization size={16} />
                              <div>
                                <strong>{locale === 'ne' ? 'प्रकार:' : 'Type:'}</strong>
                                <span>{getLocalizedContent(officeSettings.officeType, locale)}</span>
                              </div>
                            </div>
                          )}
                          
                          {officeSettings.address && (
                            <div className="contact-item">
                              <Location size={16} />
                              <div>
                                <strong>{locale === 'ne' ? 'ठेगाना:' : 'Address:'}</strong>
                                <span>{getLocalizedContent(officeSettings.address, locale)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="contact-section">
                        <h4>{locale === 'ne' ? 'सम्पर्क जानकारी' : 'Contact Information'}</h4>
                        <div className="contact-details">
                          {officeSettings.phone && (
                            <div className="contact-item">
                              <Phone size={16} />
                              <div>
                                <strong>{locale === 'ne' ? 'फोन:' : 'Phone:'}</strong>
                                <a href={`tel:${officeSettings.phone}`}>{officeSettings.phone}</a>
                              </div>
                            </div>
                          )}
                          
                          {officeSettings.email && (
                            <div className="contact-item">
                              <Email size={16} />
                              <div>
                                <strong>{locale === 'ne' ? 'इमेल:' : 'Email:'}</strong>
                                <a href={`mailto:${officeSettings.email}`}>{officeSettings.email}</a>
                              </div>
                            </div>
                          )}
                          
                          {officeSettings.website && (
                            <div className="contact-item">
                              <Information size={16} />
                              <div>
                                <strong>{locale === 'ne' ? 'वेबसाइट:' : 'Website:'}</strong>
                                <a href={officeSettings.website} target="_blank" rel="noopener noreferrer">
                                  {officeSettings.website}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <style jsx>{`
        .tab-content {
          padding: 1rem 0;
        }

        .section-title,
        .card-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--nepal-gray-900);
          margin-bottom: 1rem;
        }

        .office-content {
          line-height: 1.7;
          color: var(--nepal-gray-700);
        }

        .office-content :global(h1),
        .office-content :global(h2),
        .office-content :global(h3) {
          color: var(--nepal-gray-900);
          margin: 1rem 0 0.5rem 0;
        }

        .office-content :global(p) {
          margin-bottom: 1rem;
        }

        .office-content :global(ul),
        .office-content :global(ol) {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .department-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .department-details {
          padding: 1rem 0;
        }

        .dept-head {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .dept-contact {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .contact-item a {
          color: var(--nepal-blue);
          text-decoration: none;
        }

        .contact-item a:hover {
          text-decoration: underline;
        }

        .employee-contact {
          display: flex;
          gap: 0.5rem;
        }

        .contact-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: var(--nepal-blue);
          color: white;
          border-radius: 50%;
          text-decoration: none;
        }

        .contact-link:hover {
          background: var(--nepal-blue-dark);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .contact-section h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--nepal-gray-900);
          margin-bottom: 1rem;
          border-bottom: 2px solid var(--nepal-blue);
          padding-bottom: 0.5rem;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-details .contact-item {
          align-items: flex-start;
        }

        .contact-details .contact-item div {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .contact-details .contact-item strong {
          font-size: 0.875rem;
          color: var(--nepal-gray-600);
        }

        .department-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .department-item {
          padding: 1rem;
          border: 1px solid var(--nepal-gray-200);
          border-radius: 6px;
          background: var(--nepal-gray-50);
        }

        .department-item h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--nepal-gray-900);
        }

        .office-contact-card .contact-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .office-contact-card .contact-icon {
          color: var(--nepal-blue);
        }

        .office-contact-card .contact-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
        }

        .office-contact-card .contact-subtitle {
          font-size: 0.875rem;
          color: var(--nepal-gray-600);
          margin: 0;
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .department-grid {
            grid-template-columns: 1fr;
          }

          .dept-contact {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}