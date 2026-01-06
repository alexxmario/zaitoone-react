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

  const handleScroll = () => {
    if (parallaxBg) {
      const scrolled = window.scrollY;
      parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  };

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

// Scroll-based Rotation for Circular Images
export const initScrollRotation = () => {
  const spinImages = document.querySelectorAll('[data-scroll-rotate] .spin-image');
  let scrollTimeout;

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
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        updateSpinRotation();
        scrollTimeout = null;
      }, 10);
    }
  };

  window.addEventListener('scroll', handleScroll);
  updateSpinRotation(); // Initial call

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

// 3D Tilt Effect on Cards
export const initTiltCards = () => {
  const tiltCards = document.querySelectorAll('.tilt-card');

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

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
  });

  return () => {
    tiltCards.forEach((card) => {
      card.removeEventListener('mousemove', () => {});
      card.removeEventListener('mouseleave', () => {});
    });
  };
};

// Animated Counter
export const animateCounter = (element, target, duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

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
