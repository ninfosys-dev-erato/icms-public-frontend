"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  Grid,
  Column,
  Tile,
  Tag,
  Button,
  InlineNotification,
} from "@carbon/react";
import { Printer, Share } from "@carbon/icons-react";
import {
  ContentResponse,
  Category,
} from "@/domains/content-management/types/content";
import { AttachmentList } from "./AttachmentList";
import { ContentSidebar } from "./ContentSidebar";
import styles from "./ContentView.module.css";

interface ContentViewProps {
  content: ContentResponse;
  category: Category;
  categoryPath: Category[];
  locale: "en" | "ne";
}

export function ContentView({
  content,
  category,
  categoryPath,
  locale,
}: ContentViewProps) {
  const t = useTranslations("content");
  const currentContent =
    (content.content as Record<string, string>)[locale] ||
    (content.content as Record<string, string>).en;
  const currentTitle =
    (content.title as Record<string, string>)[locale] ||
    (content.title as Record<string, string>).en;
  const currentExcerpt = content.excerpt
    ? (content.excerpt as Record<string, string>)[locale] ||
      (content.excerpt as Record<string, string>).en
    : "";

  const publishedDate = content.publishedAt
    ? new Date(content.publishedAt)
    : null;
  const updatedDate = new Date(content.updatedAt);

  return (
    <Grid className={styles.contentContainer}>
      <Column sm={4} md={8} lg={12} className={styles.contentGrid}>
        <Tile className={styles.mainContent}>
          <article>
            <header className={styles.contentHeader}>
              {/* Category, Date, Featured */}
              {/* <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <Tag type="blue">
                  {(category.name as Record<string, string>)[locale] || (category.name as Record<string, string>).en}
                </Tag>
                {publishedDate && (
                  <Tag type="gray">
                    {format(publishedDate, 'PPP')}
                  </Tag>
                )}
                {content.featured && (
                  <Tag type="magenta">{t('featured')}</Tag>
                )}
              </div> */}
              <div className={styles.titlePrintShare}>
                <h1
                  className={styles.contentTitle}
                  style={{ marginBottom: "0.5rem" }}
                >
                  {currentTitle}
                </h1>
                <div
                  className={styles.actionButtons}
                  style={{ display: "flex", gap: "1rem" }}
                >
                  <div
                    className={styles.actionButton}
                    onClick={() => window.print()}
                    title={t("actions.print")}
                    aria-label={t("actions.print")}
                  >
                    <Printer size={20} />
                  </div>
                  <div
                    className={styles.actionButton}
                    onClick={() =>
                      navigator.share?.({
                        title: currentTitle,
                        text: currentExcerpt,
                        url: window.location.href,
                      })
                    }
                    title={t("actions.share")}
                    aria-label={t("actions.share")}
                  >
                    <Share size={20} />
                  </div>
                </div>
              </div>
              <div className={styles.metaItem}>
                {/* <span className={styles.metaLabel}>{t("meta.updated")}:</span> */}
                <span className={styles.metaValue}>
                  {format(updatedDate, "PPP")}
                </span>
              </div>
              {currentExcerpt && (
                <p
                  className={styles.contentExcerpt}
                  style={{ marginBottom: "1rem" }}
                >
                  {currentExcerpt}
                </p>
              )}
            </header>
            <div
              className={styles.contentBody}
              dangerouslySetInnerHTML={{ __html: currentContent }}
            />
            {content.attachments && content.attachments.length > 0 && (
              <section
                className={styles.attachmentsSection}
                style={{ marginTop: "2rem" }}
              >
                <h3 className={styles.attachmentsTitle}>
                  {t("attachments.title")}
                </h3>
                <AttachmentList
                  attachments={content.attachments}
                  locale={locale}
                />
              </section>
            )}
            <footer className={styles.contentFooter}>
              <div
                className={styles.metaFooter}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* <div
                  className={styles.metaInfo}
                  style={{ display: "flex", gap: "2rem" }}
                >
                  {content.createdBy && (
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>
                        {t("meta.author")}:
                      </span>
                      <span className={styles.metaValue}>
                        {typeof content.createdBy === "object" &&
                        content.createdBy.firstName &&
                        content.createdBy.lastName
                          ? `${content.createdBy.firstName} ${content.createdBy.lastName}`
                          : typeof content.createdBy === "string"
                            ? content.createdBy
                            : "Unknown Author"}
                      </span>
                    </div>
                  )}
                </div> */}
              </div>
            </footer>
          </article>
        </Tile>
        {/* Sidebar (optional, can be added as a Column) */}
        {/* <Column sm={4} md={4} lg={4} className={styles.sidebar}>
          <ContentSidebar 
            category={category}
            categoryPath={categoryPath}
            currentContent={content}
            locale={locale}
          />
        </Column> */}
      </Column>
    </Grid>
  );
}
