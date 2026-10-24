/**
 * Senith Eknath - Developer Portfolio Engine
 * High-performance UI interactions, scroll-spy, smooth navigation, and accessible photography lightbox.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Controls
  const menuButton = document.getElementById('menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navbar = document.querySelector('.glass-nav');

  function updateMenuButtonIcon(isOpen) {
    if (!menuButton) return;
    const icon = menuButton.querySelector('i');
    if (icon) {
      if (isOpen) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        menuButton.setAttribute('aria-label', 'Close menu');
        menuButton.setAttribute('aria-expanded', 'true');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        menuButton.setAttribute('aria-label', 'Open menu');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    }
  }

  function openMenu() {
    if (mobileMenu) {
      mobileMenu.classList.add('active');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateMenuButtonIcon(true);
  }

  function closeMenuFunc() {
    if (mobileMenu) {
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    updateMenuButtonIcon(false);
  }

  function toggleMenu() {
    if (mobileMenu && mobileMenu.classList.contains('active')) {
      closeMenuFunc();
    } else {
      openMenu();
    }
  }

  if (menuButton) {
    menuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenuFunc);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenuFunc);
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
      closeMenuFunc();
      if (menuButton) menuButton.focus();
    }
  });

  // Close when window resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileMenu && mobileMenu.classList.contains('active')) {
      closeMenuFunc();
    }
  }, { passive: true });

  // Dynamic Navbar Elevation on Scroll
  let lastScrollY = window.scrollY;
  const handleScroll = () => {
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    lastScrollY = window.scrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initialize on load

  // Smooth Scrolling for Internal Anchor Links
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href === '#main-content') return;

      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      const targetHash = href.substring(hashIndex);
      const targetPath = href.substring(0, hashIndex);

      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      const isCurrentPage = !targetPath || targetPath === currentPath || (currentPath === 'index.html' && targetPath === '');

      if (isCurrentPage) {
        const target = document.querySelector(targetHash);
        if (target) {
          e.preventDefault();
          closeMenuFunc();

          setTimeout(() => {
            const headerOffset = 85;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 30);

          if (history.pushState) {
            history.pushState(null, null, targetHash);
          }
        }
      }
    });
  });

  // Scroll-Spy for Landing Page Sections
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.glass-nav .nav-link-pill');
  const mobileNavLinks = document.querySelectorAll('#mobile-menu .mobile-nav-link');

  if (sections.length > 0 && desktopNavLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          
          const updateLinks = (links) => {
            links.forEach(link => {
              const href = link.getAttribute('href') || '';
              const isMatch = href === `#${currentId}` || href === `index.html#${currentId}` || href.endsWith(`#${currentId}`);
              if (isMatch) {
                link.classList.add('active');
              } else if (href.includes('#') && (href.includes('Home') || href.includes('About') || href.includes('Contact'))) {
                link.classList.remove('active');
              }
            });
          };

          updateLinks(desktopNavLinks);
          updateLinks(mobileNavLinks);
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // Intersection Observer for Smooth Scroll Reveal
  const revealElements = document.querySelectorAll('.reveal, .fade-in');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => {
      el.classList.add('revealed');
      el.classList.add('show');
    });
  }

  // Accessible Lightbox Modal for Photography
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const photoCards = Array.from(document.querySelectorAll('.photo-card'));

  let currentPhotoIndex = 0;
  let lastActiveTrigger = null;

  function showPhoto(index) {
    if (photoCards.length === 0) return;
    if (index < 0) index = photoCards.length - 1;
    if (index >= photoCards.length) index = 0;
    currentPhotoIndex = index;

    const card = photoCards[currentPhotoIndex];
    const img = card.querySelector('img');
    const caption = card.querySelector('.photo-title');

    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Photography shot';
    }
    if (lightboxCaption && caption) {
      lightboxCaption.textContent = caption.textContent;
    }
  }

  function openLightbox(index, triggerElement) {
    if (!lightbox) return;
    lastActiveTrigger = triggerElement || null;
    showPhoto(index);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightboxFunc() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveTrigger) {
      lastActiveTrigger.focus();
    }
  }

  if (photoCards.length > 0) {
    photoCards.forEach((card, index) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View photo ${index + 1}`);

      card.addEventListener('click', () => {
        openLightbox(index, card);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index, card);
        }
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightboxFunc);
    
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPhoto(currentPhotoIndex - 1);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showPhoto(currentPhotoIndex + 1);
      });
    }

    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeLightboxFunc();
        }
      });
    }

    // Touch Swipe Gesture for Lightbox on Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightbox) {
      lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance < 0) {
          showPhoto(currentPhotoIndex + 1); // Swipe left -> next
        } else {
          showPhoto(currentPhotoIndex - 1); // Swipe right -> prev
        }
      }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox || !lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightboxFunc();
      if (e.key === 'ArrowLeft') showPhoto(currentPhotoIndex - 1);
      if (e.key === 'ArrowRight') showPhoto(currentPhotoIndex + 1);
    });
  }

  // Interactive Cursor Highlight on Glass Cards
  const glassCards = document.querySelectorAll('.glass-card, .tech-tile');
  glassCards.forEach(card => {
    let rafId = null;
    card.addEventListener('mousemove', (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    }, { passive: true });
  });
});
