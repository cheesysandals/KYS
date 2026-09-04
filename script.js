const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const dialog = document.querySelector('[data-safety-dialog]');
const progress = document.querySelector('[data-scroll-progress]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const contractAddress = document.querySelector('[data-contract-address]');
const contractCopy = document.querySelector('[data-contract-copy]');
const contractCopyLabel = document.querySelector('[data-contract-copy-label]');
const contractCopyStatus = document.querySelector('[data-contract-copy-status]');
let copyResetTimer;

const copyContractAddress = async () => {
  const address = contractAddress.textContent.trim();
  let copied = false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(address);
      copied = true;
    }
  } catch {
    copied = false;
  }

  if (!copied) {
    const textarea = document.createElement('textarea');
    try {
      textarea.value = address;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    } finally {
      textarea.remove();
    }
  }

  clearTimeout(copyResetTimer);
  contractCopyLabel.textContent = copied ? 'COPIED' : 'RETRY';
  contractCopy.classList.toggle('copied', copied);
  contractCopyStatus.textContent = copied ? 'Contract address copied.' : 'The contract address could not be copied.';
  copyResetTimer = setTimeout(() => {
    contractCopyLabel.textContent = 'COPY';
    contractCopy.classList.remove('copied');
    contractCopyStatus.textContent = '';
  }, 1800);
};

contractCopy.addEventListener('click', copyContractAddress);

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
