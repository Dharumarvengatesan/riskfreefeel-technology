/**
 * RiskFreeFeel Technologies — Main JavaScript
 * Animation system: premium, performance-first, no layout shift
 */

/* ── Reduced Motion Preference ─────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Theme Management ─────────────────────────────────────────── */
const ThemeManager = (() => {
  const KEY = 'rff-theme';
  let current = localStorage.getItem(KEY) || 'dark';

  function updateLogoColors(theme) {
    const logoSrc = theme === 'dark' ? 'logo-dark.svg' : 'logo-light.svg';
    document.querySelectorAll('.navbar-logo img, .logo-img').forEach(img => {
      const currentSrc = img.getAttribute('src') || '';
      const prefix = currentSrc.includes('../') ? '../assets/images/' : 'assets/images/';
      img.src = prefix + logoSrc;
    });
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    current = theme;
    document.querySelectorAll('.theme-icon').forEach(icon => {
      icon.innerHTML = theme === 'dark' ? '&#9728;&#65039;' : '&#127769;';
    });
    updateLogoColors(theme);
  }

  function toggle() { apply(current === 'dark' ? 'light' : 'dark'); }

  function init() {
    apply(current);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, toggle, getCurrent: () => current };
})();


/* ── Scroll Progress Bar ──────────────────────────────────────── */
const ScrollProgress = (() => {
  function init() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${total > 0 ? (window.scrollY / total) * 100 : 0}%`;
    }, { passive: true });
  }
  return { init };
})();


/* ── Navbar ───────────────────────────────────────────────────── */
const Navbar = (() => {
  function init() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });
    }

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });
    }

    document.querySelectorAll('.mobile-menu-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        mobileMenu?.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks  = document.querySelectorAll('.navbar-link, .mobile-menu-link');

    if (sections.length && navLinks.length) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${id}` ||
                link.getAttribute('href') === `./#${id}`
              );
            });
          }
        });
      }, { threshold: 0.4 });
      sections.forEach(s => observer.observe(s));
    }
  }
  return { init };
})();


/* ── Hero Entrance Animation ──────────────────────────────────── */
// Adds a one-shot fade-up on the hero content.
// Uses only opacity + translateY — zero layout shift.
const HeroEntrance = (() => {
  function init() {
    if (prefersReducedMotion) return;

    const heroContent = document.querySelector('.hero-content');
    const heroVisual  = document.querySelector('.hero-visual');

    if (heroContent) {
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(16px)';
      // requestAnimationFrame ensures the initial hidden state is painted first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          heroContent.style.transition = 'opacity 600ms ease-out, transform 600ms ease-out';
          heroContent.style.opacity = '1';
          heroContent.style.transform = 'translateY(0)';
        });
      });
    }

    if (heroVisual) {
      heroVisual.style.opacity = '0';
      heroVisual.style.transform = 'translateY(16px)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          heroVisual.style.transition = 'opacity 650ms ease-out 120ms, transform 650ms ease-out 120ms';
          heroVisual.style.opacity = '1';
          heroVisual.style.transform = 'translateY(0)';
        });
      });
    }
  }
  return { init };
})();


/* ── Scroll Reveal Animations (IntersectionObserver) ─────────── */
// Each element animates once, then is unobserved.
// Supports .delay-100 through .delay-600 for stagger.
const RevealAnimations = (() => {
  function init() {
    if (prefersReducedMotion) {
      // Make everything visible immediately
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
        .forEach(el => el.classList.add('visible'));
      return;
    }

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!elements.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

    elements.forEach(el => observer.observe(el));
  }
  return { init };
})();


