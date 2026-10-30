/**
 * Brilla Landing Page — Modern Vanilla JavaScript
 * Clean, lightweight, modular, and dependency-free.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. STICKY NAVBAR & SCROLL SHADOW
     ========================================================================== */
  const header = document.getElementById('header');

  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = (forceState) => {
    const isOpen = typeof forceState === 'boolean' 
      ? forceState 
      : !mobileDrawer.classList.contains('open');

    mobileToggle.classList.toggle('active', isOpen);
    mobileDrawer.classList.toggle('open', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen);
    mobileDrawer.setAttribute('aria-hidden', !isOpen);

    // Prevent body scrolling when mobile menu is active
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());

    // Close when clicking any mobile link
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // Close on resize if transitioning back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileDrawer.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    });
  }

  /* ==========================================================================
     3. SCROLLSPY ACTIVE NAV HIGHLIGHT
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-links .nav-link');

  const highlightNavOnScroll = () => {
    const scrollPosition = window.scrollY + 140; // Offset for sticky header

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        desktopLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });

        mobileLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  /* ==========================================================================
     4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    reveals.forEach((el) => el.classList.add('active'));
  }

  /* ==========================================================================
     5. BACK TO TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTopBtn');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     6. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const submitContactBtn = document.getElementById('submitContactBtn');
  const successAlert = document.getElementById('formSuccessAlert');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // Simple RFC 2822 email format check
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const clearErrors = () => {
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    nameInput.classList.remove('invalid');
    emailInput.classList.remove('invalid');
    messageInput.classList.remove('invalid');
  };

  if (contactForm) {
    // Live input validation on typing
    [nameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('invalid');
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let hasError = false;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameError.textContent = 'Please enter your full name (at least 2 characters).';
        nameInput.classList.add('invalid');
        hasError = true;
      }

      // Validate Email
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        emailInput.classList.add('invalid');
        hasError = true;
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
        messageError.textContent = 'Please include a brief message (at least 8 characters).';
        messageInput.classList.add('invalid');
        hasError = true;
      }

      if (hasError) return;

      // Simulate network submission state
      submitContactBtn.classList.add('loading');
      submitContactBtn.disabled = true;

      setTimeout(() => {
        submitContactBtn.classList.remove('loading');
        submitContactBtn.disabled = false;
        contactForm.reset();

        // Show animated success alert
        successAlert.style.display = 'flex';

        // Auto-scroll slightly to show confirmation
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide alert after 7 seconds
        setTimeout(() => {
          successAlert.style.display = 'none';
        }, 7000);
      }, 900);
    });
  }

  /* ==========================================================================
     7. "GET STARTED" MODAL WORKFLOW
     ========================================================================== */
  const modalOverlay = document.getElementById('getStartedModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalButtons = document.querySelectorAll('.open-modal-btn');
  const getStartedForm = document.getElementById('getStartedForm');
  const modalSuccessBox = document.getElementById('modalSuccessBox');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalHandleInput = document.getElementById('modalHandle');

  const openModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first input
    const firstInput = modalOverlay.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);

    // If mobile drawer was open, close it
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Reset modal content after animation
    setTimeout(() => {
      if (getStartedForm) getStartedForm.style.display = 'block';
      if (modalSuccessBox) modalSuccessBox.style.display = 'none';
      if (getStartedForm) getStartedForm.reset();
    }, 300);
  };

  openModalButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalDismissBtn) {
    modalDismissBtn.addEventListener('click', closeModal);
  }

  // Click outside to close modal
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // ESC key to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Slugify handle input as user types
  if (modalHandleInput) {
    modalHandleInput.addEventListener('input', (e) => {
      let sanitized = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '')
        .replace(/--+/g, '-');
      e.target.value = sanitized;
    });
  }

  // Get Started form submission
  if (getStartedForm) {
    getStartedForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = getStartedForm.querySelector('button[type="submit"]');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Reserving your handle...';

      setTimeout(() => {
        getStartedForm.style.display = 'none';
        modalSuccessBox.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create My Free Portfolio';
      }, 800);
    });
  }

  /* ==========================================================================
     8. INTERACTIVE COPY HANDLE DEMO IN "HOW IT WORKS"
     ========================================================================== */
  const miniCopyBtn = document.querySelector('.mini-copy-btn');
  if (miniCopyBtn) {
    miniCopyBtn.addEventListener('click', () => {
      const originalText = miniCopyBtn.textContent;
      miniCopyBtn.textContent = 'Copied! ✓';
      miniCopyBtn.style.background = '#ECFDF5';
      miniCopyBtn.style.color = '#059669';

      setTimeout(() => {
        miniCopyBtn.textContent = originalText;
        miniCopyBtn.style.background = '';
        miniCopyBtn.style.color = '';
      }, 2000);
    });
  }
});
