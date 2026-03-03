import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          cursor.style.transform = `translate3d(${posRef.current.x - 16}px, ${posRef.current.y - 16}px, 0)`;
          rafRef.current = null;
        });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" style={{ left: 0, top: 0, willChange: 'transform' }} />;
};

export default CustomCursor;
