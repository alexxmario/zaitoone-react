import { useEffect, useRef, useState, useCallback } from 'react';
import { cdnUrl } from '../utils/cdn';

const TOTAL_FRAMES = 146;
const BLACK_INTRO_FRAMES = 24;
const BATCH_SIZE = 12;
const MAX_CONCURRENT_LOADS = 3;
const CACHE_RADIUS = 18;

const getFrameSrc = (index) =>
  cdnUrl(`/video/frames/frame_${String(index + 1).padStart(4, '0')}.jpg`);

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
  const requestFramesRef = useRef(() => {});
  const redrawRef = useRef(() => {});
  const overlayRef = useRef(null);
  const topBarRef = useRef(null);
  const bottomBarRef = useRef(null);
  const introRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);

  // Prioritize the current frame and bound decoded memory and network concurrency.
  const loadNearbyFrames = useCallback(() => requestFramesRef.current(), []);

  useEffect(() => {
    const loading = { cancelled: false, active: 0 };
    const pending = new Set();
    const failed = new Set();
    const images = imagesRef.current;

    const pump = () => {
      if (loading.cancelled) return;
      const target = currentFrameRef.current;
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (Math.abs(i - target) > CACHE_RADIUS) images[i] = null;
      }
      const wanted = [target];
      for (let distance = 1; distance <= BATCH_SIZE; distance++) {
        if (target + distance < TOTAL_FRAMES) wanted.push(target + distance);
        if (target - distance >= 0) wanted.push(target - distance);
      }
      for (const index of wanted) {
        if (loading.active >= MAX_CONCURRENT_LOADS) break;
        if (images[index] || pending.has(index) || failed.has(index)) continue;
        pending.add(index);
        loading.active++;
        const img = new Image();
        img.decoding = 'async';
        const finish = async (success) => {
          if (success) {
            try { await img.decode(); } catch { success = false; }
          }
          if (loading.cancelled) return;
          loading.active--;
          pending.delete(index);
          if (success && Math.abs(index - currentFrameRef.current) <= CACHE_RADIUS) {
            images[index] = img;
            setIsLoaded(true);
            redrawRef.current(currentFrameRef.current);
          } else if (!success) {
            failed.add(index);
          }
          pump();
        };
        img.onload = () => finish(true);
        img.onerror = () => finish(false);
        img.src = getFrameSrc(index);
      }
    };
    requestFramesRef.current = pump;
    pump();
    return () => {
      loading.cancelled = true;
      requestFramesRef.current = () => {};
      images.fill(null);
    };
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


  useEffect(() => { redrawRef.current = drawFrame; }, [drawFrame]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const ratio = Math.min(1, 1280 / window.innerWidth);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
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
    let introHidden = false;

    const update = () => {
      rafId = null;
      const scrollY = window.scrollY;
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;

      const progress = Math.max(0, Math.min(1,
        (scrollY - containerTop) / Math.max(1, containerHeight - window.innerHeight)
      ));

      const rawFrame = progress * (TOTAL_FRAMES - 1) * scrollMultiplier;
      const targetFrame = Math.min(Math.round(rawFrame), TOTAL_FRAMES - 1);

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        drawFrame(targetFrame);

        // Progressive loading: load frames around current position
        loadNearbyFrames();
      }

      // Smooth intro fade based on scroll — starts fading earlier and more gradually
      if (introRef.current && !introHidden) {
        // Start fading at frame 5, fully transparent by frame 35 (30 frame fade)
        const fadeStart = 5;
        const fadeDuration = 30;
        const introOpacity = targetFrame <= fadeStart
          ? 1
          : Math.max(0, 1 - (targetFrame - fadeStart) / fadeDuration);

        introRef.current.style.opacity = introOpacity;

        // Hide element after fully faded to save rendering
        if (introOpacity <= 0 && !introHidden) {
          introHidden = true;
          setIntroVisible(false);
        }
      }

      // Overlay opacity — direct DOM write (fade text slightly faster)
      if (overlayRef.current) {
        const opacity = targetFrame <= BLACK_INTRO_FRAMES
          ? 1
          : Math.max(0, 1 - (targetFrame - BLACK_INTRO_FRAMES) / 20);
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
      if (rafId == null) rafId = requestAnimationFrame(update);
    };

    drawFrame(currentFrameRef.current);
    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isLoaded, scrollMultiplier, enableLetterbox, letterboxHeight, drawFrame, loadNearbyFrames]);

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
            ref={introRef}
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              opacity: 1,
              background: 'linear-gradient(to bottom, rgb(0, 0, 0) 0%, rgb(10, 9, 8) 100%)',
            }}
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
