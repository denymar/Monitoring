const apiPATH = "./api/api.php";

function checkSession() {
  $.post(apiPATH, {
    "check-session": true
  }, function(data, status) {
    const parsed = JSON.parse(data);
    if (parsed['status'] === 'success') {
      loginModal.classList.remove("modal-show");
      authBlock.style.display = "none";
      userBlock.style.display = "block";
      username.innerHTML = parsed['message'];
    }
  });
}

checkSession();

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
const loginSubmit = document.querySelector(`.modal-login button[name="submit-login"]`);
const loginUsername = document.querySelector(`.modal-login input[name="username"]`);
const loginPass = document.querySelector(`.modal-login input[name="password"]`);
const authBlock = document.querySelector(".auth-block");
const userBlock = document.querySelector(".user-block");
const username = userBlock.querySelector(".username");
const logoutBtn = userBlock.querySelector(`button[name="logout-btn"]`);
const loginError = document.querySelector(".modal-login form .error-msg");

loginSubmit.onclick = (e) => {
  e.preventDefault();
  $.post(apiPATH, {
    "submit-login": true,
    username: loginUsername.value,
    password: loginPass.value
  }, function(data, status) {
    console.log(data);
    const parsed = JSON.parse(data);
    if (parsed['status'] === 'success') {
      loginError.innerHTML = '';
      loginModal.classList.remove("modal-show");
      authBlock.style.display = "none";
      userBlock.style.display = "block";
      username.innerHTML = parsed['message'];
    } else {
      loginError.innerHTML = parsed['message'];
    }
  });
}

logoutBtn.onclick = () => {
  $.post(apiPATH, {
    "logout-pressed": true
  }, function(data, status) {
    console.log(data);
    const parsed = JSON.parse(data);
    if (parsed['status'] === 'success') {
      userBlock.style.display = "none";
      authBlock.style.display = "block";
      username.innerHTML = '';
    }
  });
}

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
const signupSubmit = document.querySelector(`.modal-signup button[name="submit-signup"]`);
const signupUsername = document.querySelector(`.modal-signup input[name="username"]`);
const signupPass = document.querySelector(`.modal-signup input[name="password"]`);
const signupPassR = document.querySelector(`.modal-signup input[name="password-repeat"]`);
const signupError = document.querySelector(".modal-signup form .error-msg");

signupSubmit.onclick = (e) => {
  e.preventDefault();
  if (signupPass.value === signupPassR.value) {
    $.post(apiPATH, {
      "submit-signup": true,
      username: signupUsername.value,
      password: signupPass.value
    }, function(data, status) {
      console.log(data);
      const parsed = JSON.parse(data);
      if (parsed['status'] === "success") {
        signupError.innerHTML = '';
        signupModal.classList.remove("modal-show");
      } else {
        signupError.innerHTML = parsed['message'];
      }
    });
  } else {
    alert("Password repeat error");
  }
}


singupBtn.onclick = () => {
  signupModal.classList.add("modal-show");
}

signupModal.onclick = (e) => {
  if (e.target === signupModal || e.target === signupCloseBtn) {
    signupModal.classList.remove("modal-show");
  }
}
