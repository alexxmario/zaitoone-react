import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 146;
const BLACK_INTRO_FRAMES = 24;
const BATCH_SIZE = 15;

const getFrameSrc = (index) =>
  `/video/frames/frame_${String(index + 1).padStart(4, '0')}.jpg`;

const ScrollVideo = ({
  overlayContent,
  scrollMultiplier = 1,
  enableLetterbox = false,
  letterboxHeight = 12,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef(0);
  const loadingRef = useRef(new Set());
  const overlayRef = useRef(null);
  const topBarRef = useRef(null);
  const bottomBarRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [introFading, setIntroFading] = useState(false);

  // Load a range of frames
  const loadFrameRange = useCallback((start, end) => {
    for (let i = start; i <= end && i < TOTAL_FRAMES; i++) {
      if (imagesRef.current[i] || loadingRef.current.has(i)) continue;
      loadingRef.current.add(i);
      const img = new Image();
      img.onload = () => {
        imagesRef.current[i] = img;
        loadingRef.current.delete(i);
      };
      img.onerror = () => {
        loadingRef.current.delete(i);
      };
      img.src = getFrameSrc(i);
    }
  }, []);

  // Preload first batch + black intro frames, then signal loaded
  useEffect(() => {
    let cancelled = false;
    const firstBatchEnd = Math.min(BATCH_SIZE, TOTAL_FRAMES) - 1;
    let loaded = 0;
    const needed = firstBatchEnd + 1;

    for (let i = 0; i <= firstBatchEnd; i++) {
      loadingRef.current.add(i);
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        imagesRef.current[i] = img;
        loadingRef.current.delete(i);
        loaded++;
        if (loaded >= needed) setIsLoaded(true);
      };
      img.onerror = () => {
        if (cancelled) return;
        loadingRef.current.delete(i);
        loaded++;
        if (loaded >= needed) setIsLoaded(true);
      };
      img.src = getFrameSrc(i);
    }

    const fallback = setTimeout(() => {
      if (!cancelled && loaded > 0) setIsLoaded(true);
    }, 3000);

    return () => { cancelled = true; clearTimeout(fallback); };
  }, []);

  // Draw a frame on the canvas (with nearest-loaded fallback)
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let img = imagesRef.current[index];
    // Fallback: find nearest loaded frame
    if (!img) {
      for (let d = 1; d < TOTAL_FRAMES; d++) {
        if (index - d >= 0 && imagesRef.current[index - d]) { img = imagesRef.current[index - d]; break; }
        if (index + d < TOTAL_FRAMES && imagesRef.current[index + d]) { img = imagesRef.current[index + d]; break; }
      }
    }
    if (!img) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let drawW, drawH, drawX, drawY;
    if (canvasRatio > imgRatio) {
      drawW = width; drawH = width / imgRatio; drawX = 0; drawY = (height - drawH) / 2;
    } else {
      drawH = height; drawW = height * imgRatio; drawX = (width - drawW) / 2; drawY = 0;
    }
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Auto-fade the black intro
  useEffect(() => {
    if (!isLoaded) return;
    const t = setTimeout(() => setIntroFading(true), 1500);
    return () => clearTimeout(t);
  }, [isLoaded]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (isLoaded) drawFrame(currentFrameRef.current);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [isLoaded, drawFrame]);

  // Scroll-driven rendering — no setState, direct DOM writes
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isLoaded) return;

    let rafId;
    let introFadedByScroll = false;

    const update = () => {
      const scrollY = window.scrollY;
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;

      const progress = Math.max(0, Math.min(1,
        (scrollY - containerTop) / containerHeight
      ));

      const rawFrame = progress * (TOTAL_FRAMES - 1) * scrollMultiplier;
      const targetFrame = Math.min(Math.round(rawFrame), TOTAL_FRAMES - 1);

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        drawFrame(targetFrame);

        // Progressive loading: load frames around current position
        const batchStart = Math.max(0, targetFrame - 5);
        const batchEnd = Math.min(TOTAL_FRAMES - 1, targetFrame + BATCH_SIZE);
        loadFrameRange(batchStart, batchEnd);
      }

      // Intro fade on scroll past black frames (one-time setState is fine)
      if (!introFadedByScroll && targetFrame >= BLACK_INTRO_FRAMES) {
        introFadedByScroll = true;
        setIntroFading(true);
      }

      // Overlay opacity — direct DOM write
      if (overlayRef.current) {
        const opacity = targetFrame <= BLACK_INTRO_FRAMES
          ? 1
          : Math.max(0, 1 - (targetFrame - BLACK_INTRO_FRAMES) / 15);
        overlayRef.current.style.opacity = opacity;
      }

      // Letterbox — direct DOM write
      if (enableLetterbox && topBarRef.current && bottomBarRef.current) {
        const scrollProgress = Math.max(0, Math.min(1,
          (scrollY - containerTop) / (containerHeight * 0.5)
        ));
        const h = Math.max(0, letterboxHeight * (1 - scrollProgress * 0.8));
        topBarRef.current.style.height = `${h}vh`;
        bottomBarRef.current.style.height = `${h}vh`;
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isLoaded, scrollMultiplier, enableLetterbox, letterboxHeight, drawFrame, loadFrameRange]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '300vh' }}
    >
      {enableLetterbox && (
        <>
          <div
            ref={topBarRef}
            className="letterbox-bar letterbox-top"
            style={{ height: `${letterboxHeight}vh` }}
          />
          <div
            ref={bottomBarRef}
            className="letterbox-bar letterbox-bottom"
            style={{ height: `${letterboxHeight}vh` }}
          />
        </>
      )}

      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {introVisible && (
          <div
            className="absolute inset-0 bg-black pointer-events-none z-10"
            style={{
              opacity: introFading ? 0 : 1,
              transition: 'opacity 1.2s ease-out',
            }}
            onTransitionEnd={() => { if (introFading) setIntroVisible(false); }}
          />
        )}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 40%, rgba(10, 9, 8, 0.4) 100%),
              linear-gradient(to top, rgba(10, 9, 8, 0.6) 0%, transparent 30%),
              linear-gradient(to bottom, rgba(10, 9, 8, 0.3) 0%, transparent 20%)
            `
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 50% 80%, rgba(212, 158, 61, 0.15) 0%, transparent 50%)'
          }}
        />

        {overlayContent && (
          <div
            ref={overlayRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: 1 }}
          >
            {overlayContent}
          </div>
        )}

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-stone-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-60">
            Scroll
          </p>
          <div className="w-px h-12 bg-gradient-to-b from-gold-500/60 to-transparent mx-auto">
            <div className="w-px h-3 bg-gold-400 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollVideo;
