const menu = document.querySelector('.menu-toggle');
const mobile = document.querySelector('.mobile-nav');

menu?.addEventListener('click', () => {
  const open = mobile.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
  mobile.setAttribute('aria-hidden', !open);
});

document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', () => {
  mobile.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  mobile.setAttribute('aria-hidden', 'true');
}));

// Smooth, repeatable reveal: content returns to its hidden state when it leaves the viewport.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal, .reveal-section').forEach(el => revealObserver.observe(el));

// Subtle number count-up each time the impact band enters view.
const counters = document.querySelectorAll('[data-count]');
const countObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const el = entry.target;
    if (entry.isIntersecting) {
      const target = Number(el.dataset.count);
      let n = 0;
      clearInterval(el._timer);
      const step = Math.max(1, Math.ceil(target / 22));
      el._timer = setInterval(() => {
        n = Math.min(target, n + step);
        el.textContent = n + '%';
        if (n >= target) clearInterval(el._timer);
      }, 30);
    } else {
      clearInterval(el._timer);
      el.textContent = '0%';
    }
  });
}, { threshold: 0.8 });

counters.forEach(c => countObs.observe(c));

// Compact resume dropdown in the hero.
const resumeToggle = document.querySelector('.resume-toggle');
const resumeMenu = document.querySelector('.resume-menu');

resumeToggle?.addEventListener('click', () => {
  const open = resumeMenu.classList.toggle('open');
  resumeToggle.setAttribute('aria-expanded', open);
});

document.addEventListener('click', event => {
  if (resumeMenu && !resumeMenu.contains(event.target)) {
    resumeMenu.classList.remove('open');
    resumeToggle?.setAttribute('aria-expanded', 'false');
  }
});
