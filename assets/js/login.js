// noinspection JSUnresolvedVariable

async function login(username, password, totp = "") {
  if (totp === "") {
    totp = null;
  }
  let req = await fetch("https://api.uploadr.cloud/api/v1/session/create", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
      totp_verification: totp,
    }),
  });

  if (!req.ok) {
    return req;
  } else {
    return req;
  }
}

async function validateLogin() {
  let form = document.forms["loginForm"];
  login(
    form["username"].value,
    form["password"].value,
    form["totpInput"].value
  ).then((req) => {
    req.json().then((data) => {
      if (!req.ok) {
        let errorMsg = $("#formHandler")[0].children[3];
        errorMsg.hidden = false;
        errorMsg.innerText = data.error.description;
        return false;
      } else {
        let errorMsg = $("#formHandler")[0].children[3];
        errorMsg.hidden = true;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("plan", "premium");
      localStorage.setItem("expire_timestamp", data.expire_timestamp);
      localStorage.setItem("user_uuid", data.user_uuid);
      window.location = "/dash.html";
    });
  });
}
