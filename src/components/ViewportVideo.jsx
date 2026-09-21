import { useEffect, useRef } from 'react';

// Fetch and play decorative videos only while their section is on screen.
export default function ViewportVideo({ src, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    let visible = false;
    const update = () => {
      if (visible && !document.hidden) {
        if (!video.getAttribute('src')) {
          video.preload = 'metadata';
          video.src = src;
        }
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          video.play()?.catch(() => {});
        }
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(video);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [src]);
  return <video {...props} ref={ref} preload="none" muted loop playsInline />;
}
