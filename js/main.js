const apiPATH = "../api/api.php";

const logo = document.querySelector(".logo");
logo.onclick = () => {
  location.reload(true);
}

const mainMenu = document.querySelector(".main-menu");
const mainMenuToggle = document.querySelector(".main-menu-toggle");

mainMenuToggle.onclick = () => {
  mainMenu.classList.toggle("slide-left");
  mainMenuToggle.classList.toggle("slide-left");
}

const loginModal = document.querySelector(".modal-login");
const loginBtn = document.querySelector(`.auth-block button[name="login-btn"]`);
const loginCloseBtn = document.querySelector(".modal-login .close-modal");

loginBtn.onclick = () => {
  loginModal.classList.add("modal-show");
}

loginModal.onclick = (e) => {
  if (e.target === loginModal || e.target === loginCloseBtn) {
    loginModal.classList.remove("modal-show");
  }
}

const signupModal = document.querySelector(".modal-signup");
const singupBtn = document.querySelector(`.auth-block button[name="signup-btn"]`);
const signupCloseBtn = document.querySelector(".modal-signup .close-modal");

singupBtn.onclick = () => {
  signupModal.classList.add("modal-show");
}

signupModal.onclick = (e) => {
  if (e.target === signupModal || e.target === signupCloseBtn) {
    signupModal.classList.remove("modal-show");
  }
}
