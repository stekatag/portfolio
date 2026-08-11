import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "../ui/Icon/Icon";

const PDF_URL = "/assets/cv.pdf";
const MIN_ZOOM = 0.7;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.15;
const MAX_LOAD_ATTEMPTS = 3;

type PointerPosition = { x: number; y: number };

export default function CvViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const renderRetryRef = useRef<number | undefined>(undefined);
  const pointersRef = useRef(new Map<number, PointerPosition>());
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    let destroyLoadingTask = () => {};
    let retryTimer: number | undefined;

    const loadPdf = async (attempt = 0) => {
      try {
        const { GlobalWorkerOptions, getDocument } = await import("pdfjs-dist");
        if (!active) return;

        GlobalWorkerOptions.workerSrc = pdfWorker;
        const loadingTask = getDocument({ url: PDF_URL, disableRange: true, disableStream: true });
        destroyLoadingTask = () => loadingTask.destroy();
        const document = await loadingTask.promise;
        if (!active) return;

        setPdf(document);
        setPageCount(document.numPages);
        setStatus("ready");
      } catch {
        if (!active) return;
        if (attempt < MAX_LOAD_ATTEMPTS - 1) {
          retryTimer = window.setTimeout(() => void loadPdf(attempt + 1), 300 * (attempt + 1));
          return;
        }
        setStatus("error");
      }
    };

    void loadPdf();

    return () => {
      active = false;
      destroyLoadingTask();
      window.clearTimeout(retryTimer);
    };
  }, []);

  const renderPage = useCallback(async (attempt = 0) => {
    const canvas = canvasRef.current;
    const pageContainer = pageRef.current;
    const viewport = viewportRef.current;
    if (!pdf || !canvas || !pageContainer || !viewport) return;

    renderTaskRef.current?.cancel();
    let page;
    try {
      page = await pdf.getPage(pageNumber);
    } catch {
      if (attempt === 0) renderRetryRef.current = window.setTimeout(() => void renderPage(1), 150);
      return;
    }
    const initialViewport = page.getViewport({ scale: 1 });
    const availableWidth = Math.max(viewport.clientWidth - 32, 280);
    const fitScale = Math.min(1.35, availableWidth / initialViewport.width);
    const cssViewport = page.getViewport({ scale: fitScale * zoom });
    const pixelScale = 2;
    const renderViewport = page.getViewport({ scale: fitScale * zoom * pixelScale });
    const context = canvas.getContext("2d");

    if (!context) return;
    canvas.width = Math.ceil(renderViewport.width);
    canvas.height = Math.ceil(renderViewport.height);
    pageContainer.style.width = `${Math.ceil(cssViewport.width)}px`;
    pageContainer.style.height = `${Math.ceil(cssViewport.height)}px`;

    const task = page.render({ canvas, canvasContext: context, viewport: renderViewport });
    renderTaskRef.current = task;

    try {
      await task.promise;
    } catch {
      if (attempt === 0) renderRetryRef.current = window.setTimeout(() => void renderPage(1), 150);
    }
  }, [pageNumber, pdf, zoom]);

  useEffect(() => {
    void renderPage();
  }, [renderPage]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !pdf) return;

    const observer = new ResizeObserver(() => void renderPage());
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [pdf, renderPage]);

  useEffect(() => () => {
    renderTaskRef.current?.cancel();
    window.clearTimeout(renderRetryRef.current);
  }, []);

  const canZoomOut = zoom > MIN_ZOOM;
  const canZoomIn = zoom < MAX_ZOOM;
  const updateZoom = (amount: number) => {
    setZoom((current) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((current + amount).toFixed(2)))));
  };

  const fullscreen = async () => {
    try {
      await viewportRef.current?.requestFullscreen();
    } catch {
      // Fullscreen is optional and can be blocked by a browser or device setting.
    }
  };

  const getPinchDistance = () => {
    const [first, second] = [...pointersRef.current.values()];
    return first && second ? Math.hypot(first.x - second.x, first.y - second.y) : 0;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointersRef.current.size === 2) {
      pinchRef.current = { distance: getPinchDistance(), zoom };
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const pinch = pinchRef.current;
    if (!pinch || pointersRef.current.size !== 2) return;

    const distance = getPinchDistance();
    if (!distance || !pinch.distance) return;
    event.preventDefault();
    setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((pinch.zoom * distance / pinch.distance).toFixed(2)))));
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
  };

  return (
    <section className="cv-viewer" aria-label="CV document viewer">
      {status === "loading" ? (
        <div className="cv-viewer__toolbar cv-viewer__toolbar--skeleton" aria-hidden="true"><span /><span /><span /></div>
      ) : (
        <div className="cv-viewer__toolbar" aria-label="CV controls">
          {pageCount > 1 && <div className="cv-viewer__page-controls">
            <button type="button" className="cv-viewer__icon-button" onClick={() => setPageNumber((current) => current - 1)} disabled={pageNumber <= 1} aria-label="Previous page" title="Previous page">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" className="cv-viewer__icon-button" onClick={() => setPageNumber((current) => current + 1)} disabled={pageNumber >= pageCount} aria-label="Next page" title="Next page">
              <span aria-hidden="true">→</span>
            </button>
          </div>}

          <div className="cv-viewer__zoom-controls">
            <button type="button" className="cv-viewer__icon-button" onClick={() => updateZoom(-ZOOM_STEP)} disabled={!canZoomOut} aria-label="Zoom out" title="Zoom out">−</button>
            <button type="button" className="cv-viewer__zoom-value" onClick={() => setZoom(1)} title="Reset zoom to 100%" aria-label="Reset zoom to 100%">{Math.round(zoom * 100)}%</button>
            <button type="button" className="cv-viewer__icon-button" onClick={() => updateZoom(ZOOM_STEP)} disabled={!canZoomIn} aria-label="Zoom in" title="Zoom in">+</button>
          </div>

          <div className="cv-viewer__document-actions">
            <button type="button" className="cv-viewer__icon-button" onClick={() => void fullscreen()} aria-label="View CV fullscreen" title="View CV fullscreen"><span aria-hidden="true">⛶</span></button>
            <a className="cv-viewer__download" href={PDF_URL} download="Stefan Gogov CV.pdf" aria-label="Download Stefan's CV as a PDF" title="Download Stefan's CV as a PDF"><Icon icon="download" size="1.1em" /></a>
          </div>
        </div>
      )}

      <div className={`cv-viewer__document${status === "loading" ? " cv-viewer__document--loading" : ""}`} ref={viewportRef} aria-busy={status === "loading"} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}>
        {status === "loading" && <><p className="sr-only" role="status">Loading CV preview.</p><div className="cv-viewer__skeleton" aria-hidden="true"><span className="cv-viewer__skeleton-photo" /><span className="cv-viewer__skeleton-title" /><span className="cv-viewer__skeleton-line" /><span className="cv-viewer__skeleton-line cv-viewer__skeleton-line--short" /><span className="cv-viewer__skeleton-heading" /><span className="cv-viewer__skeleton-line" /><span className="cv-viewer__skeleton-line" /><span className="cv-viewer__skeleton-line cv-viewer__skeleton-line--medium" /></div></>}
        {status === "error" && <p className="cv-viewer__message">The CV preview could not load. <a href={PDF_URL}>Open the PDF directly</a>.</p>}
        {status === "ready" && <div ref={pageRef} className="cv-viewer__page" aria-label={`Page ${pageNumber} of Stefan Gogov's CV`}><canvas ref={canvasRef} className="cv-viewer__canvas" /></div>}
      </div>
    </section>
  );
}
