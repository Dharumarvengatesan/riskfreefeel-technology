/**
 * RiskFreeFeel Technologies — Main JavaScript
 * Handles: Theme, Navbar, Animations, Chatbot, Counters, etc.
 */

/* ── Theme Management ─────────────────────────────────────── */
const ThemeManager = (() => {
  const KEY = 'rff-theme';
  let current = localStorage.getItem(KEY) || 'dark';

  function updateLogoColors(theme) {
    // Swap logo src based on theme
    const logoSrc = theme === 'dark'
      ? 'logo-dark.svg'
      : 'logo-light.svg';

    document.querySelectorAll('.navbar-logo img, .logo-img').forEach(img => {
      // Preserve relative path depth
      const currentSrc = img.getAttribute('src') || '';
      const prefix = currentSrc.includes('../') ? '../assets/images/' : 'assets/images/';
      img.src = prefix + logoSrc;
    });
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    current = theme;
    // Update toggle icon
    const icons = document.querySelectorAll('.theme-icon');
    icons.forEach(icon => {
      icon.innerHTML = theme === 'dark' ? '&#9728;&#65039;' : '&#127769;';
    });
    // Update logo for theme
    updateLogoColors(theme);
  }

  function toggle() {
    apply(current === 'dark' ? 'light' : 'dark');
  }

  function init() {
    apply(current);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, toggle, getCurrent: () => current };
})();


/* ── Scroll Progress Bar ──────────────────────────────────── */
const ScrollProgress = (() => {
  function init() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = `${progress}%`;
    }, { passive: true });
  }
  return { init };
})();

/* ── Navbar ───────────────────────────────────────────────── */
const Navbar = (() => {
  function init() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    // Scroll effect
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });
    }

    // Hamburger toggle
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-menu-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        mobileMenu?.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.navbar-link, .mobile-menu-link');

    if (sections.length && navLinks.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}` || link.getAttribute('href') === `./#${id}`);
            });
          }
        });
      }, { threshold: 0.4 });

      sections.forEach(section => observer.observe(section));
    }
  }

  return { init };
})();

/* ── Intersection Observer (Reveal Animations) ────────────── */
const RevealAnimations = (() => {
  function init() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  return { init };
})();

/* ── Animated Counters ────────────────────────────────────── */
const AnimatedCounters = (() => {
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, ''));
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = parseInt(el.dataset.duration || '2000');
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const value = target * eased;
      const displayValue = target < 10 ? value.toFixed(1) : Math.floor(value);
      el.textContent = `${prefix}${displayValue}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function init() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  return { init };
})();

/* ── Hero Typewriter Effect ───────────────────────────────── */
const Typewriter = (() => {
  function init() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = el.dataset.phrases ? JSON.parse(el.dataset.phrases) : [el.textContent];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = phrases[phraseIndex];
      if (!isDeleting) {
        el.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex < current.length) {
          setTimeout(type, 80);
        } else {
          setTimeout(() => {
            isDeleting = true;
            setTimeout(type, 80);
          }, 1500);
        }
      } else {
        el.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex > 0) {
          setTimeout(type, 50);
        } else {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 200);
        }
      }
    }

    type();
  }
  return { init };
})();

/* ── Hero Particle Canvas ─────────────────────────────────── */
const ParticleCanvas = (() => {
  let particles = [];
  let animId;
  let canvas, ctx;

  class Particle {
    constructor(w, h) {
      this.reset(w, h);
    }
    reset(w, h) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? '249, 115, 22' : Math.random() > 0.5 ? '139, 92, 246' : '14, 165, 233';
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
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const count = Math.min(80, Math.floor(canvas.width * canvas.height / 10000));
    particles = Array.from({ length: count }, () => new Particle(canvas.width, canvas.height));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(canvas.width, canvas.height); p.draw(ctx); });
      drawConnections(ctx, particles, 120);
      animId = requestAnimationFrame(animate);
    }

    animate();

    // Pause when not visible
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!animId) animate();
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
    observer.observe(canvas.parentElement);
  }

  return { init };
})();

/* ── Portfolio Filter ─────────────────────────────────────── */
const PortfolioFilter = (() => {
  function init() {
    const filterBtns = document.querySelectorAll('.filter-btn');
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
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.display = '';
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => { if (card.dataset.category !== category) card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  return { init };
})();

/* ── Testimonials Carousel ────────────────────────────────── */
const TestimonialsCarousel = (() => {
  let current = 0;
  let autoplay;

  function init() {
    const track = document.getElementById('testimonials-track');
    const dots = document.querySelectorAll('.testimonials-dot');
    const prevBtn = document.getElementById('testimonials-prev');
    const nextBtn = document.getElementById('testimonials-next');
    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    if (!total) return;

    function getCardWidth() {
      const card = cards[0];
      return card.offsetWidth + 24; // gap
    }

    function goTo(index) {
      current = ((index % total) + total) % total;
      const offset = current * getCardWidth();
      track.style.transform = `translateX(-${offset}px)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(autoplay); goTo(current - 1); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(autoplay); goTo(current + 1); startAutoplay(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(autoplay); goTo(i); startAutoplay(); }));

    function startAutoplay() {
      autoplay = setInterval(() => goTo(current + 1), 4000);
    }

    // Touch/swipe
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { clearInterval(autoplay); goTo(current + (diff > 0 ? 1 : -1)); startAutoplay(); }
    });

    goTo(0);
    startAutoplay();
  }

  return { init };
})();

