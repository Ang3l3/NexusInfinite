
/* =====================================
   1. MOBILE NAVIGATION
===================================== */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {

    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuToggle.textContent = isOpen ? "×" : "☰";

});


/* Close the navigation after selecting a link */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.textContent = "☰";

    });

});


/* =====================================
   2. HORIZONTAL CAROUSEL CONTROLS
===================================== */

document.querySelectorAll(".carousel-button").forEach(button => {

    button.addEventListener("click", () => {

        const targetID = button.dataset.target;
        const direction = Number(button.dataset.direction);

        const carousel = document.getElementById(targetID);

        if (!carousel) return;

        const firstCard = carousel.querySelector(".carousel-card");

        if (!firstCard) return;

        const gap = 20;

        const cardWidth = firstCard.getBoundingClientRect().width;

        carousel.scrollBy({
            left: direction * (cardWidth + gap),
            behavior: "smooth"
        });

    });

});


/* =====================================
   3. DEVICE AND GAME DESCRIPTION POPUP
===================================== */

const detailDialog = document.getElementById("detailDialog");

const dialogTitle = document.getElementById("dialogTitle");
const dialogType = document.getElementById("dialogType");
const dialogDescription = document.getElementById("dialogDescription");

const dialogClose = document.getElementById("dialogClose");


/* Open description when a card is clicked */

document.querySelectorAll(".carousel-card").forEach(card => {

    card.addEventListener("click", () => {

        const title = card.dataset.title;
        const type = card.dataset.type;
        const description = card.dataset.description;

        dialogTitle.textContent = title;
        dialogType.textContent = type;
        dialogDescription.textContent = description;

        detailDialog.showModal();

    });

});


/* Close popup using the X button */

dialogClose.addEventListener("click", () => {

    detailDialog.close();

});


/* Close popup when clicking outside its content */

detailDialog.addEventListener("click", event => {

    if (event.target === detailDialog) {
        detailDialog.close();
    }

});
