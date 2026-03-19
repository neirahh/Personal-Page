// ===== SMOOTH SCROLL =====
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  function smoothScrollTo(targetY, duration) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;
  
    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);
  
      window.scrollTo(0, startY + distance * ease);
  
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
  
    requestAnimationFrame(step);
  }
  
  document.querySelectorAll('.navbar nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;
  
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const targetY = targetSection.getBoundingClientRect().top + window.scrollY - navbarHeight;
  
      smoothScrollTo(targetY, 1111);
    });
  });
  
  
// ===== INTERSECTION OBSERVER =====
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.experience-card').forEach(card => observer.observe(card));
  document.querySelectorAll('.skill-pill').forEach(pill => observer.observe(pill));
  
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) observer.observe(contactForm);
  
  
// ===== FORMSPREE CONTACT FORM =====
  const FORMSPREE_ENDPOINT = '';
  
  const form = document.querySelector('.contact-form');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
  
      btn.disabled = true;
      btn.textContent = 'Sending…';
  
      const data = new FormData(form);
  
      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
  
        if (response.ok) {
            showFormResult(form, 'Thank you for your inquiry. I will get back to you soon.', 'success');
          } else {
            const json = await response.json();
            const errorMsg = json?.errors?.map(e => e.message).join(', ') || 'Something went wrong.';
            showFormResult(form, errorMsg, 'error');
          }
        } catch (err) {
          console.error('Formspree error:', err);
          showFormResult(form, 'Network error. Please try again.', 'error');
        } finally {
          btn.disabled = false;
          btn.textContent = originalText;
        }
    });
  }
  
  function showFormResult(form, message, type) {
    const isSuccess = type === 'success';
   
    const successIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r="26" fill="#4caf50"/>
        <path d="M14 27l9 9 16-18" stroke="white" stroke-width="3.5"
              stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>`;
   
    const errorIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r="26" fill="#e53935"/>
        <path d="M16 16l20 20M36 16L16 36" stroke="white" stroke-width="3.5"
              stroke-linecap="round" fill="none"/>
      </svg>`;
   
    form.innerHTML = `
      <div class="form-result">
        <p class="form-result-text">${message}</p>
        ${isSuccess ? successIcon : errorIcon}
      </div>`;
  }