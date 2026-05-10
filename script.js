const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".main-nav a");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const year = document.getElementById("year");

if (year) year.textContent = new Date().getFullYear();

if (menuBtn && mainNav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0.1,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const eyebrowText = document.querySelector('.eyebrow-text');
const eyebrowWrapper = document.querySelector('.eyebrow');
if (eyebrowText && eyebrowWrapper) {
  const fullText = eyebrowText.dataset.text || '';
  const typingSpeed = 120;
  const pauseAfterComplete = 0;

  function animateEyebrow() {
    eyebrowText.textContent = '';
    let index = 0;

    const typing = setInterval(() => {
      eyebrowText.textContent += fullText[index] || '';
      index += 1;

      if (index > fullText.length) {
        clearInterval(typing);
        setTimeout(animateEyebrow, pauseAfterComplete);
      }
    }, typingSpeed);
  }

  animateEyebrow();
}

const contactForm = document.querySelector('.message-form');
const formStatus = document.querySelector('.form-status');
if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.classList.remove('success', 'error');

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          Accept: 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok && result.success) {
        formStatus.textContent = 'Thank you! Your message has been sent.';
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        throw new Error(result.error || result.message || 'Unable to send message.');
      }
    } catch (error) {
      formStatus.textContent = 'Oops — something went wrong. Please try again.';
      formStatus.classList.add('error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
  });
}


