const mainMenu = document.querySelector(".main-menu");
const mainMenuToggle = document.querySelector(".main-menu-toggle");

mainMenuToggle.onclick = () => {
  mainMenu.classList.toggle("slide-left");
}
