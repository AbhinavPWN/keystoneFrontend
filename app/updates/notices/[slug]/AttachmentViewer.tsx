'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { StrapiNotice } from '@/lib/mapStrapiNotice';

// ✅ Use matching worker from pdfjs-dist (keeps API & worker in sync)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export const AttachmentViewer = ({ attachments }: { attachments?: StrapiNotice['attachments'] }) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-8 space-y-8">
      <h2 className="text-xl font-semibold mb-4">Attachments</h2>

      {attachments.map((attachment, idx) => {
        if (!attachment?.file?.url) return null;
        const url = attachment.file.url;

        return (
          <div key={attachment.id} className="border rounded-2xl overflow-hidden p-4 bg-gray-50">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h3 className="mb-2 font-medium">
                {attachment.label || `File ${idx + 1}`}
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => window.open(url, '_blank', 'noopener')}
                >
                  Open Full PDF
                </button>
                <a
                  href={url}
                  download
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Download
                </a>
              </div>
            </div>

            <PDFViewer url={url} />
          </div>
        );
      })}
    </div>
  );
};

// ==========================
// PDFViewer with toolbar, zoom, gestures, thumbnails
// ==========================
function PDFViewer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  // Document state
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  // Zoom state (1 = fit to width)
  const [zoom, setZoom] = useState<number>(1);

  // UI state
  const [showThumbs, setShowThumbs] = useState<boolean>(true);
  const THUMB_COUNT = 6;

  // Measure container width (responsive)
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setContainerWidth(Math.max(320, w - 16));
      }
    };
    measure();

    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('orientationchange', measure);
    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const onDocLoad = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setZoom(1);
  }, []);

  // Toolbar actions
  const canPrev = pageNumber > 1;
  const canNext = numPages ? pageNumber < numPages : false;

  const zoomIn = useCallback(() => setZoom((z) => Math.min(3, round2(z * 1.2))), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(0.25, round2(z / 1.2))), []);
  const resetZoom = useCallback(() => setZoom(1), []);
  const goPrev = useCallback(() => setPageNumber((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(
    () => setPageNumber((p) => Math.min(numPages ?? p, p + 1)),
    [numPages]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn(); }
      else if (e.key === '-') { e.preventDefault(); zoomOut(); }
      else if (e.key === '0') resetZoom();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, zoomIn, zoomOut, resetZoom]);

  // Wheel zoom with Ctrl/Cmd
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) zoomIn();
        else zoomOut();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomIn, zoomOut]);

  // Touch gestures: pinch-to-zoom & swipe page
  usePinchAndSwipe<HTMLDivElement>({
    ref: containerRef,
    onPinch: (scaleDelta) => setZoom((z) => clamp(round2(z * scaleDelta), 0.25, 3)),
    onSwipeLeft: () => canNext && goNext(),
    onSwipeRight: () => canPrev && goPrev(),
  });

  const pageWidth = useMemo(() => Math.round(containerWidth * zoom), [containerWidth, zoom]);

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <button onClick={goPrev} disabled={!canPrev} className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">◀</button>
          <span className="text-sm px-2">Page {pageNumber} {numPages ? `of ${numPages}` : ''}</span>
          <button onClick={goNext} disabled={!canNext} className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">▶</button>
        </div>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        <div className="flex items-center gap-1">
          <button onClick={zoomOut} className="px-2 py-1 bg-gray-200 rounded">−</button>
          <span className="text-sm w-14 text-center select-none">{Math.round(zoom * 100)}%</span>
          <button onClick={zoomIn} className="px-2 py-1 bg-gray-200 rounded">+</button>
          <button onClick={resetZoom} className="px-2 py-1 bg-gray-200 rounded">⤧</button>
        </div>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        <button onClick={() => setShowThumbs((s) => !s)} className="px-2 py-1 bg-gray-200 rounded">
          {showThumbs ? 'Hide thumbnails' : 'Show thumbnails'}
        </button>
      </div>

      {/* Viewer area */}
      <div
        ref={containerRef}
        className="border rounded-lg p-2 bg-white h-[600px] overflow-auto touch-pan-y"
        style={{ touchAction: 'pan-y' }}
      >
        <Document file={url} onLoadSuccess={onDocLoad} onLoadError={(err) => console.error('PDF load error:', err.message)}
          loading={<div className="animate-pulse bg-gray-200 h-64 w-full rounded" />}>
          <Page pageNumber={pageNumber} width={pageWidth} renderTextLayer renderAnnotationLayer className="mx-auto" />
        </Document>
      </div>

      {/* Thumbnails */}
      {numPages && showThumbs && (
        <div className="mt-3">
          <p className="text-sm mb-2 text-gray-600">Quick preview</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {Array.from({ length: Math.min(numPages, THUMB_COUNT) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPageNumber(n)}
                className={`border rounded overflow-hidden bg-white hover:ring-2 hover:ring-blue-400 focus:ring-2 focus:ring-blue-500 ${pageNumber === n ? 'ring-2 ring-blue-500' : ''}`}
              >
                <Document file={url}>
                  <Page pageNumber={n} width={140} renderTextLayer={false} renderAnnotationLayer={false} />
                </Document>
                <div className="text-xs text-center py-1 text-gray-600">#{n}</div>
              </button>
            ))}
          </div>
          {numPages > THUMB_COUNT && (
            <p className="text-xs text-gray-500 mt-1">
              Showing first {THUMB_COUNT} of {numPages} pages.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================
// Helpers & hooks
// ==========================
function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function usePinchAndSwipe<T extends HTMLElement>({
  ref,
  onPinch,
  onSwipeLeft,
  onSwipeRight,
}: {
  ref: React.RefObject<T | null>;
  onPinch?: (scaleDelta: number) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let touching = false;
    let startX = 0;
    let startY = 0;
    let pinchActive = false;
    let startDist = 0;

    const getDist = (t1: Touch, t2: Touch) => {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.hypot(dx, dy);
    };

    const onTouchStart = (e: TouchEvent): void => {
      if (e.touches.length === 1) {
        touching = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        pinchActive = true;
        startDist = getDist(e.touches[0], e.touches[1]);
      }
    };

    const onTouchMove = (e: TouchEvent): void => {
      if (pinchActive && e.touches.length === 2 && onPinch) {
        const dist = getDist(e.touches[0], e.touches[1]);
        const delta = dist / (startDist || dist);
        const scaleDelta = clamp(delta, 0.9, 1.1);
        onPinch(scaleDelta);
        startDist = dist;
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent): void => {
      if (touching && !pinchActive) {
        const touch = e.changedTouches[0];
        if (!touch) return;
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDx > 50 && absDy < 40) {
          if (dx < 0) {
            if (onSwipeLeft) onSwipeLeft();
          } else {
            if (onSwipeRight) onSwipeRight();
          }
        }
      }

      if (e.touches.length === 0) {
        touching = false;
        pinchActive = false;
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [ref, onPinch, onSwipeLeft, onSwipeRight]);
}
