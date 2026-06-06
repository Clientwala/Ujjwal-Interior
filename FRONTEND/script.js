document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. NAVBAR SCROLL BEHAVIOR
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  
  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check in case page starts scrolled

  // ==========================================================================
  // 2. ACTIVE SECTION HIGHLIGHTING (INTERSECTION OBSERVER)
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -40% 0px', // Adjusted to match sticky nav height
    threshold: 0.15
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => sectionObserver.observe(section));

  // ==========================================================================
  // 3. HAMBURGER MENU TOGGLE & BODY SCROLL LOCK
  // ==========================================================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-nav-link');
  
  const toggleMenu = () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  };
  
  hamburger.addEventListener('click', toggleMenu);
  
  // Close menu when clicking links
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // ==========================================================================
  // 4. SMOOTH SCROLL CORRECTION
  // ==========================================================================
  // Note: CSS scroll-behavior: smooth handles most link scrolling.
  // This JS intercept guarantees offset adjustment if needed.
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // 5. GALLERY FILTER SYSTEM
  // ==========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioGrid = document.getElementById('portfolioGrid');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active classes on tab buttons
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const filterValue = tab.getAttribute('data-filter');
      
      // Fade out grid
      portfolioGrid.style.opacity = '0';
      portfolioGrid.style.transform = 'translateY(15px)';
      portfolioGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        portfolioItems.forEach(item => {
          if (filterValue === 'all') {
            item.style.display = 'block';
          } else if (item.classList.contains(filterValue)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
        
        // Fade in grid
        portfolioGrid.style.opacity = '1';
        portfolioGrid.style.transform = 'translateY(0)';
      }, 300);
    });
  });

  // ==========================================================================
  // 6. LIGHTBOX MODAL (PAGESWIPING VISIBLE PORTFOLIO IMAGES)
  // ==========================================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  
  let currentVisibleItems = [];
  let currentImgIndex = 0;
  
  // Open Lightbox
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      // Find all currently displayed items (based on filter)
      currentVisibleItems = Array.from(portfolioItems).filter(el => el.style.display !== 'none');
      currentImgIndex = currentVisibleItems.indexOf(item);
      
      updateLightboxContent();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock scrolling
    });
  });
  
  const updateLightboxContent = () => {
    if (currentVisibleItems.length === 0) return;
    const currentItem = currentVisibleItems[currentImgIndex];
    const imgSrc = currentItem.getAttribute('data-src');
    const imgText = currentItem.querySelector('.overlay-text').textContent;
    
    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = imgText;
  };
  
  const nextImage = () => {
    currentImgIndex = (currentImgIndex + 1) % currentVisibleItems.length;
    updateLightboxContent();
  };
  
  const prevImage = () => {
    currentImgIndex = (currentImgIndex - 1 + currentVisibleItems.length) % currentVisibleItems.length;
    updateLightboxContent();
  };
  
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    if (!document.body.classList.contains('menu-open')) {
      document.body.style.overflow = ''; // Unlock scrolling
    }
  };
  
  lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', closeLightbox);
  
  // Close/navigate via Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // ==========================================================================
  // 7. VIDEO CARD REDIRECTS
  // ==========================================================================
  const videoCards = document.querySelectorAll('.video-card');
  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const url = card.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });

  // ==========================================================================
  // 8. SERVICES CATALOGUE ACCORDION & TABS FILTERING
  // ==========================================================================
  const catHeaders = document.querySelectorAll('.category-header');
  const catGrid = document.getElementById('catalogueGrid');
  const catCards = document.querySelectorAll('.catalogue-card');
  
  const filterCatalogue = (category) => {
    catGrid.style.opacity = '0';
    catGrid.style.transition = 'opacity 0.25s ease';
    
    setTimeout(() => {
      catCards.forEach(card => {
        if (card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      catGrid.style.opacity = '1';
    }, 250);
  };
  
  catHeaders.forEach(header => {
    header.addEventListener('click', () => {
      catHeaders.forEach(h => h.classList.remove('active'));
      header.classList.add('active');
      
      const category = header.getAttribute('data-cat');
      filterCatalogue(category);
      
      // Auto-scroll on mobile to show filtered cards if clicked tabs
      if (window.innerWidth <= 1024) {
        const gridTop = catGrid.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 20;
        window.scrollTo({
          top: gridTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Load default catalogue cards (painting)
  filterCatalogue('painting');

  // Enquire links on primary cards pre-select services
  const primaryEnquireLinks = document.querySelectorAll('.card-enquire-btn, .catalogue-link-btn, .btn-cat-quote');
  const serviceSelect = document.getElementById('formService');
  
  primaryEnquireLinks.forEach(link => {
    link.addEventListener('click', () => {
      const serviceName = link.getAttribute('data-service');
      if (serviceName && serviceSelect) {
        serviceSelect.value = serviceName;
      }
    });
  });

  // ==========================================================================
  // 9. TESTIMONIALS CAROUSEL (TOUCH SWIPES + AUTO SCROLL + MANUAL CONTROLS)
  // ==========================================================================
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const indicatorsContainer = document.getElementById('carouselIndicators');
  const cards = Array.from(track.children);
  
  let slideIndex = 0;
  let autoPlayTimer = null;
  let visibleCardsCount = 3;
  
  const updateResponsiveCounts = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      visibleCardsCount = 1;
    } else if (width <= 1024) {
      visibleCardsCount = 2;
    } else {
      visibleCardsCount = 3;
    }
  };
  
  const setupIndicators = () => {
    indicatorsContainer.innerHTML = '';
    const totalSlides = cards.length - visibleCardsCount + 1;
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('indicator-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoPlay();
      });
      indicatorsContainer.appendChild(dot);
    }
  };
  
  const updateIndicators = () => {
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, idx) => {
      if (idx === slideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };
  
  const goToSlide = (index) => {
    updateResponsiveCounts();
    const maxIndex = cards.length - visibleCardsCount;
    
    // Bounds check
    if (index < 0) {
      slideIndex = maxIndex;
    } else if (index > maxIndex) {
      slideIndex = 0;
    } else {
      slideIndex = index;
    }
    
    // Calculate slide percentage width
    const cardWidth = 100 / visibleCardsCount;
    track.style.transform = `translateX(-${slideIndex * cardWidth}%)`;
    updateIndicators();
  };
  
  const nextSlide = () => {
    goToSlide(slideIndex + 1);
  };
  
  const prevSlide = () => {
    goToSlide(slideIndex - 1);
  };
  
  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
  
  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      nextSlide();
      resetAutoPlay();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      prevSlide();
      resetAutoPlay();
    }
  };
  
  // Auto-scroll loop
  const startAutoPlay = () => {
    autoPlayTimer = setInterval(nextSlide, 4000);
  };
  
  const stopAutoPlay = () => {
    clearInterval(autoPlayTimer);
  };
  
  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };
  
  // Hover pauses auto play
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);
  
  // Initialize Carousel
  updateResponsiveCounts();
  setupIndicators();
  goToSlide(0);
  startAutoPlay();
  
  window.addEventListener('resize', () => {
    updateResponsiveCounts();
    setupIndicators();
    goToSlide(slideIndex);
  });

  // ==========================================================================
  // 10. STAT COUNTERS ANIMATION (INTERSECTION OBSERVER)
  // ==========================================================================
  const counterSection = document.getElementById('aboutStats');
  const counters = document.querySelectorAll('.stat-number');
  let animationTriggered = false;
  
  const countUp = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = counter.hasAttribute('data-decimal');
      const duration = 2000; // Total count duration in ms
      const start = 0;
      let startTime = null;
      
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function: easeOutQuad
        const ease = progress * (2 - progress);
        
        const currentValue = start + ease * (target - start);
        
        if (isDecimal) {
          counter.textContent = currentValue.toFixed(1);
        } else {
          counter.textContent = Math.floor(currentValue);
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          counter.textContent = target; // Ensure exact final value is set
        }
      };
      
      requestAnimationFrame(animate);
    });
  };
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animationTriggered) {
        countUp();
        animationTriggered = true;
      }
    });
  }, { threshold: 0.3 });
  
  if (counterSection) {
    counterObserver.observe(counterSection);
  }

  // ==========================================================================
  // 11. SCROLL-TO-TOP BUTTON
  // ==========================================================================
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });
  
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================================================================
  // 12. CONTACT & ENQUIRY FORM VALIDATION + SUCCESS ACTION
  // ==========================================================================
  const form = document.getElementById('enquiryForm');
  const successMessage = document.getElementById('successMessage');
  
  const errName = document.getElementById('errName');
  const errPhone = document.getElementById('errPhone');
  const errEmail = document.getElementById('errEmail');
  const errService = document.getElementById('errService');
  
  const successClientName = document.getElementById('successClientName');
  const successClientPhone = document.getElementById('successClientPhone');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset errors
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(el => el.classList.remove('invalid'));
    const errorSpans = [errName, errPhone, errEmail, errService];
    errorSpans.forEach(span => { span.style.display = 'none'; span.textContent = ''; });
    
    // Read values
    const name = document.getElementById('formName').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const locality = document.getElementById('formLocality').value.trim();
    const service = document.getElementById('formService').value;
    const budget = document.getElementById('formBudget').value;
    const message = document.getElementById('formMessage').value.trim();
    
    const propertyTypeEl = form.querySelector('input[name="property_type"]:checked');
    const propertyType = propertyTypeEl ? propertyTypeEl.value : 'N/A';
    
    let isValid = true;
    
    // 1. Validate Name
    if (!name) {
      document.getElementById('formName').classList.add('invalid');
      errName.textContent = 'Full name is required.';
      errName.style.display = 'block';
      isValid = false;
    }
    
    // 2. Validate Phone (exactly 10 digits after stripping +91 or leading zeros/non-digits)
    // Strip leading +91, 91, then keep only digits
    let cleanedPhone = phone.replace(/^(\+91|91)/, '').replace(/\D/g, '');
    if (!phone) {
      document.getElementById('formPhone').classList.add('invalid');
      errPhone.textContent = 'Phone number is required.';
      errPhone.style.display = 'block';
      isValid = false;
    } else if (cleanedPhone.length !== 10) {
      document.getElementById('formPhone').classList.add('invalid');
      errPhone.textContent = 'Please enter a valid 10-digit phone number.';
      errPhone.style.display = 'block';
      isValid = false;
    }
    
    // 3. Validate Email (Optional, but checks pattern if typed)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        document.getElementById('formEmail').classList.add('invalid');
        errEmail.textContent = 'Please enter a valid email address.';
        errEmail.style.display = 'block';
        isValid = false;
      }
    }
    
    // 4. Validate Service Dropdown
    if (!service) {
      document.getElementById('formService').classList.add('invalid');
      errService.textContent = 'Please select a service.';
      errService.style.display = 'block';
      isValid = false;
    }
    
    if (isValid) {
      // Hide form and render Success panel
      form.style.display = 'none';
      successClientName.textContent = name;
      successClientPhone.textContent = `+91-${cleanedPhone}`;
      successMessage.style.display = 'block';
      
      // Construct structured WhatsApp message detail blocks
      let waText = `New Website Enquiry!\n\n`;
      waText += `Name: ${name}\n`;
      waText += `Phone: +91 ${cleanedPhone}\n`;
      if (email) waText += `Email: ${email}\n`;
      if (locality) waText += `Locality: ${locality}\n`;
      waText += `Service: ${service}\n`;
      waText += `Property Type: ${propertyType}\n`;
      if (budget) waText += `Budget: ${budget}\n`;
      if (message) waText += `Message: ${message}`;
      
      const encodedWaText = encodeURIComponent(waText);
      const waURL = `https://wa.me/919972815385?text=${encodedWaText}`;
      
      // Update success WhatsApp button link
      document.getElementById('successWaBtn').href = waURL;
      
      // Open WhatsApp link silently in a new tab
      window.open(waURL, '_blank', 'noopener,noreferrer');
    } else {
      // Scroll to the first invalid field for better mobile UX
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // ==========================================================================
  // 13. SCROLL TRIGGERED FADE-IN ANIMATIONS
  // ==========================================================================
  const animElements = document.querySelectorAll('.animate-on-scroll');
  
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });
  
  animElements.forEach(el => animObserver.observe(el));
});
