/* ===================================================
   BIRAJ OLI PORTFOLIO — MAIN JAVASCRIPT v2
   =================================================== */

'use strict';

// ===== NAVBAR =====
const navbar  = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
  toggleBackToTop();
}, { passive: true });

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

// Click outside to close menu
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Active nav link on scroll
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

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2200;
  const step     = 16;
  const steps    = duration / step;
  const increment = target / steps;
  let current    = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.round(current);
  }, step);
}

// ===== PROJECT FILTER =====
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach((card, i) => {
      const category  = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        void card.offsetHeight; // force reflow
        card.style.animation = `fadeInUp 0.55s ${i * 0.07}s both ease`;
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== TESTIMONIALS CAROUSEL =====
const dots  = document.querySelectorAll('.dot');
const cards = document.querySelectorAll('.testimonial-card');
let current = 0;
let autoTimer;

function showTestimonial(idx) {
  cards.forEach(c => c.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  cards[idx].classList.add('active');
  dots[idx].classList.add('active');
  current = idx;
}

function nextTestimonial() {
  showTestimonial((current + 1) % cards.length);
}

function prevTestimonial() {
  showTestimonial((current - 1 + cards.length) % cards.length);
}

document.getElementById('nextBtn').addEventListener('click', () => {
  nextTestimonial();
  resetAutoPlay();
});

document.getElementById('prevBtn').addEventListener('click', () => {
  prevTestimonial();
  resetAutoPlay();
});

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    showTestimonial(parseInt(dot.getAttribute('data-index'), 10));
    resetAutoPlay();
  });
});

function resetAutoPlay() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextTestimonial, 5500);
}

showTestimonial(0);
autoTimer = setInterval(nextTestimonial, 5500);

// Swipe support for testimonials
let touchStartX = 0;
const testimonialsSection = document.querySelector('.testimonials-carousel');
if (testimonialsSection) {
  testimonialsSection.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  testimonialsSection.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextTestimonial() : prevTestimonial();
      resetAutoPlay();
    }
  });
}

// ===== CONTACT FORM =====
const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btnText = submitBtn.querySelector('.btn-text');

  // Basic validation highlight
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#ef4444';
      valid = false;
      setTimeout(() => field.style.borderColor = '', 3000);
    }
  });
  if (!valid) return;

  submitBtn.disabled = true;
  btnText.textContent = 'Sending…';
  submitBtn.style.opacity = '0.7';

  setTimeout(() => {
    btnText.textContent = 'Send Message';
    submitBtn.disabled  = false;
    submitBtn.style.opacity = '';
    formSuccess.classList.add('show');
    form.reset();
    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  }, 1800);
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

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
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

const particles = [];
const PARTICLE_COUNT = 70;

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.r    = Math.random() * 1.8 + 0.2;
    this.dx   = (Math.random() - 0.5) * 0.35;
    this.dy   = (Math.random() - 0.5) * 0.35;
    this.life = 1;
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
    ctx.fillStyle = `rgba(${this.col},${this.life * 0.65})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = new Particle();
  p.x = Math.random() * canvas.width; // randomize starting pos
  p.y = Math.random() * canvas.height;
  particles.push(p);
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(167,139,250,${(1 - dist / 110) * 0.07})`;
        ctx.lineWidth   = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== SMOOTH HOVER TILT ON PROJECT CARDS =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const rotX = (y - cy) / cy * 5;
    const rotY = (x - cx) / cx * -5;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-10px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== INTERSECTION OBSERVER (SCROLL REVEAL) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');

      // Trigger skill bars when skills section is visible
      if (entry.target.classList.contains('skill-bar-fill')) {
        entry.target.style.width = entry.target.getAttribute('data-width') + '%';
      }

      // Trigger counters
      if (entry.target.classList.contains('stat-number')) {
        animateCounter(entry.target);
      }

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.skill-bar-fill').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.stat-number').forEach(el => revealObserver.observe(el));

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
