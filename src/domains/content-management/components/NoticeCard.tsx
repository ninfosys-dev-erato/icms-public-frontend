"use client";

import {
  Tile,
  Tag,
  Button,
  OverflowMenu,
  OverflowMenuItem,
} from "@carbon/react";
import {
  Download,
  View,
  Calendar,
  Building,
  Time,
  ArrowRight,
} from "@carbon/icons-react";
import { Notice } from "@/models/notice";
import { formatBSDate, parseBSDate } from "@/lib/calendars/bs";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface NoticeCardProps {
  notice: Notice;
  locale?: "ne" | "en";
  showOffice?: boolean;
  showStats?: boolean;
  compact?: boolean;
}

export default function NoticeCard({
  notice,
  locale = "ne",
  showOffice = true,
  showStats = true,
  compact = false,
}: NoticeCardProps) {
  const t = useTranslations("notice");

  const title = locale === "en" && notice.title_en ? notice.title_en : notice.title;
  const summary = locale === "en" && notice.summary_en ? notice.summary_en : notice.summary;

  const formatDate = (dateString: string, bsDateString?: string) => {
    if (locale === "ne" && bsDateString) {
      const bsDate = parseBSDate(bsDateString);
      if (bsDate) {
        return formatBSDate(bsDate, "nepali", true);
      }
    }
    
    return new Date(dateString).toLocaleDateString(
      locale === "ne" ? "ne-NP" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, "red" | "blue" | "green" | "purple" | "magenta"> = {
      notice: "blue",
      circular: "green",
      tender: "purple",
      vacancy: "magenta",
      result: "red",
    };
    return colors[type] || "blue";
  };

  const handleDownload = async (attachmentUrl: string) => {
    // Increment download count via API
    try {
      await fetch(`/api/notices/${notice.id}/download`, { method: "POST" });
    } catch (error) {
      console.error("Failed to track download:", error);
    }
    
    // Open download link
    window.open(attachmentUrl, "_blank");
  };

  return (
    <Tile className={`notice-card ${compact ? "notice-card--compact" : ""}`}>
      <div className="notice-card__header">
        <div className="notice-card__meta">
          <Tag type={getTypeColor(notice.type)} size="sm">
            {t(`type.${notice.type}`)}
          </Tag>
          
          {notice.priority === "urgent" && (
            <Tag type="red" size="sm">
              {t("priority.urgent")}
            </Tag>
          )}
          
          {notice.priority === "high" && (
            <Tag type="magenta" size="sm">
              {t("priority.high")}
            </Tag>
          )}
        </div>

        <div className="notice-card__date">
          <Calendar size={16} />
          <span>{formatDate(notice.publishedAt, notice.bsDate)}</span>
        </div>
      </div>

      <div className="notice-card__content">
        <h3 className="notice-card__title">
          <Link href={`/content/notice-board/${notice.slug}`} className="notice-card__title-link">
            {title}
          </Link>
        </h3>

        {summary && !compact && (
          <p className="notice-card__summary">{summary}</p>
        )}

        {notice.referenceNo && (
          <div className="notice-card__reference">
            <strong>{t("referenceNo")}: </strong>
            {notice.referenceNo}
          </div>
        )}

        {showOffice && (
          <div className="notice-card__office">
            <Building size={16} />
            <span>{notice.officeId}</span>
          </div>
        )}

        {notice.expiryDate && (
          <div className="notice-card__expiry">
            <Time size={16} />
            <span>
              {t("expiryDate")}: {formatDate(notice.expiryDate, notice.expiryDateBS)}
            </span>
          </div>
        )}
      </div>

      <div className="notice-card__footer">
        <div className="notice-card__actions">
          <Button
            kind="primary"
            size="sm"
            renderIcon={ArrowRight}
            as={Link}
            href={`/content/notice-board/${notice.slug}`}
          >
            {t("readMore")}
          </Button>

          {notice.attachments.length > 0 && (
            <OverflowMenu size="sm" flipped>
              {notice.attachments.map((attachment, index) => (
                <OverflowMenuItem
                  key={index}
                  itemText={attachment.name}
                  onClick={() => handleDownload(attachment.url)}
                />
              ))}
            </OverflowMenu>
          )}
        </div>

        {showStats && (
          <div className="notice-card__stats">
            <div className="notice-card__stat">
              <View size={16} />
              <span>{notice.viewCount || 0}</span>
            </div>
            
            {notice.attachments.length > 0 && (
              <div className="notice-card__stat">
                <Download size={16} />
                <span>{notice.downloadCount || 0}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {notice.tags.length > 0 && !compact && (
        <div className="notice-card__tags">
          {notice.tags.slice(0, 3).map((tag, index) => (
            <Tag key={index} type="outline" size="sm">
              {tag}
            </Tag>
          ))}
          {notice.tags.length > 3 && (
            <span className="notice-card__tags-more">
              +{notice.tags.length - 3} {t("moreTags")}
            </span>
          )}
        </div>
      )}

      <style jsx>{`
        .notice-card {
          padding: 1rem;
          margin-bottom: 1rem;
          border-left: 4px solid var(--cds-border-interactive);
          transition: all 0.2s ease;
        }

        .notice-card:hover {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          border-left-color: var(--cds-link-primary);
        }

        .notice-card--compact {
          padding: 0.75rem;
        }

        .notice-card__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .notice-card__meta {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .notice-card__date {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--cds-text-secondary);
          font-size: 0.875rem;
        }

        .notice-card__content {
          margin-bottom: 1rem;
        }

        .notice-card__title {
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.4;
        }

        .notice-card__title-link {
          color: var(--cds-text-primary);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .notice-card__title-link:hover {
          color: var(--cds-link-primary);
        }

        .notice-card__summary {
          margin: 0 0 0.75rem 0;
          color: var(--cds-text-secondary);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .notice-card__reference,
        .notice-card__office,
        .notice-card__expiry {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
          color: var(--cds-text-secondary);
        }

        .notice-card__footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .notice-card__actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .notice-card__stats {
          display: flex;
          gap: 0.75rem;
        }

        .notice-card__stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--cds-text-secondary);
          font-size: 0.875rem;
        }

        .notice-card__tags {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--cds-border-subtle);
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .notice-card__tags-more {
          font-size: 0.875rem;
          color: var(--cds-text-secondary);
        }

        @media (max-width: 672px) {
          .notice-card__header {
            flex-direction: column;
            align-items: flex-start;
          }

          .notice-card__footer {
            flex-direction: column;
            align-items: flex-start;
          }

          .notice-card__stats {
            align-self: stretch;
            justify-content: space-around;
          }
        }
      `}</style>
    </Tile>
  );
}