/* ── AI Chatbot ───────────────────────────────────────────── */
const AIChatbot = (() => {
  const responses = {
    'services': 'We offer 11 premium services including Mobile App Development, Enterprise Software, AI Solutions, UI/UX Design, and more! Which service interests you? 🚀',
    'mobile': 'We specialize in cross-platform mobile apps using Flutter, Android (Kotlin/Java), and iOS (Swift). We\'ve built 50+ apps with 4.8★ average ratings!',
    'price': 'Our pricing starts from ₹24,999 for basic apps and custom packages for enterprise solutions. Would you like a detailed quote? 💰',
    'pricing': 'Our plans range from Starter (₹24,999) to Professional (₹1,24,999) to Enterprise (custom). Each includes source code, 6-month support, and free deployment!',
    'contact': 'You can reach us at:\n📧 info@riskfreefeel.co.in\n📞 +91 8189907917\n💬 WhatsApp: +91 8189907917\n\nOr fill the contact form on our website!',
    'flutter': 'Flutter is our primary mobile framework! We\'ve built 30+ Flutter apps with clean architecture, state management (BLoC/Riverpod), and Firebase integration.',
    'ai': 'We integrate cutting-edge AI features: ChatGPT integration, image recognition, recommendation engines, NLP, and custom ML models for your business!',
    'timeline': 'Typical timelines: Mobile app (6-12 weeks), Website (3-6 weeks), Enterprise software (3-6 months). We use agile sprints for transparent progress!',
    'hello': 'Hello! 👋 Welcome to RiskFreeFeel Technologies! I\'m RiskBot, your AI assistant. How can I help you today?',
    'hi': 'Hi there! 😊 I\'m RiskBot, here to help you discover our world-class tech solutions. What brings you here today?',
    'portfolio': 'We\'ve delivered 200+ projects including mobile apps, e-commerce platforms, enterprise solutions, and SaaS products. Check our Portfolio page for case studies!',
    'tech': 'Our tech stack includes Flutter, Android, iOS, Node.js, Firebase, Cloud (AWS/GCP), REST APIs, Java, Kotlin, Dart, C++, and more!',
    'support': 'We provide 24/7 technical support, 6-month free maintenance, and SLA-backed uptime guarantees. Your success is our commitment! 🛡️',
    'quote': 'Get a FREE project quote in 24 hours! Share your idea and we\'ll provide a detailed estimate. Contact us at info@riskfreefeel.co.in or call +91 8189907917.',
    'location': 'We are based in India and serve clients globally. Reach us at info@riskfreefeel.co.in or WhatsApp +91 8189907917 for a quick response!',
    'default': 'That\'s a great question! 🤔 Our team of experts can help you with that. Would you like to:\n• Schedule a free consultation\n• Get a project quote\n• Talk to our technical team\n\nCall us: +91 8189907917 or email info@riskfreefeel.co.in'
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
    }, 800 + Math.random() * 600);
  }

  function init() {
    const fab = document.getElementById('chatbot-fab');
    const btn = document.getElementById('chatbot-btn');
    const window_ = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const msgContainer = document.getElementById('chatbot-messages');
    const chatInput = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');

    if (!btn || !window_) return;

    let isOpen = false;
    let greeted = false;

    function toggle() {
      isOpen = !isOpen;
      window_.classList.toggle('open', isOpen);
      btn.textContent = isOpen ? '✕' : '🤖';

      if (isOpen && !greeted && msgContainer) {
        greeted = true;
        setTimeout(() => {
          addMessage('Hello! 👋 I\'m RiskBot, your AI assistant at RiskFreeFeel Technologies.\n\nHow can I help you today?', 'bot', msgContainer);
        }, 300);
      }
    }

    btn.addEventListener('click', toggle);
    if (closeBtn) closeBtn.addEventListener('click', toggle);

    if (sendBtn && chatInput && msgContainer) {
      sendBtn.addEventListener('click', () => sendMessage(chatInput, msgContainer));
      chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(chatInput, msgContainer); });
    }

    quickReplies.forEach(btn => {
      btn.addEventListener('click', () => {
        if (chatInput && msgContainer) {
          chatInput.value = btn.textContent;
          sendMessage(chatInput, msgContainer);
        }
      });
    });
  }

  return { init };
})();

