
let loginEmail;
let loginName;
/*** profile load */
function loadProfile() {
  if (sessionStorage.getItem("_auth_")) {
    loginName = JSON.parse(sessionStorage.getItem("_auth_"))['name'];
    loginEmail = JSON.parse(sessionStorage.getItem("_auth_"))['email'];
    let profile_pic = document.querySelector(".profile_pic");
    profile_pic.innerText = loginName[0].toUpperCase();
  }


  /**** post load *****/
  if (localStorage.getItem("posts")) {
    let obj = JSON.parse(localStorage.getItem("posts"));
    let post_main = document.querySelector(".post_main");
    obj.forEach((element) => {
      let post_div = `<div class="post_div">
        <img src="${element['image']}" class="post_image" />
        <h3 class="post_title">${element['title']}</h3>
        <hr width="100" />
        <div class="post_action">
            <div class="icon_box">
                <i class="fa fa-thumbs-o-up"></i>
                <i class="fa fa-thumbs-o-down"></i>
            </div>
            <div class="post_box">
                <div class="post_profile">${element['name'][0].toUpperCase()}</div>
                <p class="post_name">${element['name']}</p>
            </div>
    
        </div>
    </div>`;
      post_main.innerHTML += post_div;


    })
  }
}
loadProfile();






/* popup control * */
function popupControl(data = "") {
  let popupMain = document.querySelector(".popup_main");
  let popup = document.querySelector(".popup");
  popupMain.style.display = "block";
  popup.style.display = "block";
  popup.innerHTML = data;

  /** popup close */
  popupMain.onclick = function (e) {
    if (e.target.className == "popup_main") {
      popup.innerHTML = "";
      popupMain.style.display = "none";
      popup.style.display = "none";
    }
  };
}

/** register button click */
let registerBtn = document.querySelector(".register_btn");
registerBtn.onclick = function () {
  popupControl(`
    <div class="mainDiv">
    <form class="signup_form">
        <h2 class="text-center padding-15 mb20">Registration</h2>
        <input type="text" name="name" placeholder="Enter your Name"> <br/>
        <input type="email" name="email" placeholder="Enter your Email"> <br/>
        <input type="text" name="phone" placeholder="Enter your phone"> <br/>
        <input type="password" name="password" placeholder="Enter your password"> <br/>
        <input type="submit" value="Submit" class="btn btn-primary"> <br/>
    </form>
</div>
          
    `);
  signup();
};

/** login button click */
let loginBtn = document.querySelector(".login_btn");
loginBtn.onclick = function () {
  popupControl(`
    <div class="mainDiv">
    <form class="login_form">
        <h2 class="text-center padding-15 mb20">Login</h2>
        <input type="text" name="email" placeholder="Enter your Email"> <br/>
        <input type="password" name="password" placeholder="Enter your password"> <br/>
        <p class="login_alert"></p>
        <input type="submit" value="Submit" class="btn btn-primary"> <br/>

    </form>
</div>  
          
    `);
  login();
};





/** post upload */
let photo = document.querySelector(".uploadPhoto");
photo.onchange = function () {
  let obj = {};
  let file = photo.files[0];
  let reader = new FileReader();
  let local_photo = reader.readAsDataURL(file);

  let file_btn_div = document.querySelector(".uploadPhotoDiv");
  let upload_btn = document.querySelector(".upload-photo-btn");
  file_btn_div.style.display = "none";
  upload_btn.style.display = "block";
  reader.onload = function () {
    let picture = document.querySelector(".search_image");
    picture.src = reader.result;
    obj['image'] = reader.result; 
  };

  /** post click */
  let uploadForm = document.querySelector(".create-post");
  uploadForm.onsubmit = function (e) {
    e.preventDefault();
    let title = document.querySelector("#create-post");
    let post_main = document.querySelector(".post_main");
    obj['title'] = title.value;
    obj['name'] = loginName;
    obj['email'] = loginEmail;
    obj['date'] = new Date().toLocaleDateString();
    obj['time'] = new Date().toLocaleTimeString();
    let post_div = `<div class="post_div">
    <img src="${obj['image']}" class="post_image" />
    <h3 class="post_title">${title.value}</h3>
    <hr width="100" />
    <div class="post_action">
        <div class="icon_box">
            <i class="fa fa-thumbs-o-up"></i>
            <i class="fa fa-thumbs-o-down"></i>
        </div>
        <div class="post_box">
            <div class="post_profile">${loginName[0].toUpperCase()}</div>
            <p class="post_name">${loginName}</p>
        </div>

    </div>
</div>`;

    /** post save */
    if (localStorage.getItem("posts")) {
      let arr = JSON.parse(localStorage.getItem("posts"));
      arr.push(obj);
      localStorage.setItem("posts", JSON.stringify(arr));
    }
    else {
      localStorage.setItem("posts", JSON.stringify([obj]));
    }

    post_main.innerHTML += post_div;
    file_btn_div.style.display = "block";
    upload_btn.style.display = "none";
  }

  console.log(obj);

};





// signup
function signup() {
  let signupForm = document.querySelector(".signup_form");
  signupForm.onsubmit = function (e) {
    e.preventDefault();
    // console.log(e.target[0].value);
    let userInfo = {};
    for (let index = 0; index < e.target.length - 1; index++) {
      userInfo[e.target[index].name] = e.target[index].value;
    }
    if (localStorage.getItem("userInfo")) {
      let dataFind = JSON.parse(localStorage.getItem("userInfo"));
      dataFind.push(userInfo);
      localStorage.setItem("userInfo", JSON.stringify(dataFind));
    }
    else {
      localStorage.setItem("userInfo", JSON.stringify([userInfo]));
    }
  };
}

// login

function login() {
  let loginForm = document.querySelector(".login_form");
  let notify = document.querySelector(".login_alert");
  let name = "";
  loginForm.onsubmit = function (e) {
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value;
    // console.log(email,password);

    let database = JSON.parse(localStorage.getItem("userInfo"));
    let user_obj = { check: false };
    database.forEach((element) => {
      if (element.email == email) {
        user_obj["check"] = true;
        user_obj["password"] = element.password;
        user_obj["name"] = element.name;
        name = user_obj["name"];
      }
    });
    /** user found or not */
    if (user_obj["check"]) {
      /**password check  */
      if (password == user_obj["password"]) {
        /** password match and login success */
        /** session is created */
        location.reload();
        sessionStorage.setItem(
          "_auth_",
          JSON.stringify({ name: user_obj["name"], email: email })
        );
        /** password match */
        // location.replace("./public/dashboard.html");
      }
      else {
        /** password not match */
        notify.textContent = "password not match !";
        notify.className = "login_alert red";
        removeAlert(notify);
      }
    } else {
      notify.textContent = "user not found !";
      notify.className = "login_alert red";
      removeAlert(notify);
    }
  };
  /** remove alert */
  function removeAlert(data) {
    setTimeout(function () {
      data.innerHTML = "";
    }, 2000);
  }
}

