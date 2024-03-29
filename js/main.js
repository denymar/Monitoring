const apiPATH = "./api/api.php";

const mainContainer = document.querySelector("main .container");
const mainMenu = document.querySelector(".main-menu");
const mainMenuToggle = document.querySelector(".main-menu-toggle");

let sensorUpdater;
let sensorsInScope = [];

mainMenuToggle.onclick = () => {
  mainMenu.classList.toggle("slide-left");
  mainMenuToggle.classList.toggle("slide-left");
}

function checkSession() {
  $.post(apiPATH, {
    "check-session": true
  }, function(data, status) {
    console.log(data);
    const parsed = JSON.parse(data);
    if (parsed['status'] === 'success') {
      loginModal.classList.remove("modal-show");
      authBlock.style.display = "none";
      userBlock.style.display = "block";
      username.innerHTML = parsed['message'];
      clearMenu(mainMenu);
      renderBuildingsList(mainMenu);
      initMessage_selectBuilding(mainContainer, parsed['message']);
    }
  });
}

checkSession();

const logo = document.querySelector(".logo");
logo.onclick = () => {
  location.reload(true);
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
      mainMenu.classList.add("slide-left");
      mainMenuToggle.classList.add("slide-left");
      loginUsername.value = "";
      loginPass.value = "";
      clearMenu(mainMenu);
      renderBuildingsList(mainMenu);
      initMessage_selectBuilding(mainContainer, parsed['message']);
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
      clearMenu(mainMenu);
      initMenu(mainMenu);
      clearInterval(sensorUpdater);
      initMessage_welcome(mainContainer);
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
        signupUsername.value = "";
        signupPass.value = "";
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

const burgerBtn = document.querySelector(".burger-btn");
const closeAuthBlockBtns = document.querySelectorAll(".close-auth-block");

burgerBtn.onclick = () => {
  authBlock.classList.add("slide-out");
  userBlock.classList.add("slide-out");
}

closeAuthBlockBtns.forEach(btn => {
  btn.onclick = () => {
    authBlock.classList.remove("slide-out");
    userBlock.classList.remove("slide-out");
  }
});

signupModal.onclick = (e) => {
  if (e.target === signupModal || e.target === signupCloseBtn) {
    signupModal.classList.remove("modal-show");
  }
}

function clearMenu(node) {
  node.innerHTML = '';
}

function initMenu(node) {
  node.innerHTML = `
  <div class="empty-menu">
    <span>
      Log in to use this menu
    </span>
  </div>
  `;
}

function initMessage_welcome(node) {
  node.innerHTML = `
    <h1>Welcome</h1>
    <p class="welcome-message">Log in to use our service for monitoring buildings</p>
  `;
}

function initMessage_selectBuilding(node, user) {
  node.innerHTML = `
    <h1>Welcome, ${user}</h1>
    <p class="welcome-message">Use side menu to add a new building or to choose an existent one for monitoring</p>
  `;
}

function initMessage_selectFloor(node, building) {
  node.innerHTML = `
    <h1>The chosen building - ${building}</h1>
    <p class="welcome-message">Use side menu to add a new floor or to choose an existent one for monitoring</p>
  `;
}

function renderBuildingsList(node) {
  const ul = document.createElement("ul");

  $.post(apiPATH, {
    "get-buildings": true
  }, function(data, status) {
    console.log(data);
    const parsed = JSON.parse(data);
    if (parsed['buildings']) {
      parsed['buildings'].forEach(b => {
        const li = document.createElement("li");
        li.innerHTML = `
        <div class="main-menu-elem">
        <div class="building">
        <div class="building-image">
        <img src="./api/${b['imageURL']}?${Math.random()}" alt="building">
        </div>
        <span class="building-name">${b['building']}</span>
        </div>
        <button class="btn btn-primary" type="button" name="delete-building">Delete</button>
        </div>
        `;

        const building = li.querySelector(".main-menu-elem");

        building.onclick = (e) => {
          if (e.target !== delBuilding) {
            clearMenu(node);
            renderFloorsList(node, b['building']);
            initMessage_selectFloor(mainContainer, b['building']);
          }
        }

        const delBuilding = li.querySelector(`button[name="delete-building"]`);
        delBuilding.onclick = () => {
          $.post(apiPATH, {
            "delete-building": true,
            "building": b['building']
          }, function(data, status) {
            console.log(data);
            const parsedData = JSON.parse(data);
            if (parsedData['status'] === 'success') {
              ul.removeChild(li);
            } else {
              console.log(data);
            }
          });
        }

        ul.insertBefore(li, building_add);
      });
    }
  })

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
                  <img src="./api/${parsed['building']['imageURL']}?${Math.random()}" alt="building">
                </div>
                <span class="building-name">${parsed['building']['building']}</span>
              </div>
              <button class="btn btn-primary" type="button" name="delete-building">Delete</button>
            </div>
            `;

            const building = addedBuilding.querySelector(".main-menu-elem");

            building.onclick = (e) => {
              if (e.target !== delBuilding) {
                clearMenu(node);
                renderFloorsList(node, parsed['building']['building']);
              }
            }

            const delBuilding = addedBuilding.querySelector(`button[name="delete-building"]`);
            delBuilding.onclick = () => {
              $.post(apiPATH, {
                "delete-building": true,
                "building": parsed['building']['building']
              }, function(data, status) {
                const parsedData = JSON.parse(data);
                if (parsedData['status'] === 'success') {
                  ul.removeChild(addedBuilding);
                } else {
                  console.log(data);
                }
              });
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

function renderFloorsList(node, buildingName) {
  const ul = document.createElement("ul");

  const backElem = document.createElement("li");
  backElem.innerHTML = `
  <div class="has-only-btn">
    <button class="btn btn-back" type="button" name="back">Back</button>
  </div>
  `;

  ul.appendChild(backElem);

  const backBtn = backElem.querySelector(`button[name="back"]`);
  backBtn.onclick = () => {
    sensorsInScope = [];
    clearInterval(sensorUpdater);
    clearMenu(node);
    renderBuildingsList(node);
    initMessage_selectBuilding(mainContainer, document.querySelector(".user-block .username").innerHTML);
  }

  const addFloorElem = document.createElement("li");
  addFloorElem.innerHTML = `
  <div class="has-only-btn">
    <button class="btn btn-primary btn-add" type="button" name="add-floor">Add floor</button>
  </div>
  `;

  $.post(apiPATH, {
    "get-floors": true,
    "building-name": buildingName
  }, function(data, status) {
    console.log(data);
    const parsed = JSON.parse(data);
    if (parsed['floors']) {
      parsed['floors'].forEach(f => {
        const li = document.createElement("li");
        li.innerHTML = `
        <div class="main-menu-elem">
          <div class="floor">
            <div class="floor-image">
              <img src="./api/${f['imageURL']}?${Math.random()}" alt="building">
            </div>
            <span class="floor-name">${f['floor']}</span>
          </div>
          <button class="btn btn-primary" type="button" name="delete-floor">Delete</button>
        </div>
        `;

        const floor = li.querySelector(".main-menu-elem");
        floor.onclick = (e) => {
          if (e.target !== delFloor) {
            if (sensorUpdater) {
              clearInterval(sensorUpdater);
            }
            sensorsInScope = [];
            loadFloor(mainContainer, buildingName, f['floor'], f['imageURL']);
            floors = document.querySelectorAll(".main-menu .main-menu-elem");
            floors.forEach(f => {
              f.classList.remove("selected-floor");
            });
            floor.classList.add("selected-floor");
          }
        }

        const delFloor = li.querySelector(`button[name="delete-floor"]`);
        delFloor.onclick = () => {
          $.post(apiPATH, {
            "delete-floor": true,
            "floor": f['floor'],
            "building": buildingName
          }, function(data, status) {
            const parsedData = JSON.parse(data);
            if (parsedData['status'] === 'success') {
              console.log("TEST LIST: ",floor.classList);
              if (floor.classList.contains("selected-floor")) {
                console.log("TEST BLIA");
                clearInterval(sensorUpdater);
                initMessage_selectFloor(mainContainer, buildingName);
              }

              ul.removeChild(li);
            } else {
              console.log(data);
            }
          });
        }

        ul.insertBefore(li, addFloorElem);
      });
    }
  })

  const addFloorBtn = addFloorElem.querySelector(`button[name="add-floor"]`);
  addFloorBtn.onclick = () => {
    addFloorBtn.style.display = "none";
    const li_temp = document.createElement("li");
    li_temp.innerHTML = `
    <div class="new-element">
      <form action="./api/api.php" method="post">
        <div class="input-block">
          <input type="text" name="new-element-name" value="" placeholder="Floor name" required>
        </div>
        <div class="input-block add-img">
          <label for="file" class="btn btn-primary">Add a scheme</label>
          <input style="display:none" id="file" type="file" name="file" value="">
          <div class="image">
            <img src="#" alt="building image" style="display:none"/>
          </div>
        </div>
        <div class="input-block">
          <button class="btn btn-primary" type="submit" name="add-floor">Add</button>
          <button class="btn btn-primary" type="button" name="cancel">Cancel</button>
        </div>
      </form>
    </div>
    `;

    const img_preview = li_temp.querySelector(".add-img img")
    const name = li_temp.querySelector(`input[name="new-element-name"]`);
    const fileInp = li_temp.querySelector(`input[name="file"]`);
    const submit = li_temp.querySelector(`button[name="add-floor"]`);
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
      addFloorBtn.style.display = "block";
    }

    submit.onclick = (e) => {
      e.preventDefault();
      const img = fileInp.files[0];
      const fData = new FormData();
      fData.append("image-floor", img);
      fData.append("add-floor", true);
      fData.append("building-name", buildingName);
      fData.append("floor-name", name.value);
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
            const floors = ul.querySelectorAll(".main-menu-elem");
            floors.forEach(f => {
              f.classList.remove("selected-floor");
            });
            const addedFloor = document.createElement("li");
            addedFloor.innerHTML = `
            <div class="main-menu-elem selected-floor">
              <div class="floor">
                <div class="floor-image">
                  <img src="./api/${parsed['floor']['imageURL']}?${Math.random()}" alt="floor">
                </div>
                <span class="floor-name">${parsed['floor']['floor']}</span>
              </div>
              <button class="btn btn-primary" type="button" name="delete-floor">Delete</button>
            </div>
            `;

            const floor = addedFloor.querySelector(".main-menu-elem");
            floor.onclick = (e) => {
              if (e.target !== delFloor) {
                if (sensorUpdater) {
                  clearInterval(sensorUpdater);
                }
                const floors = document.querySelectorAll(".main-menu .main-menu-elem");
                floors.forEach(f => {
                  f.classList.remove("selected-floor");
                });
                floor.classList.add("selected-floor");
                sensorsInScope = [];
                loadFloor(mainContainer, buildingName, parsed['floor']['floor'], parsed['floor']['imageURL']);
              }
            }

            const delFloor = addedFloor.querySelector(`button[name="delete-floor"]`);
            delFloor.onclick = () => {
              $.post(apiPATH, {
                "delete-floor": true,
                "floor": parsed['floor']['floor'],
                "building": buildingName
              }, function(data, status) {
                const parsedData = JSON.parse(data);
                if (parsedData['status'] === 'success') {
                  console.log("TEST LIST: ",floor.classList);
                  if (floor.classList.contains("selected-floor")) {
                    console.log("TEST BLIA");
                    clearInterval(sensorUpdater);
                    initMessage_selectFloor(mainContainer, buildingName);
                  }

                  ul.removeChild(addedFloor);
                } else {
                  console.log(data);
                }
              });
            }

            addFloorBtn.style.display = "block";
            ul.insertBefore(addedFloor, addFloorElem);
            sensorsInScope = [];
            clearInterval(sensorUpdater);
            renderFloor(mainContainer, buildingName, parsed['floor']['floor'], parsed['floor']['imageURL']);
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

  ul.appendChild(addFloorElem);

  node.appendChild(ul);
}

function renderFloor(node, building, floor, floorIMG, sensorsArr=null) {
  node.innerHTML = "";
  const floorHolder = document.createElement("div");
  floorHolder.classList.add("floor-holder");
  floorHolder.innerHTML = `
  <div class="floor-image">
    <img src="./api/${floorIMG}?${Math.random()}" alt="floor">
  </div>
  <div class="floor-controls">
    <button class="btn btn-primary" type="button" name="add-sensor">Add sensor</button>
  </div>
  <div class="sensors-list"></div>
  `;

  const floorImgContainer = floorHolder.querySelector(".floor-image");
  const floorControls = floorHolder.querySelector(".floor-controls");
  const s_list = floorHolder.querySelector(".sensors-list");
  const addSensorBtn = floorHolder.querySelector(`button[name="add-sensor"]`);

  if (sensorsArr) {
    sensorsArr.forEach(s => {
      const sensor = document.createElement("div");
      const sensor_li = document.createElement("div");
      sensor.classList.add("sensor");
      sensor_li.classList.add("sensor");

      if (s['status'] === "active") {
        sensor.classList.add("sensor-active");
        sensor_li.classList.add("sensor-active");
      }

      let unit = "";
      if (s['type'] === 'temperature') {
        unit = "&#8451;";
      }
      if (s['type'] === 'pressure') {
        unit = "mm Hg";
      }
      if (s['type'] === 'humidity') {
        unit = "%";
      }

      sensor.innerHTML = sensor_li.innerHTML = `
      <div class="sensor-info">
        <div class="sensor-status">
          <span class="title">Status: </span>
          <span class="value">${s['status']}</span>
        </div>
        <div class="sensor-name">
          <span class="title">Name: </span>
          <span class="value">${s['sensor']}</span>
        </div>
        <div class="sensor-serial-number">
          <span class="title">Serial #: </span>
          <span class="value">${s['SN']}</span>
        </div>
        <div class="sensor-type">
          <span class="title">Type: </span>
          <span class="value">${s['type']}</span>
        </div>
        <div class="sensor-value">
          <span class="title">Value: </span>
          <span class="value">${s['value']}${unit}</span>
        </div>
        <div class="sensor-delete">
          <button class="btn btn-primary" type="button" name="delete-sensor">Delete</button>
        </div>
      </div>
      `;

      const sensorDeleteBtn = sensor.querySelector(".sensor-delete button");
      const sensor_liDeleteBtn = sensor_li.querySelector(".sensor-delete button");
      console.log(sensorDeleteBtn);
      sensorDeleteBtn.onclick = sensor_liDeleteBtn.onclick = () => {
        $.post(apiPATH, {
          "delete-sensor": true,
          "building-name": building,
          "floor-name": floor,
          "sensor": s['sensor'],
          "SN": s['SN']
        }, function(data, status) {
          const parsed = JSON.parse(data);
          if (parsed['status'] === "success") {
            for (let i = 0; i < sensorsInScope.length; i++) {
              if (sensorsInScope[i]['name'] === s['sensor'] && sensorsInScope[i]['sn'] === s['SN']) {
                sensorsInScope.splice(i, 1);
                floorImgContainer.removeChild(sensor);
                s_list.removeChild(sensor_li);

                if (sensorUpdater) {
                  clearInterval(sensorUpdater);
                }

                if (sensorsInScope.length > 0) {
                  const toSend = sensorsInScope.map(s => ({name: s.name, sn: s.sn, type: s.type}));
                  sensorUpdater = setInterval(function() {
                    $.post(apiPATH, {
                      "update-sensors": true,
                      "sensors": toSend
                    }, function(data, status) {
                      console.log(data);
                      const parsed = JSON.parse(data);
                      if (parsed['status'] = 'success') {
                        parsed['sensors'].forEach(s => {
                          const sensorFound = sensorsInScope.find(elem => elem.name === s.name && elem.sn === s.sn);
                          let unit = "";
                          if (s['type'] === 'temperature') {
                            unit = "&#8451;";
                          }
                          if (s['type'] === 'pressure') {
                            unit = "mm Hg";
                          }
                          if (s['type'] === 'humidity') {
                            unit = "%";
                          }

                          if (s['status'] === 'active') {
                            sensorFound.div.classList.add("sensor-active");
                          } else {
                            sensorFound.div.classList.remove("sensor-active");
                          }

                          sensorFound.div.querySelector(".sensor-status .value").innerHTML = s.status;
                          sensorFound.div.querySelector(".sensor-value .value").innerHTML = `${s.value}${unit}`;
                        });
                      } else {
                        console.log(parsed['message']);
                      }
                    });
                  }, 1000)
                }

                break;
              }
            }
          } else {
            console.log(parsed['message']);
          }
        });
      }

      sensor.style.top = `${s['topPercents']}%`;
      sensor.style.left = `${s['leftPercents']}%`;

      const sensorObj = {
        div: sensor,
        li: sensor_li,
        name: s['sensor'],
        sn: s['SN'],
        type: s['type']
      }

      sensorsInScope.push(sensorObj);

      floorImgContainer.appendChild(sensor);
      s_list.appendChild(sensor_li);
    });
  }

  addSensorBtn.onclick = () => {
    const sensor = document.createElement("div");
    const sensor_li = document.createElement("div");
    sensor.classList.add("sensor");
    sensor_li.classList.add("sensor");
    let top = 0;
    let left = 0;
    sensor.style.top = `${top}%`;
    sensor.style.left = `${left}%`;
    floorImgContainer.appendChild(sensor);
    s_list.appendChild(sensor_li);

    addSensorBtn.style.display = "none";

    const sensorAdder = document.createElement("div");
    sensorAdder.classList.add("sensor-adder");
    sensorAdder.innerHTML = `
    <div class="sensor-mover">
      <div class="mover-line">
        <div class="move-btn move-up"></div>
      </div>
      <div class="mover-line">
        <div class="move-btn move-left"></div>
        <div class="circle"></div>
        <div class="move-btn move-right"></div>
      </div>
      <div class="mover-line">
        <div class="move-btn move-down"></div>
      </div>
      <div class="sensor-mover-step">
        Move step: <input type="number" name="step-percents" value="1" placeholder="%"> %
      </div>
    </div>
    <div class="input-block">
      <input type="text" name="new-sensor-name" value="" placeholder="Name">
    </div>
    <div class="input-block">
      <input type="text" name="new-sensor-serial" value="" placeholder="Serial number">
    </div>
    <div class="input-block with-rb-group">
      <div class="rb-group">
        <input id="type-temperature" type="radio" name="new-sensor-type" value="" checked>
        <label for="type-temperature">Temperature</label>
      </div>
      <div class="rb-group">
        <input id="type-pressure" type="radio" name="new-sensor-type" value="">
        <label for="type-pressure">Pressure</label>
      </div>
      <div class="rb-group">
        <input id="type-humidity" type="radio" name="new-sensor-type" value="">
        <label for="type-humidity">Humidity</label>
      </div>
    </div>
    <div class="input-block">
      <button class="btn btn-primary" type="submit" name="add-sensor-submit">Add</button>
      <button class="btn btn-primary" type="button" name="cancel">Cancel</button>
    </div>
    `;

    const step = sensorAdder.querySelector(`input[name="step-percents"]`);
    const moveUpBtn = sensorAdder.querySelector(".move-up");
    const moveLeftBtn = sensorAdder.querySelector(".move-left");
    const moveRightBtn = sensorAdder.querySelector(".move-right");
    const moveDownBtn = sensorAdder.querySelector(".move-down");
    const sensorName = sensorAdder.querySelector(`input[name="new-sensor-name"]`);
    const sensorSN = sensorAdder.querySelector(`input[name="new-sensor-serial"]`);
    const temperatureRb = sensorAdder.querySelector("#type-temperature");
    const pressureRb = sensorAdder.querySelector("#type-pressure");
    const humidityRb = sensorAdder.querySelector("#type-humidity");
    let type;

    moveUpBtn.onclick = () => {
      if (step.value === "") {
        top--;
      } else {
        top -= Number(step.value);
      }
      sensor.style.top = `${top}%`;
    }

    moveLeftBtn.onclick = () => {
      if (step.value === "") {
        left--;
      } else {
        left -= Number(step.value);
      }
      sensor.style.left = `${left}%`;
    }

    moveRightBtn.onclick = () => {
      if (step.value === "") {
        left++;
      } else {
        left += Number(step.value);
      }
      sensor.style.left = `${left}%`;
    }

    moveDownBtn.onclick = () => {
      if (step.value === "") {
        top++;
      } else {
        top += Number(step.value);
      }
      sensor.style.top = `${top}%`;
    }

    const submitAdd = sensorAdder.querySelector(`button[name="add-sensor-submit"]`);
    const cancelAdd = sensorAdder.querySelector(`button[name="cancel"]`);

    submitAdd.onclick = () => {
      if (temperatureRb.checked) {
        type = "temperature";
      }

      if (pressureRb.checked) {
        type = "pressure";
      }

      if (humidityRb.checked) {
        type = "humidity";
      }

      if (sensorName.value !== "" && sensorSN.value !== "") {
        $.post(apiPATH, {
          "add-sensor": true,
          "building-name": building,
          "floor-name": floor,
          "sensor-name": sensorName.value,
          "sensor-sn": sensorSN.value,
          "type": type,
          "top": top,
          "left": left
        }, function(data, status) {
          console.log(data);
          const parsed = JSON.parse(data);
          if (parsed['status'] === 'success') {
            let unit = "";
            if (parsed['sensor']['type'] === 'temperature') {
              unit = "&#8451;";
            }
            if (parsed['sensor']['type'] === 'pressure') {
              unit = "mm Hg";
            }
            if (parsed['sensor']['type'] === 'humidity') {
              unit = "%";
            }

            if (parsed['sensor']['status'] === 'active') {
              sensor.classList.add("sensor-active");
              sensor_li.classList.add("sensor-active");
            }

            const sensorInfo = document.createElement("div");
            const sensorInfo_li = document.createElement("div");
            sensorInfo.classList.add("sensor-info");
            sensorInfo_li.classList.add("sensor-info");
            sensorInfo.innerHTML = sensorInfo_li.innerHTML = `
            <div class="sensor-status">
              <span class="title">Status: </span>
              <span class="value">Active</span>
            </div>
            <div class="sensor-name">
              <span class="title">Name: </span>
              <span class="value">${parsed['sensor']['sensor']}</span>
            </div>
            <div class="sensor-serial-number">
              <span class="title">Serial #: </span>
              <span class="value">${parsed['sensor']['SN']}</span>
            </div>
            <div class="sensor-type">
              <span class="title">Type: </span>
              <span class="value">${parsed['sensor']['type']}</span>
            </div>
            <div class="sensor-value">
              <span class="title">Value: </span>
              <span class="value">${parsed['sensor']['value']}${unit}</span>
            </div>
            <div class="sensor-delete">
              <button class="btn btn-primary" type="button" name="delete-sensor">Delete</button>
            </div>
            `;
            sensor.appendChild(sensorInfo);
            sensor_li.appendChild(sensorInfo_li);

            const sensorDeleteBtn = sensor.querySelector(".sensor-delete button");
            const sensor_liDeleteBtn = sensor_li.querySelector(".sensor-delete button");
            sensorDeleteBtn.onclick = sensor_liDeleteBtn.onclick = () => {
              $.post(apiPATH, {
                "delete-sensor": true,
                "building-name": building,
                "floor-name": floor,
                "sensor": parsed['sensor']['sensor'],
                "SN": parsed['sensor']['SN']
              }, function(data, status) {
                const parsed2 = JSON.parse(data);
                if (parsed2['status'] === "success") {
                  for (let i = 0; i < sensorsInScope.length; i++) {
                    if (sensorsInScope[i]['name'] === parsed['sensor']['sensor'] && sensorsInScope[i]['sn'] === parsed['sensor']['SN']) {
                      sensorsInScope.splice(i, 1);
                      floorImgContainer.removeChild(sensor);
                      s_list.removeChild(sensor_li);
                      if (sensorUpdater) {
                        clearInterval(sensorUpdater);
                      }

                      if (sensorsInScope.length > 0) {
                        const toSend = sensorsInScope.map(s => ({name: s.name, sn: s.sn, type: s.type}));
                        sensorUpdater = setInterval(function() {
                          $.post(apiPATH, {
                            "update-sensors": true,
                            "sensors": toSend
                          }, function(data, status) {
                            console.log(data);
                            const parsed3 = JSON.parse(data);
                            if (parsed3['status'] = 'success') {
                              parsed3['sensors'].forEach(s => {
                                const sensorFound = sensorsInScope.find(elem => elem.name === s.name && elem.sn === s.sn);
                                let unit = "";
                                if (s['type'] === 'temperature') {
                                  unit = "&#8451;";
                                }
                                if (s['type'] === 'pressure') {
                                  unit = "mm Hg";
                                }
                                if (s['type'] === 'humidity') {
                                  unit = "%";
                                }

                                if (s['status'] === 'active') {
                                  sensorFound.div.classList.add("sensor-active");
                                } else {
                                  sensorFound.div.classList.remove("sensor-active");
                                }

                                sensorFound.div.querySelector(".sensor-status .value").innerHTML = s.status;
                                sensorFound.li.querySelector(".sensor-status .value").innerHTML = s.status;
                                sensorFound.div.querySelector(".sensor-value .value").innerHTML = `${s.value}${unit}`;
                                sensorFound.li.querySelector(".sensor-value .value").innerHTML = `${s.value}${unit}`;
                              });
                            } else {
                              console.log(parsed3['message']);
                            }
                          });
                        }, 1000)
                      }

                      break;
                    }
                  }
                } else {
                  console.log(parsed2['message']);
                }
              });
            }

            const sensorObj = {
              div: sensor,
              li: sensor_li,
              name: parsed['sensor']['sensor'],
              sn: parsed['sensor']['SN'],
              type: parsed['sensor']['type']
            }

            sensorsInScope.push(sensorObj);

            // BREAKPOINT
            // sensorsInScope = [];
            clearInterval(sensorUpdater);
            // if (sensorsInScope.length > 0) {
            const toSend = sensorsInScope.map(s => ({name: s.name, sn: s.sn, type: s.type}));
            sensorUpdater = setInterval(function() {
              $.post(apiPATH, {
                "update-sensors": true,
                "sensors": toSend
              }, function(data, status) {
                console.log(data);
                const parsed2 = JSON.parse(data);
                if (parsed2['status'] === 'success') {
                  parsed2['sensors'].forEach(s => {
                    const sensorFound = sensorsInScope.find(elem => elem.name === s.name && elem.sn === s.sn);
                    let unit = "";
                    if (s['type'] === 'temperature') {
                      unit = "&#8451;";
                    }
                    if (s['type'] === 'pressure') {
                      unit = "mm Hg";
                    }
                    if (s['type'] === 'humidity') {
                      unit = "%";
                    }

                    if (s['status'] === 'active') {
                      sensorFound.div.classList.add("sensor-active");
                    } else {
                      sensorFound.div.classList.remove("sensor-active");
                    }

                    sensorFound.div.querySelector(".sensor-status .value").innerHTML = s.status;
                    sensorFound.li.querySelector(".sensor-status .value").innerHTML = s.status;
                    sensorFound.div.querySelector(".sensor-value .value").innerHTML = `${s.value}${unit}`;
                    sensorFound.li.querySelector(".sensor-value .value").innerHTML = `${s.value}${unit}`;
                  });
                } else {
                  console.log(parsed2['message']);
                }
              });
            }, 1000)
            // }

            floorControls.removeChild(sensorAdder);
            addSensorBtn.style.display = "inline";
          } else {
            console.log(parsed['message']);
          }
        });
      }
    }

    cancelAdd.onclick = () => {
      floorImgContainer.removeChild(sensor);
      s_list.removeChild(sensor_li)
      floorControls.removeChild(sensorAdder);
      addSensorBtn.style.display = "inline";
    }

    floorControls.appendChild(sensorAdder);
  }

  if (sensorsInScope.length > 0) {
    const toSend = sensorsInScope.map(s => ({name: s.name, sn: s.sn, type: s.type}));
    sensorUpdater = setInterval(function() {
      $.post(apiPATH, {
        "update-sensors": true,
        "sensors": toSend
      }, function(data, status) {
        console.log(data);
        const parsed = JSON.parse(data);
        if (parsed['status'] = 'success') {
          parsed['sensors'].forEach(s => {
            const sensorFound = sensorsInScope.find(elem => elem.name === s.name && elem.sn === s.sn);
            if (sensorFound) {
              let unit = "";
              if (s['type'] === 'temperature') {
                unit = "&#8451;";
              }
              if (s['type'] === 'pressure') {
                unit = "mm Hg";
              }
              if (s['type'] === 'humidity') {
                unit = "%";
              }

              if (s['status'] === 'active') {
                sensorFound.div.classList.add("sensor-active");
              } else {
                sensorFound.div.classList.remove("sensor-active");
              }

              sensorFound.div.querySelector(".sensor-status .value").innerHTML = s.status;
              sensorFound.li.querySelector(".sensor-status .value").innerHTML = s.status;
              sensorFound.div.querySelector(".sensor-value .value").innerHTML = `${s.value}${unit}`;
              sensorFound.li.querySelector(".sensor-value .value").innerHTML = `${s.value}${unit}`;
            }
          });
        } else {
          console.log(parsed['message']);
        }
      });
    }, 1000)
  }

  node.appendChild(floorHolder);
}

function loadFloor(node, building, floor, imageURL) {
  $.post(apiPATH, {
    "load-floor": true,
    "building": building,
    "floor": floor
  }, function(data, status) {
    console.log(data);
    const parsed = JSON.parse(data);
    if (parsed['status'] === 'success') {
      renderFloor(node, building, floor, imageURL, parsed['sensors']);
    } else {
      renderFloor(node, building, floor, imageURL);
      console.log(parsed['message']);
    }
  });
}
