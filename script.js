/* =====================================================
   AFC Assessoria Veicular – JavaScript
   ===================================================== */

'use strict';

// ──────────────────────────────────────────────────────
// NAVBAR: Scroll & Mobile Menu
// ──────────────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // Scroll style
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
})();

// ──────────────────────────────────────────────────────
// SMOOTH SCROLL for internal links
// ──────────────────────────────────────────────────────
(function initSmoothScroll() {
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ──────────────────────────────────────────────────────
// COUNTER ANIMATION (hero stats)
// ──────────────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const ease = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

  const animateCounter = (el, target, duration = 2200) => {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      el.textContent = Math.round(ease(progress) * target).toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(counter => observer.observe(counter));
})();

// ──────────────────────────────────────────────────────
// SCROLL REVEAL ANIMATIONS
// ──────────────────────────────────────────────────────
(function initReveal() {
  const elements = document.querySelectorAll(
    '.service-card, .testimonial-card, .process-step, .trust-item, .faq-item, .channel-item, .highlight-item'
  );

  // Add reveal class
  elements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

// ──────────────────────────────────────────────────────
// FAQ: open/close animation
// ──────────────────────────────────────────────────────
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    item.addEventListener('toggle', () => {
      // Close others
      items.forEach(other => {
        if (other !== item && other.hasAttribute('open')) {
          other.removeAttribute('open');
        }
      });
    });
  });
})();

// ──────────────────────────────────────────────────────
// CONTACT FORM: Validation & Submit
// ──────────────────────────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const phoneInput = document.getElementById('form-phone');

  // Phone mask
  phoneInput.addEventListener('input', () => {
    let v = phoneInput.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4})(\d+)$/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d+)$/, '($1) $2');
    }
    phoneInput.value = v;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const service = document.getElementById('form-service').value;

    // Simple validation
    if (!name || !phone || !service) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    const message = document.getElementById('form-message').value.trim();

    const waText = encodeURIComponent(
      `Olá! Vim pelo site da AFC Assessoria.\n\n` +
      `*Nome:* ${name}\n` +
      `*Telefone:* ${phone}\n` +
      `*Serviço:* ${service}` +
      (message ? `\n*Mensagem:* ${message}` : '')
    );

    // Open WhatsApp
    window.open(`https://wa.me/5561984390234?text=${waText}`, '_blank', 'noopener,noreferrer');

    showToast('Redirecionando para o WhatsApp…', 'success');
    form.reset();
  });
})();

// ──────────────────────────────────────────────────────
// TOAST NOTIFICATION
// ──────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  const color = type === 'success' ? '#22c55e' : '#ef4444';
  const icon = type === 'success'
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>';

  toast.innerHTML = `${icon}<span>${msg}</span>`;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 32px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    background: #111827;
    border: 1px solid ${color}40;
    border-left: 3px solid ${color};
    color: #f1f5f9;
    font-family: var(--font-body, Inter, sans-serif);
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    animation: toast-in 0.3s ease;
    max-width: 320px;
  `;

  // Icon color
  const svg = toast.querySelector('svg');
  if (svg) svg.style.color = color;

  // Inject animation if not present
  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = `
      @keyframes toast-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      @keyframes toast-out { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(12px); } }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toast-out 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ──────────────────────────────────────────────────────
// WHATSAPP FLOAT: show after scroll
// ──────────────────────────────────────────────────────
(function initFloatBtn() {
  const btn = document.getElementById('whatsapp-float');
  if (!btn) return;

  btn.style.opacity = '0';
  btn.style.transform = 'scale(0.8) translateY(10px)';
  btn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

  const handleScroll = () => {
    if (window.scrollY > 300) {
      btn.style.opacity = '1';
      btn.style.transform = 'scale(1) translateY(0)';
    } else {
      btn.style.opacity = '0';
      btn.style.transform = 'scale(0.8) translateY(10px)';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
})();

// ──────────────────────────────────────────────────────
// ACTIVE NAV LINK on scroll
// ──────────────────────────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

