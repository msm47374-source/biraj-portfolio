/* ===================================================
   BIRAJ OLI PORTFOLIO — MAIN JAVASCRIPT v3 (Consolidated)
   =================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ===== NAVBAR FUNCTIONALITY =====
  const navbar      = document.getElementById('navbar');
  const navLinks    = document.getElementById('navLinks');
  const hamburger   = document.getElementById('hamburger');
  const backToTop   = document.getElementById('backToTop');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      updateActiveNavLink();
      toggleBackToTop();
    }, { passive: true });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  function toggleBackToTop() {
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;

      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }

  // ===== TYPEWRITER EFFECT =====
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const phrases = [
      'Scalable Web Apps',
      'Beautiful Interfaces',
      'Full Stack Solutions',
      'Mobile Experiences',
      'Clean, Fast APIs',
      'Open Source Tools',
    ];

    let phraseIdx  = 0;
    let charIdx    = 0;
    let isDeleting = false;
    let isPaused   = false;

    function typeWriter() {
      if (isPaused) return;
      const current = phrases[phraseIdx];

      if (!isDeleting) {
        typewriterEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          isPaused = true;
          setTimeout(() => { isPaused = false; isDeleting = true; typeWriter(); }, 2200);
          return;
        }
      } else {
        typewriterEl.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }

      const speed = isDeleting ? 45 : 85;
      setTimeout(typeWriter, speed);
    }
    setTimeout(typeWriter, 900);
  }



  // ===== PROJECT FILTERING =====
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card, i) => {
          const category  = card.getAttribute('data-category');
          const shouldShow = filter === 'all' || category === filter;

          if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'none';
            void card.offsetHeight; // force reflow
            card.style.animation = `fadeInUp 0.55s ${i * 0.07}s both ease`;
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ===== TESTIMONIALS CAROUSEL =====
  const dots  = document.querySelectorAll('.dot');
  const tCards = document.querySelectorAll('.testimonial-card');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  let currentTIdx = 0;
  let autoTimer;

  if (tCards.length > 0) {
    function showTestimonial(idx) {
      tCards.forEach(c => c.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      tCards[idx].classList.add('active');
      if (dots[idx]) dots[idx].classList.add('active');
      currentTIdx = idx;
    }

    function moveTestimonial(step) {
      let next = (currentTIdx + step + tCards.length) % tCards.length;
      showTestimonial(next);
      resetAutoPlay();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => moveTestimonial(1));
    if (prevBtn) prevBtn.addEventListener('click', () => moveTestimonial(-1));

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        showTestimonial(parseInt(dot.getAttribute('data-index'), 10));
        resetAutoPlay();
      });
    });

    function resetAutoPlay() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => moveTestimonial(1), 5500);
    }

    showTestimonial(0);
    autoTimer = setInterval(() => moveTestimonial(1), 5500);

    // Swipe support
    let touchStartX = 0;
    const tSection = document.querySelector('.testimonials-carousel');
    if (tSection) {
      tSection.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });
      tSection.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          moveTestimonial(diff > 0 ? 1 : -1);
        }
      });
    }
  }

  // ===== CONTACT FORM =====
  const contactForm  = document.getElementById('contactForm');
  const submitBtn    = document.getElementById('submitBtn');
  const formSuccess  = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#ef4444';
          valid = false;
          setTimeout(() => field.style.borderColor = '', 3000);
        }
      });
      if (!valid) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Sending…';
        submitBtn.style.opacity = '0.7';
      }

      setTimeout(() => {
        if (submitBtn) {
          if (btnText) btnText.textContent = 'Send Message';
          submitBtn.disabled  = false;
          submitBtn.style.opacity = '';
        }
        if (formSuccess) {
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 6000);
        }
        contactForm.reset();
      }, 1800);
    });
  }

  // ===== CURSOR GLOW =====
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', e => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  // ===== PARTICLE CANVAS =====
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const particles = [];
    const PARTICLE_COUNT = 70;

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x    = Math.random() * canvas.width;
        this.y    = Math.random() * canvas.height;
        this.r    = Math.random() * 1.8 + 0.2;
        this.dx   = (Math.random() - 0.5) * 0.35;
        this.dy   = (Math.random() - 0.5) * 0.35;
        this.col  = Math.random() > 0.5 ? '167,139,250' : '251,191,36';
      }
      update() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.col}, 0.6)`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      
      // Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(167,139,250, ${(1 - dist/110) * 0.07})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ===== PARALLAX ON HERO ORBS =====
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const orbs = document.querySelectorAll('.orb-wrapper');
    orbs.forEach((orb, i) => {
      const speed = 0.05 + (i * 0.03);
      const factor = (i % 2 === 0) ? 1 : -1;
      orb.style.transform = `translateY(${scrollY * speed * factor}px)`;
    });
  }, { passive: true });

  // ===== INTERSECTION OBSERVER (SCROLL REVEAL) =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Stagger tech chips if parent tech-grid revealed
        if (entry.target.classList.contains('tech-grid')) {
          const chips = entry.target.querySelectorAll('.tech-chip');
          chips.forEach((chip, i) => {
            setTimeout(() => {
              chip.style.opacity = '1';
              chip.style.transform = 'translateY(0) scale(1)';
            }, i * 45);
          });
        }

        // Stagger timeline items
        if (entry.target.classList.contains('about-timeline')) {
          const items = entry.target.querySelectorAll('.timeline-item');
          items.forEach((item, i) => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateX(0)';
            }, i * 150);
          });
        }

        // Skill bars
        if (entry.target.classList.contains('skill-bar-fill')) {
          const width = entry.target.getAttribute('data-width');
          entry.target.style.width = width + '%';
        }

        // Numbers
        if (entry.target.classList.contains('stat-number')) {
          const target = parseInt(entry.target.getAttribute('data-target'), 10);
          animateValue(entry.target, 0, target, 2200);
        }

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  // Helper to animate values
  function animateValue(el, start, end, duration, suffix = '') {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      el.innerText = Math.floor(eased * (end - start) + start) + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  document.querySelectorAll('.skill-bar-fill').forEach(el => revealObserver.observe(el));
  document.querySelectorAll('.stat-number').forEach(el => revealObserver.observe(el));
  document.querySelectorAll('.tech-grid').forEach(el => revealObserver.observe(el));
  document.querySelectorAll('.about-timeline').forEach(el => revealObserver.observe(el));

  // 3D Tilt for cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = (y - cy) / cy * 5;
      const rotY = (x - cx) / cx * -5;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Page Load Fade-In
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  console.log(
    '%c Biraj Oli Portfolio %c Fully Optimized ✨ ',
    'background: #241545; color: #fbbf24; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    'background: #a78bfa; color: #0d0a1a; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
  );
});