/* ── Button Micro-Interactions ────────────────────────────────── */
// scale(1.02) on hover, scale(0.98) on active.
// Applied via CSS classes added here so it degrades gracefully.
const ButtonMicroInteractions = (() => {
  function init() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.btn').forEach(btn => {
      // Skip buttons that already have transform-based hover in CSS
      btn.addEventListener('mouseenter', () => {
        btn.style.willChange = 'transform';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.willChange = '';
      });
    });

    // CTA nav button subtle scale — constrained to 1.02 max
    const navCta = document.getElementById('nav-cta');
    if (navCta) {
      navCta.addEventListener('mouseenter', () => {
        navCta.style.transform = 'scale(1.02)';
        navCta.style.transition = 'transform 160ms ease-out';
      });
      navCta.addEventListener('mouseleave', () => {
        navCta.style.transform = 'scale(1)';
      });
      navCta.addEventListener('mousedown', () => {
        navCta.style.transform = 'scale(0.98)';
      });
      navCta.addEventListener('mouseup', () => {
        navCta.style.transform = 'scale(1.02)';
      });
    }
  }
  return { init };
})();


/* ── Animated Counters ────────────────────────────────────────── */
const AnimatedCounters = (() => {
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, ''));
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = parseInt(el.dataset.duration || '2000');
    const start    = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = easeOutExpo(progress);
      const value    = target * eased;
      el.textContent = `${prefix}${target < 10 ? value.toFixed(1) : Math.floor(value)}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function init() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    if (prefersReducedMotion) {
      counters.forEach(el => {
        const target = el.dataset.target || '';
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        if (target) el.textContent = `${prefix}${target}${suffix}`;
      });
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }
  return { init };
})();


/* ── Hero Particle Canvas ─────────────────────────────────────── */
// Reduced particle count on mobile for performance.
const ParticleCanvas = (() => {
  let particles = [];
  let animId;
  let canvas, ctx;

  class Particle {
    constructor(w, h) { this.reset(w, h); }
    reset(w, h) {
      this.x       = Math.random() * w;
      this.y       = Math.random() * h;
      this.size    = Math.random() * 2 + 0.5;
      this.speedX  = (Math.random() - 0.5) * 0.5;
      this.speedY  = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.4 + 0.08;
      this.color   = Math.random() > 0.6 ? '249, 115, 22' : Math.random() > 0.5 ? '139, 92, 246' : '14, 165, 233';
    }
    update(w, h) {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset(w, h);
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function drawConnections(ctx, particles, maxDist) {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(249, 115, 22, ${(1 - dist / maxDist) * 0.1})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    canvas = document.getElementById('hero-canvas');
    if (!canvas || prefersReducedMotion) return;

    ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const isMobile = window.innerWidth < 768;
    const count    = isMobile
      ? Math.min(30, Math.floor(canvas.width * canvas.height / 20000))
      : Math.min(70, Math.floor(canvas.width * canvas.height / 12000));

    particles = Array.from({ length: count }, () => new Particle(canvas.width, canvas.height));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(canvas.width, canvas.height); p.draw(ctx); });
      if (!isMobile) drawConnections(ctx, particles, 110);
      animId = requestAnimationFrame(animate);
    }
    animate();

    // Pause when canvas is not in view — saves CPU
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { if (!animId) animate(); }
      else { cancelAnimationFrame(animId); animId = null; }
    });
    observer.observe(canvas.parentElement);
  }
  return { init };
})();


/* ── Service / Why / Pricing Card Hover ──────────────────────── */
// Gentle lift only — no 3D tilt. Max translateY(-4px).
const CardHover = (() => {
  function init() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.service-card, .why-card, .pricing-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform  = 'translateY(-4px)';
        card.style.transition = 'transform 200ms ease-out, box-shadow 200ms ease-out';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform  = 'translateY(0)';
        card.style.transition = 'transform 250ms ease-out, box-shadow 250ms ease-out';
      });
    });
  }
  return { init };
})();


/* ── Portfolio Filter ─────────────────────────────────────────── */
const PortfolioFilter = (() => {
  function init() {
    const filterBtns    = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        portfolioCards.forEach(card => {
          const match = category === 'all' || card.dataset.category === category;
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          if (match) {
            card.style.opacity   = '1';
            card.style.transform = 'scale(1)';
            card.style.display   = '';
          } else {
            card.style.opacity   = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              if (card.dataset.category !== category) card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
  return { init };
})();


/* ── Testimonials Carousel ────────────────────────────────────── */
const TestimonialsCarousel = (() => {
  let current = 0, autoplay;

  function init() {
    const track   = document.getElementById('testimonials-track');
    const dots    = document.querySelectorAll('.testimonials-dot');
    const prevBtn = document.getElementById('testimonials-prev');
    const nextBtn = document.getElementById('testimonials-next');
    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    if (!total) return;

    function getCardWidth() { return cards[0].offsetWidth + 24; }

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * getCardWidth()}px)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(autoplay); goTo(current - 1); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(autoplay); goTo(current + 1); startAutoplay(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(autoplay); goTo(i); startAutoplay(); }));

    function startAutoplay() { autoplay = setInterval(() => goTo(current + 1), 4000); }

    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { clearInterval(autoplay); goTo(current + (diff > 0 ? 1 : -1)); startAutoplay(); }
    });

    goTo(0);
    startAutoplay();
  }
  return { init };
})();


/* ── AI Chatbot ───────────────────────────────────────────────── */
const AIChatbot = (() => {
  const responses = {
    'services':  'We offer premium services including Mobile App Development, Enterprise Software, AI Solutions, UI/UX Design, and more! Which interests you? 🚀',
    'mobile':    'We specialise in cross-platform mobile apps using Flutter, Android (Kotlin/Java), and iOS (Swift). 50+ apps with 4.8★ ratings!',
    'price':     'Pricing starts from ₹24,999 for basic apps. Want a detailed quote? 💰',
    'pricing':   'Plans range from Starter (₹24,999) to Professional (₹1,24,999) to Enterprise (custom). Each includes source code, 6-month support, and free deployment!',
    'contact':   'Reach us at:\n📧 info@riskfreefeel.co.in\n📞 +91 8189907917\n💬 WhatsApp: +91 8189907917',
    'flutter':   'Flutter is our primary mobile framework! 30+ Flutter apps with clean architecture.',
    'ai':        'We integrate ChatGPT, image recognition, recommendation engines, NLP, and custom ML models!',
    'timeline':  'Mobile app: 6–12 weeks. Website: 3–6 weeks. Enterprise: 3–6 months. Agile sprints for transparency!',
    'hello':     'Hello! 👋 Welcome to RiskFreeFeel Technologies! I\'m RiskBot. How can I help?',
    'hi':        'Hi there! 😊 I\'m RiskBot. What brings you here today?',
    'portfolio': 'We\'ve delivered 200+ projects — mobile apps, e-commerce, enterprise, SaaS. Check our Portfolio page!',
    'tech':      'Our stack: Flutter, Android, iOS, Node.js, Firebase, AWS/GCP, REST APIs, Java, Kotlin, Dart, Python.',
    'support':   'We provide 24/7 technical support, 6-month free maintenance, and SLA-backed uptime. 🛡️',
    'quote':     'Get a FREE quote in 24 hours! Email info@riskfreefeel.co.in or call +91 8189907917.',
    'location':  'Based in India, serving clients globally. WhatsApp +91 8189907917 for a quick response!',
    'default':   'Great question! 🤔 Would you like to:\n• Schedule a free consultation\n• Get a project quote\n• Talk to our technical team\n\nCall: +91 8189907917 or email info@riskfreefeel.co.in'
  };

  function getResponse(input) {
    const lower = input.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lower.includes(key)) return response;
    }
    return responses.default;
  }

  function addMessage(text, type, container) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;
    msg.innerHTML = `<div class="chat-bubble">${text.replace(/\n/g, '<br>')}</div>`;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function showTyping(container) {
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot';
    typing.id = 'chat-typing';
    typing.innerHTML = `<div class="chat-bubble chat-typing"><span class="chat-typing-dot"></span><span class="chat-typing-dot"></span><span class="chat-typing-dot"></span></div>`;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
    return typing;
  }

  function sendMessage(input, container) {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user', container);
    input.value = '';
    const typing = showTyping(container);
    setTimeout(() => {
      typing.remove();
      addMessage(getResponse(text), 'bot', container);
    }, 800 + Math.random() * 500);
  }

  function init() {
    const btn        = document.getElementById('chatbot-btn');
    const window_    = document.getElementById('chatbot-window');
    const closeBtn   = document.getElementById('chatbot-close');
    const msgContainer = document.getElementById('chatbot-messages');
    const chatInput  = document.getElementById('chatbot-input');
    const sendBtn    = document.getElementById('chatbot-send');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');
    if (!btn || !window_) return;

    let isOpen = false, greeted = false;

    function toggle() {
      isOpen = !isOpen;
      window_.classList.toggle('open', isOpen);
      btn.textContent = isOpen ? '✕' : '🤖';
      if (isOpen && !greeted && msgContainer) {
        greeted = true;
        setTimeout(() => addMessage('Hello! 👋 I\'m RiskBot, your AI assistant.\n\nHow can I help you today?', 'bot', msgContainer), 300);
      }
    }

    btn.addEventListener('click', toggle);
    if (closeBtn) closeBtn.addEventListener('click', toggle);

    if (sendBtn && chatInput && msgContainer) {
      sendBtn.addEventListener('click',  () => sendMessage(chatInput, msgContainer));
      chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(chatInput, msgContainer); });
    }

    quickReplies.forEach(qBtn => {
      qBtn.addEventListener('click', () => {
        if (chatInput && msgContainer) {
          chatInput.value = qBtn.textContent;
          sendMessage(chatInput, msgContainer);
        }
      });
    });
  }
  return { init };
})();


/* ── Contact Form ─────────────────────────────────────────────── */
const ContactForm = (() => {
  function init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      await new Promise(r => setTimeout(r, 1500));

      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';

      const success = document.getElementById('form-success');
      if (success) { success.style.display = 'flex'; success.style.animation = 'slide-up 0.4s ease'; }

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
        if (success) success.style.display = 'none';
      }, 4000);
    });

    form.querySelectorAll('.input-field').forEach(input => {
      input.addEventListener('blur', () => {
        const value = input.value.trim();
        let valid = true;
        if (input.required && !value) valid = false;
        else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) valid = false;
        input.style.borderColor = valid ? '' : '#EF4444';
      });
    });
  }
  return { init };
})();


/* ── Newsletter Form ──────────────────────────────────────────── */
const NewsletterForm = (() => {
  function init() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn   = form.querySelector('button');
        const input = form.querySelector('input');
        if (!btn || !input || !input.value.trim()) return;
        btn.textContent = '✓';
        btn.style.background = '#10B981';
        input.value = '';
        setTimeout(() => { btn.textContent = '→'; btn.style.background = ''; }, 3000);
      });
    });
  }
  return { init };
})();


/* ── Smooth Scroll ────────────────────────────────────────────── */
const SmoothScroll = (() => {
  function init() {
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const el = document.getElementById(link.getAttribute('href').slice(1));
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  }
  return { init };
})();


/* ── Back to Top ──────────────────────────────────────────────── */
const BackToTop = (() => {
  function init() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.style.opacity = window.scrollY > 400 ? '1' : '0';
      btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
  return { init };
})();


/* ── Parallax (desktop only, very subtle) ────────────────────── */
const ParallaxEffect = (() => {
  let elements = [];
  function onScroll() {
    const scrollY = window.scrollY;
    elements.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0;
      el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
    });
  }
  function init() {
    if (prefersReducedMotion || window.innerWidth < 768) return;
    elements = Array.from(document.querySelectorAll('.parallax'));
    if (!elements.length) return;
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  return { init };
})();


/* ── Initialize All Modules ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  ScrollProgress.init();
  Navbar.init();
  HeroEntrance.init();
  RevealAnimations.init();
  ButtonMicroInteractions.init();
  AnimatedCounters.init();
  ParticleCanvas.init();
  CardHover.init();
  PortfolioFilter.init();
  TestimonialsCarousel.init();
  AIChatbot.init();
  ContactForm.init();
  NewsletterForm.init();
  SmoothScroll.init();
  BackToTop.init();
  ParallaxEffect.init();

  // Lazy load images
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imgObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imgObserver.observe(img));
  }

  console.log('🚀 RiskFreeFeel Technologies — All systems initialized!');
});
