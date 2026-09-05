const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const dialog = document.querySelector('[data-safety-dialog]');
const progress = document.querySelector('[data-scroll-progress]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const contractAddress = document.querySelector('[data-contract-address]');
const contractCopyButton = document.querySelector('[data-contract-copy]');

if (contractAddress && contractCopyButton) {
  contractCopyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(contractAddress.textContent.trim());
      contractCopyButton.textContent = 'COPIED';
      setTimeout(() => { contractCopyButton.textContent = 'COPY'; }, 1600);
    } catch {
      contractCopyButton.textContent = 'COPY FAILED';
      setTimeout(() => { contractCopyButton.textContent = 'COPY'; }, 1600);
    }
  });
}

const setMenu = (open) => {
  mobileMenu.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  if (open) mobileMenu.style.top = `${Math.max(0, header.getBoundingClientRect().bottom)}px`;
};

menuButton.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

document.querySelectorAll('[data-safety-open]').forEach((button) => {
  button.addEventListener('click', () => {
    setMenu(false);
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});

document.querySelector('[data-safety-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate([
          { opacity: 0.25, transform: 'translateY(14px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 560, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -25px' });

  reveals.forEach((element) => {
    if (element.getBoundingClientRect().top > window.innerHeight * 0.9) observer.observe(element);
  });
}

let scrollFrame;
const updateScroll = () => {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = available > 0 ? window.scrollY / available : 0;
  progress.style.transform = `scaleX(${ratio})`;
  header.classList.toggle('scrolled', window.scrollY > 40);
  scrollFrame = null;
};

window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
}, { passive: true });
updateScroll();
