// Reveal on Scroll Animation
export const initRevealOnScroll = () => {
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  return () => {
    revealElements.forEach((el) => revealObserver.unobserve(el));
  };
};

// Parallax Scroll Effect
export const initParallaxScroll = () => {
  const parallaxBg = document.querySelector('.parallax-bg');
  let rafId;

  const handleScroll = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${window.scrollY * 0.5}px)`;
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
    cancelAnimationFrame(rafId);
  };
};

// Scroll-based Rotation for Circular Images
export const initScrollRotation = () => {
  const spinImages = document.querySelectorAll('[data-scroll-rotate] .spin-image');
  let rafId;

  const updateSpinRotation = () => {
    spinImages.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInView) {
        const rotation = (window.scrollY * 0.15) % 360;
        img.style.transform = `rotate(${rotation}deg)`;
      }
    });
  };

  const handleScroll = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateSpinRotation);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  updateSpinRotation();

  return () => {
    window.removeEventListener('scroll', handleScroll);
    cancelAnimationFrame(rafId);
  };
};

// 3D Tilt Effect on Cards
export const initTiltCards = () => {
  const tiltCards = document.querySelectorAll('.tilt-card');
  const handlers = new Map();

  tiltCards.forEach((card) => {
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    };

    handlers.set(card, { handleMouseMove, handleMouseLeave });
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
  });

  return () => {
    tiltCards.forEach((card) => {
      const h = handlers.get(card);
      if (h) {
        card.removeEventListener('mousemove', h.handleMouseMove);
        card.removeEventListener('mouseleave', h.handleMouseLeave);
      }
    });
    handlers.clear();
  };
};

// Animated Counter
export const animateCounter = (element, target, duration = 2000) => {
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
};
