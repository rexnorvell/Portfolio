// ===== Theme Toggle =====
const themeToggle = document.getElementById('theme-toggle');

function getPreferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Initialize theme if not set by the inline script
if (!document.documentElement.getAttribute('data-theme')) {
  setTheme(getPreferredTheme());
}

// ===== Mobile Navigation =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !isOpen);
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
  });
});

// Close mobile nav on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    navToggle.focus();
  }
});

// ===== Scroll Animations =====
const animatedElements = document.querySelectorAll('.animate-on-scroll');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animatedElements.forEach(el => scrollObserver.observe(el));

// ===== Hero Fade In =====
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
  requestAnimationFrame(() => {
    heroContent.classList.add('loaded');
  });
}

// ===== Typing Animation =====
const typingEl = document.querySelector('.typing');
if (typingEl) {
  const text = typingEl.textContent;
  typingEl.textContent = '';
  typingEl.style.width = 'auto';

  let i = 0;
  function typeChar() {
    if (i < text.length) {
      typingEl.textContent += text.charAt(i);
      i++;
      setTimeout(typeChar, 50);
    } else {
      // Blink cursor then stop
      setTimeout(() => {
        typingEl.style.borderRight = 'none';
      }, 2000);
    }
  }

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typingEl.textContent = text;
    typingEl.style.borderRight = 'none';
  } else {
    setTimeout(typeChar, 600);
  }
}

// ===== Active Nav Link Highlighting =====
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

sections.forEach(section => navObserver.observe(section));

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      formStatus.textContent = 'Something went wrong. Please try again or reach out via LinkedIn.';
      formStatus.classList.add('error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}
