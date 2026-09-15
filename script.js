document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menu-button');
  const closeMenu = document.getElementById('close-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
    menuButton.setAttribute('aria-expanded', 'true');
  }

  function closeMenuFunc() {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
  }

  menuButton.addEventListener('click', openMenu);
  closeMenu.addEventListener('click', closeMenuFunc);
  overlay.addEventListener('click', closeMenuFunc);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenuFunc();
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});


const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    } else {
      entry.target.classList.remove('show');
    }
  });
}, {
  threshold: 0.2
});

fadeElements.forEach((el) => observer.observe(el));