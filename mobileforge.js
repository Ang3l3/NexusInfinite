// Mobile navigation
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? '×' : '☰';
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    });
  });
}

// Horizontal carousel arrow controls
document.querySelectorAll('.carousel-button').forEach(button => {
  button.addEventListener('click', () => {
    const carousel = document.getElementById(button.dataset.target);
    if (!carousel) return;
    const firstCard = carousel.querySelector('.carousel-card');
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 20;
    carousel.scrollBy({ left: Number(button.dataset.direction) * (cardWidth + gap), behavior: 'smooth' });
  });
});

// Device and game description popups
const detailDialog = document.getElementById('detailDialog');
const dialogTitle = document.getElementById('dialogTitle');
const dialogType = document.getElementById('dialogType');
const dialogDescription = document.getElementById('dialogDescription');
const dialogClose = document.getElementById('dialogClose');

document.querySelectorAll('.carousel-card').forEach(card => {
  card.addEventListener('click', () => {
    if (!detailDialog || !dialogTitle || !dialogType || !dialogDescription) return;
    dialogTitle.textContent = card.dataset.title || 'Details';
    dialogType.textContent = card.dataset.type || 'MOBILE FORGE';
    dialogDescription.textContent = card.dataset.description || '';
    if (!detailDialog.open) detailDialog.showModal();
  });
});

if (dialogClose && detailDialog) {
  dialogClose.addEventListener('click', () => detailDialog.close());
  detailDialog.addEventListener('click', event => {
    if (event.target === detailDialog) detailDialog.close();
  });
}

console.log('Nexus Infinite Mobile Forge loaded successfully.');
