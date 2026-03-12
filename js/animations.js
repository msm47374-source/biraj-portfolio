/* ===================================================
   BIRAJ OLI PORTFOLIO — SCROLL ANIMATIONS JS
   =================================================== */

'use strict';

// ===== INTERSECTION OBSERVER — SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');

      // Trigger skill bars when skills section visible
      if (entry.target.closest('#skills')) {
        triggerSkillBars();
      }

      // Trigger counters when hero stats visible
      const counters = entry.target.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        if (!counter.dataset.animated) {
          counter.dataset.animated = 'true';
          animateCounter(counter);
        }
      });

      // Stop observing once revealed
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

// Observe all .reveal elements
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ===== SKILL BAR ANIMATION =====
let skillBarsTriggered = false;

function triggerSkillBars() {
  if (skillBarsTriggered) return;
  skillBarsTriggered = true;

  document.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
    const targetWidth = bar.getAttribute('data-width');
    setTimeout(() => {
      bar.style.width = targetWidth + '%';
    }, i * 100);
  });
}

// Also trigger skill bars via section observer
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      triggerSkillBars();
      skillsObserver.disconnect();
    }
  }, { threshold: 0.2 });
  skillsObserver.observe(skillsSection);
}

// ===== COUNTER ANIMATION (reusable) =====
function animateCounter(el) {
  const target    = parseInt(el.getAttribute('data-target'), 10);
  const duration  = 2000;
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Hero counter trigger
const heroSection = document.getElementById('home');
let heroCountersDone = false;

const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !heroCountersDone) {
    heroCountersDone = true;
    document.querySelectorAll('.stat-number').forEach(el => {
      animateCounter(el);
    });
  }
}, { threshold: 0.4 });

if (heroSection) heroObserver.observe(heroSection);

// ===== TECH CHIP STAGGER ENTRANCE =====
const techGrid = document.querySelector('.tech-grid');
if (techGrid) {
  const chipObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.tech-chip').forEach((chip, i) => {
        setTimeout(() => {
          chip.style.opacity   = '1';
          chip.style.transform = 'translateY(0) scale(1)';
        }, i * 45);
      });
      chipObserver.disconnect();
    }
  }, { threshold: 0.1 });

  // Set initial hidden state
  document.querySelectorAll('.tech-chip').forEach(chip => {
    chip.style.opacity   = '0';
    chip.style.transform = 'translateY(20px) scale(0.9)';
    chip.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });

  chipObserver.observe(techGrid);
}

// ===== PARALLAX on hero orbs =====
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');

  if (orb1) orb1.style.transform = `translateY(${scrollY * 0.15}px)`;
  if (orb2) orb2.style.transform = `translateY(${-scrollY * 0.1}px)`;
  if (orb3) orb3.style.transform = `translateY(${scrollY * 0.08}px)`;
}, { passive: true });

// ===== TIMELINE ITEMS STAGGER =====
const timelineObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      setTimeout(() => {
        item.style.opacity   = '1';
        item.style.transform = 'translateX(0)';
      }, i * 150);
    });
    timelineObserver.disconnect();
  }
}, { threshold: 0.2 });

const timeline = document.querySelector('.about-timeline');
if (timeline) {
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.style.opacity   = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  timelineObserver.observe(timeline);
}

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
});

// ===== SMOOTH SECTION TRANSITIONS =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

console.log(
  '%c Biraj Oli Portfolio %c Built with Vanilla JS ⚡ ',
  'background: #241545; color: #fbbf24; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
  'background: #a78bfa; color: #0d0a1a; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
);