/* ── Contact Form ─────────────────────────────────────────── */
const ContactForm = (() => {
  function init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate sending
      await new Promise(r => setTimeout(r, 1500));

      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';

      // Show success message
      const success = document.getElementById('form-success');
      if (success) {
        success.style.display = 'flex';
        success.style.animation = 'slide-up 0.4s ease';
      }

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
        if (success) success.style.display = 'none';
      }, 4000);
    });

    // Real-time validation
    const inputs = form.querySelectorAll('.input-field');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
    });
  }

  function validateField(field) {
    const value = field.value.trim();
    const type = field.type || field.tagName.toLowerCase();
    let valid = true;

    if (field.required && !value) {
      valid = false;
    } else if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      valid = false;
    }

    field.style.borderColor = valid ? '' : '#EF4444';
    return valid;
  }

  return { init };
})();

/* ── Newsletter Form ──────────────────────────────────────── */
const NewsletterForm = (() => {
  function init() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const input = form.querySelector('input');
        if (!btn || !input || !input.value.trim()) return;

        btn.textContent = '✓';
        btn.style.background = '#10B981';
        input.value = '';

        setTimeout(() => {
          btn.textContent = '→';
          btn.style.background = '';
        }, 3000);
      });
    });
  }

  return { init };
})();

/* ── Smooth Scroll for Anchor Links ──────────────────────── */
const SmoothScroll = (() => {
  function init() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
  return { init };
})();

/* ── Back to Top ──────────────────────────────────────────── */
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

/* ── Service Card Hover 3D Tilt ──────────────────────────── */
const TiltEffect = (() => {
  function init() {
    document.querySelectorAll('.service-card, .why-card, .pricing-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.4s ease';
        setTimeout(() => card.style.transition = '', 400);
      });
    });
  }
  return { init };
})();

/* ── Parallax Scrolling Effect ───────────────────────────── */
const ParallaxEffect = (() => {
  let elements = [];
  function onScroll() {
    const scrollY = window.scrollY;
    elements.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0;
      const y = scrollY * speed;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    });
  }
  function init() {
    elements = Array.from(document.querySelectorAll('.parallax'));
    if (!elements.length) return;
    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial position
    onScroll();
  }
  return { init };
})();

/* ── Initialize All Modules ──────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  ScrollProgress.init();
  Navbar.init();
  RevealAnimations.init();
  AnimatedCounters.init();
  Typewriter.init();
  ParticleCanvas.init();
  PortfolioFilter.init();
  TestimonialsCarousel.init();
  AIChatbot.init();
  ContactForm.init();
  NewsletterForm.init();
  SmoothScroll.init();
  BackToTop.init();
  TiltEffect.init();
  // Only desktop cursor effects
  if (window.innerWidth > 1024) {
    CursorSpotlight.init();
  }
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imgObserver = new IntersectionObserver((entries) => {
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
  // Initialize Parallax effect
  ParallaxEffect.init();

  console.log('🚀 RiskFreeFeel Technologies — All systems initialized!');
});
