"use client";
interface PDFPreviewProps {
  fileUrl: string;
}

export default function PDFPreview({ fileUrl }: PDFPreviewProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',

        width: '100%',
        minHeight: '60vh',
        // background: '#fff',
        // padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      {fileUrl ? (
        <iframe
          src={fileUrl}
          style={{
            width: '100%',
            // maxWidth: '900px',
            height: '70vh',
            minHeight: '400px',
            border: 'none',
            // boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            // borderRadius: '8px',
          }}
          title="PDF Preview"
          allowFullScreen
        />
      ) : (
        <div style={{ color: 'orange', padding: '8px', background: '#fffbe6'}}>
          PDF URL missing for preview
        </div>
      )}
    </div>
  );
}