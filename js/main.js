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

      clearMenu(mainMenu);
      const resp = fetchBuildings();
      renderBuildingsList(mainMenu, resp);
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

function clearMenu(node) {
  node.innerHTML = '';
}

function fetchBuildings() {
  return false;
}

function renderBuildingsList(node, list) {
  const ul = document.createElement("ul");
  if (list) {

  }

  const building_add = document.createElement("li");
  building_add.innerHTML = `
  <div class="has-only-btn">
    <button class="btn btn-primary btn-add" type="button" name="add-building">Add building</button>
  </div>
  `;

  building_add.querySelector(".btn-add").onclick = () => {
    building_add.style.display = "none";
    const li_temp = document.createElement("li");
    li_temp.innerHTML = `
    <div class="new-element">
      <form action="./api/api.php" method="post">
        <div class="input-block">
          <input type="text" name="new-element-name" value="" placeholder="Building name" required>
        </div>
        <div class="input-block add-img">
          <label for="file" class="btn btn-primary">Add a picture</label>
          <input style="display:none" id="file" type="file" name="file" value="">
          <div class="image">
            <img src="#" alt="building image" style="display:none"/>
          </div>
        </div>
        <div class="input-block">
          <button class="btn btn-primary" type="submit" name="add-building">Add</button>
          <button class="btn btn-primary" type="button" name="cancel">Cancel</button>
        </div>
      </form>
    </div>
    `;

    const img_preview = li_temp.querySelector(".add-img img")
    const name = li_temp.querySelector(`input[name="new-element-name"]`);
    const fileInp = li_temp.querySelector(`input[name="file"]`);
    const submit = li_temp.querySelector(`button[name="add-building"]`);
    const cancel = li_temp.querySelector(`button[name="cancel"]`);

    fileInp.onchange = () => {
      if (fileInp.files && fileInp.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          img_preview.setAttribute("src", e.target.result)
          img_preview.style.display = "block";
        }

        reader.readAsDataURL(fileInp.files[0]);
      }
    }

    cancel.onclick = () => {
      ul.removeChild(li_temp);
      building_add.style.display = "block";
    }

    submit.onclick = (e) => {
      e.preventDefault();
      const img = fileInp.files[0];
      const fData = new FormData();
      fData.append("image-building", img);
      fData.append("add-building", true);
      fData.append("name", name.value);
      $.ajax({
        url: apiPATH,
        dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
        data: fData,
        type: 'post',
        success: function (data) {
          console.log(data);
          const parsed = JSON.parse(data);
          if (parsed['status'] === "success") {
            ul.removeChild(li_temp);

            const addedBuilding = document.createElement("li");
            addedBuilding.innerHTML = `
            <div class="main-menu-elem">
              <div class="building">
                <div class="building-image">
                  <img src="./api/${parsed['building']['imageURL']}" alt="building">
                </div>
                <span class="building-name">${parsed['building']['building']}</span>
              </div>
              <button class="btn btn-primary" type="button" name="delete-building">Delete</button>
            </div>
            `;

            const delBuilding = addedBuilding.querySelector(`button[name="delete-building"]`);
            delBuilding.onclick = () => {
              // TODO
            }

            building_add.style.display = "block";
            ul.insertBefore(addedBuilding, building_add);
          } else {
            alert(parsed['message']);
          }
        },
        error: function (data) {
          console.log(data);
        }
      });
    }

    //continue

    ul.appendChild(li_temp);
  }

  ul.appendChild(building_add);

  node.appendChild(ul);

}

function createBuilding(name) {

}
