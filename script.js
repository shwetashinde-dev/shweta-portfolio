const menu=document.querySelector('.menu-toggle');
const mobile=document.querySelector('.mobile-nav');
menu?.addEventListener('click',()=>{const open=mobile.classList.toggle('open');menu.setAttribute('aria-expanded',open);mobile.setAttribute('aria-expanded',open);mobile.setAttribute('aria-hidden',!open);});
document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('open');menu.setAttribute('aria-expanded','false');mobile.setAttribute('aria-hidden','true');}));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting) e.target.classList.add('visible');
  else if(!e.target.classList.contains('keep-visible')) e.target.classList.remove('visible');
}),{threshold:.14,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
// Stage the major section blocks too, so the page feels alive as each chapter enters the viewport.
const stagedSelectors='.section-top,.section-intro,.resume-layout,.resume-grid,.skills-grid,.education-grid,.cert-marquee,.project-stack,.timeline';
document.querySelectorAll(stagedSelectors).forEach(el=>{el.classList.add('reveal');revealObserver.observe(el);});

const counters=document.querySelectorAll('.impact-item[data-target]');
const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting) return;
  const el=entry.target;
  if(el.dataset.ran==='true') return;
  el.dataset.ran='true';
  const number=el.querySelector('strong');
  const target=Number(el.dataset.target||0);
  const suffix=el.dataset.suffix||'';
  const duration=1400;
  const start=performance.now();
  const ease=t=>1-Math.pow(1-t,3);
  const tick=now=>{
    const p=Math.min(1,(now-start)/duration);
    number.textContent=Math.round(target*ease(p))+suffix;
    if(p<1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}),{threshold:.5});
counters.forEach(el=>counterObserver.observe(el));

const timelineObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.timeline-item').forEach(x=>x.classList.remove('active'));e.target.classList.add('active')}}),{threshold:.45});
document.querySelectorAll('.timeline-item').forEach(el=>timelineObserver.observe(el));


// Theme toggle: respect the saved preference; otherwise follow the device setting.
(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;
  const icon = toggle.querySelector('.theme-icon');
  const label = toggle.querySelector('.theme-label');
  const stored = (() => { try { return localStorage.getItem('shweta-theme'); } catch (_) { return null; } })();
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (systemDark ? 'dark' : 'light');
  const applyTheme = theme => {
    root.dataset.theme = theme;
    const lightNext = theme === 'dark';
    toggle.setAttribute('aria-label', `Switch to ${lightNext ? 'light' : 'dark'} mode`);
    toggle.setAttribute('title', `Switch to ${lightNext ? 'light' : 'dark'} mode`);
    if (icon) icon.textContent = lightNext ? '☼' : '☾';
    if (label) label.textContent = lightNext ? 'LIGHT' : 'DARK';
  };
  applyTheme(initial);
  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('shweta-theme', next); } catch (_) {}
  });
})();

// Expandable case studies: keep each control's accessible state in sync.
document.querySelectorAll('.case-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
    const label = button.childNodes[0];
    if (label && label.nodeType === Node.TEXT_NODE) label.textContent = expanded ? 'Explore case study ' : 'Close case study ';
    const symbol = button.querySelector('span');
    if (symbol) symbol.textContent = expanded ? '＋' : '−';
  });
});
