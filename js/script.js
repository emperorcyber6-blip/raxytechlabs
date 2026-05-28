/**
 * RAXY TECH LABS — Main Script v3.0
 * Features: Mobile menu, Navbar scroll, Canvas BG, Scroll Reveal, Modals
 */

document.addEventListener('DOMContentLoaded', () => {

  // ================================================
  // 1. MOBILE MENU TOGGLE
  // ================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu    = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      const icon = mobileMenuBtn.querySelector('i');
      icon.className = isHidden ? 'fas fa-times' : 'fas fa-bars';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // ================================================
  // 2. NAVBAR SCROLL EFFECT
  // ================================================
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleNavScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // run once on load
  }

  // ================================================
  // 3. SMOOTH SCROLLING (anchor links)
  // ================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = this.getAttribute('href');
      if (target === '#') return;
      const el = document.querySelector(target);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ================================================
  // 4. SCROLL REVEAL ANIMATION
  // ================================================
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ================================================
  // 5. CANVAS BACKGROUND ANIMATION
  // ================================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, animFrameId;

    function resize() {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Particle config — matches new design palette
    const COLORS = [
      'rgba(0, 212, 255,',   // accent cyan
      'rgba(16, 217, 164,',  // emerald
      'rgba(124, 58, 237,',  // violet
    ];

    class Particle {
      constructor() { this.reset(true); }

      reset(initial = false) {
        this.x     = Math.random() * width;
        this.y     = initial ? Math.random() * height : (Math.random() < 0.5 ? -10 : height + 10);
        this.vx    = (Math.random() - 0.5) * 0.35;
        this.vy    = (Math.random() - 0.5) * 0.35;
        this.size  = Math.random() * 1.8 + 0.4;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.35 + 0.05;
        this.life  = 0;
        this.maxLife = 300 + Math.random() * 400;
      }

      update() {
        this.x    += this.vx;
        this.y    += this.vy;
        this.life += 1;

        // Soft fade at edges using alpha
        const edgeFade = Math.min(
          this.x / 80, (width - this.x) / 80,
          this.y / 80, (height - this.y) / 80,
          1
        );
        this.drawAlpha = this.alpha * edgeFade;

        if (this.life > this.maxLife) this.reset();
      }

      draw() {
        if (this.drawAlpha <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.drawAlpha + ')';
        ctx.fill();
      }
    }

    // Responsive particle count
    const COUNT = Math.min(Math.floor(window.innerWidth / 12), 90);
    const particles = Array.from({ length: COUNT }, () => new Particle());

    function drawConnections() {
      const MAX_DIST = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            const opacity = (1 - dist / MAX_DIST) * 0.09;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
            ctx.lineWidth   = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId);
      } else {
        animate();
      }
    });
  }

  // ================================================
  // 6. MODAL HANDLING
  // ================================================
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Trigger buttons
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.getAttribute('data-modal'));
    });
  });

  // Close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.closest('.modal-overlay'));
    });
  });

  // Click outside to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const active = document.querySelector('.modal-overlay.active');
      if (active) closeModal(active);
    }
  });

  // ================================================
  // 7. SERVICE CARD TOP LINE HOVER
  //    (Trigger ::before top stripe via JS class)
  // ================================================
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const line = card.querySelector('.card-top-line');
      if (line) line.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      const line = card.querySelector('.card-top-line');
      if (line) line.style.opacity = '0';
    });
  });

  // ================================================
  // 8. TYPEWRITER EFFECT (terminal card, index only)
  // ================================================
  const terminalLines = document.querySelectorAll('.terminal-body .flex');
  terminalLines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-8px)';
    line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, 400 + i * 250);
  });

  // ================================================
  // 9. STAT COUNTER ANIMATION (index stats section)
  // ================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        // Only animate pure-number stats
        const numMatch = text.match(/^(\d+)/);
        if (!numMatch) return;

        const target  = parseInt(numMatch[1], 10);
        const suffix  = text.replace(numMatch[0], '');
        const dur     = 1400;
        const step    = 16;
        const steps   = Math.floor(dur / step);
        let current   = 0;
        let frame     = 0;

        const timer = setInterval(() => {
          frame++;
          current = Math.round(target * (frame / steps));
          el.textContent = current + suffix;
          if (frame >= steps) {
            el.textContent = text; // restore original
            clearInterval(timer);
          }
        }, step);

        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  // ================================================
  // 10. ACTIVE NAV LINK HIGHLIGHT
  // ================================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

});
