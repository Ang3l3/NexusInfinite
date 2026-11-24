/* ==========================================
   NEXUS INFINITE — FOCUS PRODUCTIVITY
   Navigation, horizontal carousels and details
========================================== */

// Mobile navigation
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    });
  });
}

// Horizontal carousel arrow controls
// Each button identifies its carousel through data-target.
document.querySelectorAll('.carousel-arrow').forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.target;
    const direction = Number(button.dataset.direction);
    const carousel = document.getElementById(targetId);

    if (!carousel || !Number.isFinite(direction)) return;

    const firstCard = carousel.querySelector(':scope > button');
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const styles = window.getComputedStyle(carousel);
    const gap = parseFloat(styles.columnGap || styles.gap) || 18;

    carousel.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: 'smooth'
    });
  });
});

// Shared details dialog for equipment and software cards
const detailDialog = document.getElementById('detailDialog');
const dialogCategory = document.getElementById('dialogCategory');
const dialogTitle = document.getElementById('dialogTitle');
const dialogDescription = document.getElementById('dialogDescription');
const dialogClose = document.getElementById('dialogClose');

const detailCards = document.querySelectorAll('.info-card, .software-card');

detailCards.forEach((card) => {
  card.addEventListener('click', () => {
    if (!detailDialog || !dialogCategory || !dialogTitle || !dialogDescription) return;

    dialogCategory.textContent = card.dataset.category || 'FOCUS PRODUCTIVITY';
    dialogTitle.textContent = card.dataset.title || 'Workspace detail';
    dialogDescription.textContent = card.dataset.description || 'Ask the front desk for more information.';

    if (!detailDialog.open) {
      detailDialog.showModal();
    }
  });
});

if (dialogClose && detailDialog) {
  dialogClose.addEventListener('click', () => detailDialog.close());

  // Close when the user clicks the dimmed backdrop, not the dialog itself.
  detailDialog.addEventListener('click', (event) => {
    if (event.target === detailDialog) detailDialog.close();
  });
}

console.info('Nexus Infinite Focus Productivity page loaded.');
