async function loadPartials() {
  const navbarContainer = document.getElementById('navbar-container');
  const footerContainer = document.getElementById('footer-container');


  if (navbarContainer) {
    const res = await fetch('../HTML/navbar.html');

    if (res.ok) {
      navbarContainer.innerHTML = await res.text();

      
      if (typeof initSessionUI === 'function') {
        initSessionUI();
      }

    } else {
      console.error('No se encontró navbar.html', res);
    }
  }

  if (footerContainer) {
    const res = await fetch('../HTML/footer.html');

    if (res.ok) {
      footerContainer.innerHTML = await res.text();
    } else {
      console.error('No se encontró footer.html', res);
    }
  }
}


document.addEventListener('DOMContentLoaded', loadPartials);


window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }
});

