/**
 * LekhaPora Coaching Center - Main Application Script
 * Developer: Arnab Sir / Antigravity AI
 * Year: 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initCourseFilter();
  initLabPlayground();
  initTestimonialSlider();
  initFaqAccordion();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   THEME MANAGER (DARK / LIGHT MODE)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  // Retrieve theme preference from localStorage or system defaults
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const activeTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', activeTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ==========================================================================
   NAVBAR & SCROLL EFFECTS
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('header.main-header');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  // Scroll event for styling header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile navigation drawer toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Animate hamburger lines
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
      spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
      spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
    });

    // Close mobile nav drawer when clicking any link
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // Active link tracking on scroll (using IntersectionObserver)
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the focus area
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   COURSE FILTERING
   ========================================================================== */
function initCourseFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  if (filterBtns.length === 0 || courseCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons and add to clicked
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Custom animated show/hide
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // match transition speed
        }
      });
    });
  });
}

/* ==========================================================================
   INTERACTIVE LAB PLAYGROUND
   ========================================================================== */
function initLabPlayground() {
  const tabBtns = document.querySelectorAll('.lab-tab-btn');
  const playContents = document.querySelectorAll('.lab-content');

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      playContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      document.getElementById(`${targetTab}Lab`).classList.add('active');
    });
  });

  // Math Quiz logic
  const mathOptions = document.querySelectorAll('#mathLab .quiz-option-btn');
  const mathFeedback = document.getElementById('mathFeedback');
  let mathSolved = false;

  mathOptions.forEach(option => {
    option.addEventListener('click', () => {
      if (mathSolved) return; // Prevent clicking multiple times once solved

      const isCorrect = option.getAttribute('data-correct') === 'true';
      mathOptions.forEach(opt => {
        if (opt.getAttribute('data-correct') === 'true') {
          opt.classList.add('correct');
        } else {
          opt.classList.add('wrong');
        }
      });

      mathFeedback.classList.remove('quiz-feedback-success', 'quiz-feedback-error');
      
      if (isCorrect) {
        mathFeedback.classList.add('quiz-feedback-success', 'show');
        mathFeedback.innerHTML = `
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <span><strong>Perfect!</strong> 72 km/h is 20 meters/sec (72 * 5/18). In 15 seconds, the distance covered is 20 * 15 = 300 meters. Outstanding!</span>
        `;
      } else {
        mathFeedback.classList.add('quiz-feedback-error', 'show');
        mathFeedback.innerHTML = `
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
          <span><strong>Incorrect, but a great attempt!</strong> The correct answer is 300 meters. (Conversion: 72 km/h = 20 m/s. Distance = 20 * 15 = 300m).</span>
        `;
      }
      mathSolved = true;
    });
  });

  // CS / Code Quiz logic
  const csOptions = document.querySelectorAll('#csLab .quiz-option-btn');
  const csFeedback = document.getElementById('csFeedback');
  let csSolved = false;

  csOptions.forEach(option => {
    option.addEventListener('click', () => {
      if (csSolved) return;

      const isCorrect = option.getAttribute('data-correct') === 'true';
      csOptions.forEach(opt => {
        if (opt.getAttribute('data-correct') === 'true') {
          opt.classList.add('correct');
        } else {
          opt.classList.add('wrong');
        }
      });

      csFeedback.classList.remove('quiz-feedback-success', 'quiz-feedback-error');

      if (isCorrect) {
        csFeedback.classList.add('quiz-feedback-success', 'show');
        csFeedback.innerHTML = `
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <span><strong>Correct!</strong> Java follows operator precedence: 3 * 2 = 6, 8 / 4 = 2. Then, addition/subtraction: 5 + 6 - 2 = 9. Excellent logical reasoning!</span>
        `;
      } else {
        csFeedback.classList.add('quiz-feedback-error', 'show');
        csFeedback.innerHTML = `
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
          <span><strong>Not quite right!</strong> Operator precedence rules in Java calculate multiplication & division before addition & subtraction: 5 + (3 * 2) - (8 / 4) = 5 + 6 - 2 = 9.</span>
        `;
      }
      csSolved = true;
    });
  });
}

/* ==========================================================================
   TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.testimonial-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoPlayTimer;

  // Create dot indicators
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots status
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
  }

  function nextSlide() {
    let nextIdx = currentIndex + 1;
    if (nextIdx >= slides.length) nextIdx = 0;
    goToSlide(nextIdx);
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, 5000); // Switch slide every 5s
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  startAutoPlay();
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      const faqBody = faqItem.querySelector('.faq-body');
      
      // Close other opened FAQs
      const activeFaqs = document.querySelectorAll('.faq-item.active');
      activeFaqs.forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          item.querySelector('.faq-body').style.maxHeight = null;
        }
      });

      // Toggle current FAQ
      faqItem.classList.toggle('active');
      if (faqItem.classList.contains('active')) {
        faqBody.style.maxHeight = faqBody.scrollHeight + "px";
      } else {
        faqBody.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================================================
   CONTACT & ENROLLMENT FORM VALIDATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('enrollmentForm');
  const popup = document.getElementById('successPopup');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Select inputs
    const studentName = document.getElementById('studentName');
    const guardianPhone = document.getElementById('guardianPhone');
    const studentEmail = document.getElementById('studentEmail');
    const department = document.getElementById('department');
    const studentClass = document.getElementById('studentClass');

    let isValid = true;

    // Reset styles
    [studentName, guardianPhone, studentEmail, department, studentClass].forEach(input => {
      input.style.borderColor = '';
    });

    // Validation checks
    if (studentName.value.trim() === '') {
      markInvalid(studentName);
      isValid = false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(guardianPhone.value.trim())) {
      markInvalid(guardianPhone);
      isValid = false;
    }

    if (studentEmail.value.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(studentEmail.value.trim())) {
        markInvalid(studentEmail);
        isValid = false;
      }
    }

    if (department.value === '') {
      markInvalid(department);
      isValid = false;
    }

    if (studentClass.value === '') {
      markInvalid(studentClass);
      isValid = false;
    }

    if (isValid) {
      // Mocking submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending Inquiry...';
      submitBtn.disabled = true;

      // Simulate network request
      setTimeout(() => {
        // Show success alert
        if (popup) {
          popup.classList.add('show');
          setTimeout(() => {
            popup.classList.remove('show');
          }, 4000);
        }

        // Reset form & states
        form.reset();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }, 1200);
    }
  });

  function markInvalid(input) {
    input.style.borderColor = 'var(--error-color)';
    input.focus();
  }
}

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
