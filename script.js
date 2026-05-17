document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile menu
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = 'none';
        s.style.opacity = '1';
      });
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Booking modal
  const modal = document.querySelector('.modal-overlay');
  document.querySelectorAll('[data-book]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });
  document.querySelector('.modal-close')?.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  modal?.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Dark mode toggle
  const darkToggle = document.querySelector('.dark-toggle');
  darkToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    darkToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  });

  // ============================================================
  // CONFIGURATION — Business owner settings
  // ============================================================
  const BUSINESS_EMAIL = 'k20287411@gmail.com';
  const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${BUSINESS_EMAIL}`;
  // After deploying the Google Apps Script (see google_sheets_setup.md),
  // paste your Web App URL below:
  const GOOGLE_SHEET_URL = ''; // e.g. 'https://script.google.com/macros/s/XXXX/exec'

  // Helper: send data to FormSubmit (email)
  async function sendToEmail(data, formType) {
    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `New ${formType} — Brew Haven Cafe`,
          _template: 'table',
          ...data
        })
      });
      return res.ok;
    } catch (err) {
      console.error('Email send failed:', err);
      return false;
    }
  }

  // Helper: send data to Google Sheets
  async function sendToGoogleSheets(data, formType) {
    if (!GOOGLE_SHEET_URL) return true; // skip if not configured
    try {
      const res = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType, timestamp: new Date().toLocaleString(), ...data })
      });
      return true;
    } catch (err) {
      console.error('Google Sheets send failed:', err);
      return false;
    }
  }

  // Helper: button loading state
  function setButtonLoading(btn, loading) {
    if (loading) {
      btn.dataset.originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.7';
    } else {
      btn.textContent = btn.dataset.originalText || btn.textContent;
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  }

  // Contact form — sends email + logs to sheet
  document.getElementById('contactForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-submit');
    setButtonLoading(btn, true);

    const data = {
      Name: document.getElementById('contact-name').value,
      Email: document.getElementById('contact-email').value,
      Subject: document.getElementById('contact-subject').value,
      Message: document.getElementById('contact-message').value
    };

    const [emailOk] = await Promise.all([
      sendToEmail(data, 'Contact Message'),
      sendToGoogleSheets(data, 'Contact')
    ]);

    setButtonLoading(btn, false);
    if (emailOk) {
      alert('✅ Thank you for your message! We will get back to you soon.');
      e.target.reset();
    } else {
      alert('⚠️ Could not send your message. Please try again or contact us directly.');
    }
  });

  // Booking form — sends email + logs to sheet
  document.getElementById('bookingForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-submit');
    setButtonLoading(btn, true);

    const data = {
      Name: document.getElementById('booking-name').value,
      Email: document.getElementById('booking-email').value,
      Phone: document.getElementById('booking-phone').value,
      Date: document.getElementById('booking-date').value,
      Time: document.getElementById('booking-time').value,
      Guests: document.getElementById('booking-guests').value
    };

    const [emailOk] = await Promise.all([
      sendToEmail(data, 'Table Booking'),
      sendToGoogleSheets(data, 'Booking')
    ]);

    setButtonLoading(btn, false);
    if (emailOk) {
      alert('✅ Your table has been booked! We look forward to seeing you.');
      e.target.reset();
      modal.classList.remove('active');
    } else {
      alert('⚠️ Could not submit your booking. Please try again or call us directly.');
    }
  });

  // Counter animation
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        let count = 0;
        const increment = target / 60;
        const update = () => {
          count += increment;
          if (count < target) {
            entry.target.textContent = Math.ceil(count);
            requestAnimationFrame(update);
          } else {
            entry.target.textContent = target;
          }
        };
        update();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));
});
