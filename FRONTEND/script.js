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
  const searchInput = document.getElementById('catalogueSearch');
  const clearSearchBtn = document.getElementById('clearSearch');
  const categoriesScroll = document.getElementById('catalogueCategories');
  const categoriesWrapper = document.querySelector('.catalogue-categories-wrapper');
  
  // Create No Results element
  const noResultsDiv = document.createElement('div');
  noResultsDiv.className = 'catalogue-no-results text-center';
  noResultsDiv.style.display = 'none';
  noResultsDiv.style.gridColumn = '1 / -1';
  noResultsDiv.style.padding = '40px 20px';
  noResultsDiv.innerHTML = `
    <i class="ph ph-magnifying-glass" style="font-size: 48px; color: var(--gold); margin-bottom: 16px; display: inline-block;"></i>
    <h4 style="font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; margin-bottom: 8px;">No Services Found</h4>
    <p style="color: var(--text-muted); font-size: 14px;">Try searching for something else, like "painting", "ceiling", or "kitchen".</p>
  `;
  if (catGrid) {
    catGrid.appendChild(noResultsDiv);
  }

  const filterCatalogue = (category) => {
    // Clear search query if active
    if (searchInput && searchInput.value) {
      searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    }
    noResultsDiv.style.display = 'none';

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
      
      // Mobile Tab Centering
      if (window.innerWidth <= 1150 && categoriesScroll) {
        const wrapperRect = categoriesScroll.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        const offsetLeft = headerRect.left - wrapperRect.left + categoriesScroll.scrollLeft - (wrapperRect.width / 2) + (headerRect.width / 2);
        
        categoriesScroll.scrollTo({
          left: offsetLeft,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Load default catalogue cards (painting)
  filterCatalogue('painting');

  // Search filter handler
  const handleSearch = () => {
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      noResultsDiv.style.display = 'none';
      // Restore currently active category
      const activeHeader = document.querySelector('.category-header.active');
      const activeCat = activeHeader ? activeHeader.getAttribute('data-cat') : 'painting';
      
      catCards.forEach(card => {
        if (card.getAttribute('data-category') === activeCat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      return;
    }
    
    if (clearSearchBtn) clearSearchBtn.style.display = 'flex';
    
    // Hide active tabs highlights
    catHeaders.forEach(h => h.classList.remove('active'));
    
    let matchCount = 0;
    catCards.forEach(card => {
      const title = card.querySelector('.cat-service-title').textContent.toLowerCase();
      const desc = card.querySelector('.cat-service-desc').textContent.toLowerCase();
      
      if (title.includes(query) || desc.includes(query)) {
        card.style.display = 'flex';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    if (matchCount === 0) {
      noResultsDiv.style.display = 'block';
    } else {
      noResultsDiv.style.display = 'none';
    }
  };
  
  const updateSearchPlaceholder = () => {
    if (!searchInput) return;
    if (window.innerWidth <= 768) {
      searchInput.placeholder = "Search all 37 services...";
    } else {
      searchInput.placeholder = "Search across all 37 services (e.g. wall painting, false ceiling...)";
    }
  };
  updateSearchPlaceholder();
  window.addEventListener('resize', updateSearchPlaceholder);
  
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
  
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      // Restore default category (painting)
      const defaultHeader = document.querySelector('.category-header[data-cat="painting"]') || catHeaders[0];
      if (defaultHeader) {
        defaultHeader.click();
      }
    });
  }

  // Scroll fades check handler
  if (categoriesScroll && categoriesWrapper) {
    const updateScrollFades = () => {
      const scrollLeft = categoriesScroll.scrollLeft;
      const maxScroll = categoriesScroll.scrollWidth - categoriesScroll.clientWidth;
      
      if (maxScroll <= 0) {
        categoriesWrapper.classList.add('no-scroll');
        return;
      } else {
        categoriesWrapper.classList.remove('no-scroll');
      }
      
      if (scrollLeft > 10) {
        categoriesWrapper.classList.add('scrolled-left');
      } else {
        categoriesWrapper.classList.remove('scrolled-left');
      }
      
      if (maxScroll - scrollLeft > 10) {
        categoriesWrapper.classList.add('scrolled-right');
      } else {
        categoriesWrapper.classList.remove('scrolled-right');
      }
    };
    
    categoriesScroll.addEventListener('scroll', updateScrollFades);
    window.addEventListener('resize', updateScrollFades);
    updateScrollFades(); // initial check
  }

  // Mobile "Read More" Toggle Logic
  const setupReadMore = () => {
    const isMobile = window.innerWidth <= 768;
    
    catCards.forEach(card => {
      const desc = card.querySelector('.cat-service-desc');
      if (!desc) return;
      
      // Remove any existing read-more button first
      const existingBtn = card.querySelector('.read-more-btn');
      if (existingBtn) existingBtn.remove();
      
      if (isMobile) {
        if (desc.textContent.length > 120) {
          desc.classList.remove('expanded');
          const btn = document.createElement('button');
          btn.className = 'read-more-btn';
          btn.type = 'button';
          btn.innerHTML = 'Read More <i class="ph ph-caret-down"></i>';
          
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (desc.classList.contains('expanded')) {
              desc.classList.remove('expanded');
              btn.innerHTML = 'Read More <i class="ph ph-caret-down"></i>';
            } else {
              desc.classList.add('expanded');
              btn.innerHTML = 'Read Less <i class="ph ph-caret-up"></i>';
            }
          });
          
          // Append button to cardBody (safely inside the body container)
          const cardBody = card.querySelector('.cat-card-body');
          if (cardBody) {
            cardBody.appendChild(btn);
          }
        }
      } else {
        desc.classList.remove('expanded');
      }
    });
  };

  setupReadMore();
  window.addEventListener('resize', setupReadMore);

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
    } else if (width <= 1150) {
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
      const waURL = `https://wa.me/917992453466?text=${encodedWaText}`;
      
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

  // ==========================================================================
  // 14. LOGIN & REGISTER SYSTEM (LOCALSTORAGE PERSISTED)
  // ==========================================================================
  const loginModal = document.getElementById('loginModal');
  const closeLoginModal = document.getElementById('closeLoginModal');
  const loginModalOverlay = document.getElementById('loginModalOverlay');
  const navLoginBtn = document.getElementById('navLoginBtn');
  const mobileLoginBtn = document.getElementById('mobileLoginBtn');
  
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loggedInPanel = document.getElementById('loggedInPanel');
  
  const logoutBtn = document.getElementById('logoutBtn');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const userEmailDisplay = document.getElementById('userEmailDisplay');
  const userPhoneDisplay = document.getElementById('userPhoneDisplay');
  const userProjectDisplay = document.getElementById('userProjectDisplay');

  // Toggle Modal Open/Close
  const openModal = () => {
    loginModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateModalView();
  };

  const closeModal = () => {
    loginModal.classList.remove('open');
    if (!document.body.classList.contains('menu-open')) {
      document.body.style.overflow = '';
    }
  };

  if (navLoginBtn) navLoginBtn.addEventListener('click', openModal);
  if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Close mobile menu first
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger.classList.contains('open')) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
    openModal();
  });

  if (closeLoginModal) closeLoginModal.addEventListener('click', closeModal);
  if (loginModalOverlay) loginModalOverlay.addEventListener('click', closeModal);

  // Tab switching
  if (tabLoginBtn && tabRegisterBtn) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
      loggedInPanel.classList.remove('active');
    });

    tabRegisterBtn.addEventListener('click', () => {
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
      loggedInPanel.classList.remove('active');
    });
  }

  // Update modal views based on active session
  const updateModalView = () => {
    const activeUser = JSON.parse(localStorage.getItem('ujjwal_user'));
    
    // Clear error flags
    const errors = loginModal.querySelectorAll('.error-msg');
    errors.forEach(e => { e.textContent = ''; e.style.display = 'none'; });
    const inputs = loginModal.querySelectorAll('input');
    inputs.forEach(i => i.classList.remove('invalid'));

    if (activeUser) {
      // Hide tabs
      if (tabLoginBtn) tabLoginBtn.style.display = 'none';
      if (tabRegisterBtn) tabRegisterBtn.style.display = 'none';
      
      loginForm.classList.remove('active');
      registerForm.classList.remove('active');
      loggedInPanel.classList.add('active');
      
      // Populate details
      if (userNameDisplay) userNameDisplay.textContent = activeUser.name;
      if (userEmailDisplay) userEmailDisplay.textContent = activeUser.email;
      if (userPhoneDisplay) userPhoneDisplay.textContent = `+91 ${activeUser.phone}`;
      if (userProjectDisplay) userProjectDisplay.textContent = activeUser.project;
      
      // Update header nav buttons
      if (navLoginBtn) {
        navLoginBtn.innerHTML = `<i class="ph ph-user-circle"></i> <span class="login-btn-text">Hi, ${activeUser.name.split(' ')[0]}</span>`;
        navLoginBtn.style.borderColor = 'var(--gold)';
      }
      if (mobileLoginBtn) {
        mobileLoginBtn.innerHTML = `<i class="ph ph-user-circle"></i> <span>Profile (${activeUser.name.split(' ')[0]})</span>`;
      }
    } else {
      // Show tabs
      if (tabLoginBtn) {
        tabLoginBtn.style.display = 'block';
        tabLoginBtn.click();
      }
      if (tabRegisterBtn) tabRegisterBtn.style.display = 'block';
      
      loggedInPanel.classList.remove('active');
      
      // Restore header buttons
      if (navLoginBtn) {
        navLoginBtn.innerHTML = `<i class="ph ph-user"></i> <span class="login-btn-text">Login</span>`;
        navLoginBtn.style.borderColor = 'var(--gold)';
      }
      if (mobileLoginBtn) {
        mobileLoginBtn.innerHTML = `<i class="ph ph-user"></i> <span>Login / Profile</span>`;
      }
    }
  };

  // Register Form Submit
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('regName');
      const phoneInput = document.getElementById('regPhone');
      const emailInput = document.getElementById('regEmail');
      const passInput = document.getElementById('regPassword');
      const projectSelect = document.getElementById('regProject');
      
      const errName = document.getElementById('errRegName');
      const errPhone = document.getElementById('errRegPhone');
      const errEmail = document.getElementById('errRegEmail');
      const errPass = document.getElementById('errRegPassword');
      
      let valid = true;
      
      // Reset errors
      [nameInput, phoneInput, emailInput, passInput].forEach(inp => inp.classList.remove('invalid'));
      [errName, errPhone, errEmail, errPass].forEach(er => { er.textContent = ''; er.style.display = 'none'; });

      if (nameInput.value.trim().length < 3) {
        nameInput.classList.add('invalid');
        errName.textContent = 'Name must be at least 3 characters.';
        errName.style.display = 'block';
        valid = false;
      }

      let cleanedPhone = phoneInput.value.replace(/\D/g, '');
      if (cleanedPhone.length !== 10) {
        phoneInput.classList.add('invalid');
        errPhone.textContent = 'Please enter a valid 10-digit number.';
        errPhone.style.display = 'block';
        valid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('invalid');
        errEmail.textContent = 'Please enter a valid email address.';
        errEmail.style.display = 'block';
        valid = false;
      }

      if (passInput.value.length < 6) {
        passInput.classList.add('invalid');
        errPass.textContent = 'Password must be at least 6 characters.';
        errPass.style.display = 'block';
        valid = false;
      }

      if (valid) {
        const newUser = {
          name: nameInput.value.trim(),
          phone: cleanedPhone,
          email: emailInput.value.trim(),
          password: passInput.value,
          project: projectSelect.value
        };
        
        // Save to localStorage
        localStorage.setItem('ujjwal_user', JSON.stringify(newUser));
        updateModalView();
        
        // Populate quote service input if match found
        const serviceMap = {
          'Residential': 'Interior Design',
          'Commercial': 'Office/Commercial Interior',
          '3D Visualization': '3D Design & Visualization',
          'Construction': 'Building Construction'
        };
        const mappedService = serviceMap[newUser.project];
        const quoteSelect = document.getElementById('formService');
        const quoteNameInput = document.getElementById('formName');
        const quotePhoneInput = document.getElementById('formPhone');
        const quoteEmailInput = document.getElementById('formEmail');
        
        if (quoteSelect && mappedService) quoteSelect.value = mappedService;
        if (quoteNameInput) quoteNameInput.value = newUser.name;
        if (quotePhoneInput) quotePhoneInput.value = newUser.phone;
        if (quoteEmailInput) quoteEmailInput.value = newUser.email;
      }
    });
  }

  // Login Form Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = document.getElementById('loginEmail');
      const passInput = document.getElementById('loginPassword');
      const errEmail = document.getElementById('errLoginEmail');
      const errPass = document.getElementById('errLoginPassword');
      
      let valid = true;
      
      emailInput.classList.remove('invalid');
      passInput.classList.remove('invalid');
      errEmail.textContent = ''; errEmail.style.display = 'none';
      errPass.textContent = ''; errPass.style.display = 'none';

      const savedUser = JSON.parse(localStorage.getItem('ujjwal_user'));
      
      if (!savedUser) {
        emailInput.classList.add('invalid');
        errEmail.textContent = 'No account found. Please Register first.';
        errEmail.style.display = 'block';
        valid = false;
      } else {
        const queryVal = emailInput.value.toLowerCase().trim();
        if (queryVal !== savedUser.email.toLowerCase() && queryVal !== savedUser.phone) {
          emailInput.classList.add('invalid');
          errEmail.textContent = 'Incorrect Email or Phone Number.';
          errEmail.style.display = 'block';
          valid = false;
        }
        
        if (passInput.value !== savedUser.password) {
          passInput.classList.add('invalid');
          errPass.textContent = 'Incorrect password.';
          errPass.style.display = 'block';
          valid = false;
        }
      }

      if (valid && savedUser) {
        // Authenticated! Just update view
        updateModalView();
        
        // Populate quote form fields
        const quoteNameInput = document.getElementById('formName');
        const quotePhoneInput = document.getElementById('formPhone');
        const quoteEmailInput = document.getElementById('formEmail');
        if (quoteNameInput) quoteNameInput.value = savedUser.name;
        if (quotePhoneInput) quotePhoneInput.value = savedUser.phone;
        if (quoteEmailInput) quoteEmailInput.value = savedUser.email;
        
        closeModal();
      }
    });
  }

  // Logout Click
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('ujjwal_user');
      updateModalView();
      closeModal();
    });
  }
  
  // Initialize user status view on load
  updateModalView();

  // Redirect Request button inside modal
  const userFormBtn = document.getElementById('userFormBtn');
  if (userFormBtn) {
    userFormBtn.addEventListener('click', () => {
      closeModal();
    });
  }


  // ==========================================================================
  // 15. AI ASSISTANT CHAT BOT (SMART HEURISTICS)
  // ==========================================================================
  const aiChatToggle = document.getElementById('aiChatToggle');
  const aiChatPanel = document.getElementById('aiChatPanel');
  const closeAiChat = document.getElementById('closeAiChat');
  const aiChatMessages = document.getElementById('aiChatMessages');
  const aiChatForm = document.getElementById('aiChatForm');
  const aiChatInput = document.getElementById('aiChatInput');
  const aiChips = document.querySelectorAll('.ai-chip');

  const toggleAiChat = () => {
    aiChatPanel.classList.toggle('open');
    if (aiChatPanel.classList.contains('open')) {
      if (aiChatInput) aiChatInput.focus();
      scrollToBottom();
    }
  };

  if (aiChatToggle) aiChatToggle.addEventListener('click', toggleAiChat);
  if (closeAiChat) closeAiChat.addEventListener('click', toggleAiChat);

  const scrollToBottom = () => {
    if (aiChatMessages) {
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }
  };

  // Quick suggestion chips
  aiChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const question = chip.textContent;
      sendUserMessage(question);
    });
  });

  const sendUserMessage = (text) => {
    if (!text.trim()) return;

    // Render User Message
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'ai-message user';
    userMsgDiv.innerHTML = `<div class="message-content">${escapeHTML(text)}</div>`;
    aiChatMessages.appendChild(userMsgDiv);
    scrollToBottom();

    // Show Typing Indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message assistant typing-indicator-msg';
    typingDiv.innerHTML = `
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    aiChatMessages.appendChild(typingDiv);
    scrollToBottom();

    // Process Bot Response after realistic delay
    setTimeout(() => {
      typingDiv.remove();
      const botResponse = getAiResponse(text);
      
      const assistantMsgDiv = document.createElement('div');
      assistantMsgDiv.className = 'ai-message assistant';
      assistantMsgDiv.innerHTML = `<div class="message-content">${formatMarkdown(botResponse)}</div>`;
      aiChatMessages.appendChild(assistantMsgDiv);
      scrollToBottom();
    }, 1200);
  };

  if (aiChatForm) {
    aiChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = aiChatInput.value;
      aiChatInput.value = '';
      sendUserMessage(text);
    });
  }

  const escapeHTML = (text) => {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  const formatMarkdown = (text) => {
    // Basic formatting for bold **text** and lists
    let html = escapeHTML(text);
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/\n/g, '<br/>');
    return html;
  };

  // smart heuristic bot answers
  const getAiResponse = (input) => {
    const raw = input.toLowerCase();
    
    // Greetings
    if (raw.includes('hello') || raw.includes('hi') || raw.includes('hey') || raw.includes('namaste')) {
      return "Hello! How can Ujjwal Interior design helper assist you today? Ask me about costs, ceiling designs, materials, or our office location!";
    }
    
    // Office Location / Address
    if (raw.includes('location') || raw.includes('office') || raw.includes('address') || raw.includes('kahan') || raw.includes('where')) {
      return "Our Dhanbad office is located at:\n\n**Shop No. 301, Equinox Plaza, Opposite Royal Enfield Showroom, Govindpur Road, Saraidhela, Dhanbad – 828127, Jharkhand**.\n\nAap contact page par direct Google Maps direction bhi check kar sakte hain!";
    }

    // WhatsApp / Contact
    if (raw.includes('phone') || raw.includes('mobile') || raw.includes('whatsapp') || raw.includes('contact') || raw.includes('number')) {
      return "Aap hamare principal interior architect Mr. Ujjwal ko WhatsApp ya call direct kar sakte hain: **+91-7992453466**.\n\nYa niche Enquiry Form fill karein, hum 15 min me callback karenge!";
    }

    // 2BHK / 3BHK Cost
    if (raw.includes('cost') || raw.includes('budget') || raw.includes('price') || raw.includes('estimate') || raw.includes('2bhk') || raw.includes('3bhk') || raw.includes('kitna') || raw.includes('paisa')) {
      let size = "3BHK";
      if (raw.includes('2bhk')) size = "2BHK";
      
      return `Dhanbad me ek standard **${size} home** ke interior design ka cost design requirements par depend karta hai:\n\n1. **Essential Package** (Modular Kitchen, Wardrobes, Basic POP False Ceiling): **₹1.5 Lakhs – ₹3 Lakhs**\n2. **Premium Package** (Designer False Ceilings, Custom TV units, Premium Wall painting, Lighting, Wallpaper): **₹3 Lakhs – ₹6 Lakhs**\n3. **Luxury Package** (Full 3D visualization, Premium Veneer/Acrylic finish, Italian marble styling, Automation): **₹6 Lakhs+**\n\nEk exact customized budget sheet ke liye aap niche enquiry form me details fill kar sakte hain ya WhatsApp par chat karein!`;
    }

    // Modular Kitchen
    if (raw.includes('kitchen') || raw.includes('modular') || raw.includes('rasoi')) {
      return "Ujjwal Interior modular kitchen ke liye multiple options options design karta hai:\n\n- **Layouts**: L-Shape, U-Shape, Parallel, Island Kitchen.\n- **Materials**: Waterproof Marine Ply (IS:710 grade), anti-rust soft-close drawers, acrylic/laminate shutters, quartz/granite countertops.\n- **Cost**: Modular kitchen estimates hum Dhanbad me ₹80,000 se start karte hain depending on area and accessories.";
    }

    // False Ceiling (POP vs PVC)
    if (raw.includes('ceiling') || raw.includes('pop') || raw.includes('pvc') || raw.includes('roof')) {
      return "**POP (Plaster of Paris)** and **PVC** ceilings ke apne advantages hain:\n\n1. **POP Ceilings**: Extremely flexible for high-end aesthetic cove lighting, shapes, and designs. Durable but takes time to install. Ideal for Living Rooms and Bedrooms.\n2. **PVC Ceilings**: 100% moisture-proof, zero maintenance, installs in 1 day. Best suited for high humidity areas like kitchens, bathrooms, balconies, or offices.\n\nHum POP and Gypsum ceiling works Dhanbad me provide karte hain. Kya aap custom design visualization chahte hain?";
    }

    // Wall Painting
    if (raw.includes('paint') || raw.includes('wall') || raw.includes('color') || raw.includes('colour') || raw.includes('painting')) {
      return "Wall painting ke liye hum Asian Paints and Berger ke premium emulsions use karte hain (Royale, Apex Weathercoat).\n\n- **Textures**: Living rooms ke liye premium metallic or velvet textures best hain.\n- **Consultation**: Hum free color consulting aur shade selection helper provide karte hain standard project execution ke sath.";
    }

    // Timeline / Kitna time lagega
    if (raw.includes('time') || raw.includes('duration') || raw.includes('timeline') || raw.includes('days') || raw.includes('kitna din') || raw.includes('work duration')) {
      return "Standard project execution duration:\n\n- **Modular Kitchen**: 15 to 20 Days\n- **Complete 2BHK/3BHK Home Interior**: 45 to 60 Days\n- **False Ceiling/Painting Single Room**: 7 to 10 Days\n\nHum commitment date par work handover guarantee karte hain RCC civil quality construction ke sath.";
    }

    // Architect / Blueprint / Floor Plan
    if (raw.includes('architect') || raw.includes('plan') || raw.includes('floor') || raw.includes('map') || raw.includes('naksha') || raw.includes('structural')) {
      return "Yes! Ujjwal Interior Dhanbad me building plan services aur floor naksha plans provide karta hai. Hum detailed **2D Floor Plans, 3D Elevation modeling, aur Structural drawings** compile karte hain municipal approvals aur civil steel estimates ke liye.";
    }

    // Default Fallback
    return "Thank you for asking! Ujjwal Interior Dhanbad, Jharkhand me premium interior designer and architectural services provide karta hai. Established in 2014, humne 200+ projects design kiye hain.\n\nAap custom query discussion ke liye hamare executive ko **+91-7992453466** par direct call or WhatsApp kar sakte hain, ya niche query list and contact form select karke submit karein!";
  };
});
