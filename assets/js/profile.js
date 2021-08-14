// noinspection JSUnresolvedVariable

async function getUserData() {
  let headers = {
    Authorization: localStorage.getItem("token"),
  };
  let req = await fetch("https://api.uploadr.club/api/v1/user/data", {
    headers: headers,
  });
  return req.json();
}

async function getDomains() {
  let headers = {
    Authorization: localStorage.getItem("token"),
  };
  let req = await fetch("https://api.uploadr.club/api/v1/domains", {
    headers: headers,
  });
  return req.json();
}

function loadData() {
  getUserData().then((data) => {
    let subdomain = $("#subdomain")[0];
    subdomain.placeholder = data.user.subdomain;
    subdomain.value = data.user.subdomain;
    let anc = $("#authorName")[0];
    anc.placeholder = data.user.username;
    $("#webhook_url")[0].value = data.user.webhook_url;
    $("#embedTitle")[0].value = data.embed.title;
    $("#embedColor")[0].value = `#${data.embed.color}`;
    $("#embedDescription")[0].value = data.embed.description;
    $("#embedProviderName")[0].value = data.embed.provider_name;
    $("#embedProviderURL")[0].value = data.embed.provider_url;
    anc.value = data.embed.author_name;
    $("#authorURL")[0].value = data.embed.author_url;

    let filenameGroup = $("#filename")[0];

    let applicableItems = {
      zwc: "Invisible URL",
      id: "Normal URL",
      short_8: "8 Character Short URL",
      short_10: "10 Character Short URL",
      emoji: "Emoji URL",
    };

    for (let item in applicableItems) {
      let node = document.createElement("option");
      node.selected = data.user.generator === item;
      node.innerText = applicableItems[item];
      node.value = item;
      filenameGroup.appendChild(node);
    }

    let userdata = data.user;
    getDomains().then((data) => {
      let publicDomainOptGroup = $("#publicDomainOptGroup")[0];
      let privateDomainGroup = $("#privateDomainOptGroup")[0];
      for (let key in data) {
        let node = document.createElement("option");
        node.selected = userdata.domain === key;
        node.value = key;
        node.innerText = key;
        if (data.hasOwnProperty(key)) {
          // should always be true as key is from data
          if (data[key]["private"]) {
            privateDomainGroup.hidden = false;
            privateDomainGroup.appendChild(node);
          } else {
            publicDomainOptGroup.appendChild(node);
          }
        }
      }
    });
    $("#sxcu_button")[0].onclick = () => {
      window.open(
        `https://api.uploadr.club/api/v1/download/sxcu?api_key=${data.user.api_token}&embed=no`
      );
    };
  });
}

async function saveUserSettingsFetch(subdomain, domain, generator) {
  let headers = {
    Authorization: localStorage.getItem("token"),
  };
  let req = await fetch("https://api.uploadr.club/api/v1/user/set_domain", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      domain: domain,
      subdomain: subdomain,
      generator: generator,
    }),
  });

  return req.json();
}

function saveUserSettings() {
  let form = document.forms["userSettings"];
  saveUserSettingsFetch(
    form.subdomain.value,
    form.domain.value,
    form.filename.value
  ).then((data) => {
    if (data.success) {
      let success = $("#successMsgLoc")[0];
      success.innerText = "Successfully set User Settings";
      success.hidden = false;
      $("#errorMsgLoc")[0].hidden = true;
      $("#scroll-to-top")[0].click();
    } else {
      let failure = $("#errorMsgLoc")[0];
      failure.innerText = "Failed to save User Settings";
      failure.hidden = false;
      $("#successMsgLoc")[0].hidden = true;
      $("#scroll-to-top")[0].click();
    }
  });
}

// noinspection SpellCheckingInspection
async function saveDiscordSettingsFetch(
  webhook_url,
  embedTitle,
  authorName,
  authorURL,
  provName,
  provURL,
  desc,
  ecolor
) {
  let headers = {
    Authorization: localStorage.getItem("token"),
  };
  // noinspection SpellCheckingInspection
  let req = await fetch(
    "https://api.uploadr.club/api/v1/user/discord_settings",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        webhook_url: webhook_url,
        embedTitle: embedTitle,
        authorName: authorName,
        authorURL: authorURL,
        provName: provName,
        provURL: provURL,
        desc: desc,
        ecolor: ecolor,
      }),
    }
  );

  return req.json();
}

function saveDiscordSettings() {
  let form = document.forms["discordForm"];

  saveDiscordSettingsFetch(
    form.webhook_url.value,
    form.embedTitle.value,
    form.authorName.value,
    form.authorURL.value,
    form.embedProviderName.value,
    form.embedProviderURL.value,
    form.embedDescription.value,
    form.embedColor.value
  ).then((data) => {
    if (data.success) {
      let success = $("#successMsgLoc")[0];
      success.innerText = "Successfully set Discord Settings";
      success.hidden = false;
      $("#errorMsgLoc")[0].hidden = true;
      $("#scroll-to-top")[0].click();
      loadData();
    } else {
      let failure = $("#errorMsgLoc")[0];
      failure.innerText = "Failed to save Discord Settings";
      failure.hidden = false;
      $("#successMsgLoc")[0].hidden = true;
      $("#scroll-to-top")[0].click();
      loadData();
    }
  });
}

async function revokeSessionsFetch() {
  let headers = {
    Authorization: localStorage.getItem("token"),
  };
  let req = await fetch("https://api.uploadr.club/api/v1/session/delete", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      current_session_id: localStorage.getItem("token"),
    }),
  });

  return req.json();
}

function revokeSessions() {
  revokeSessionsFetch().then((data) => {
    let success = $("#successMsgLoc")[0];
    success.innerText = `Purged ${data["purged"]} Session${
      data["purged"] !== 1 ? "s" : ""
    }`;
    success.hidden = false;
    $("#errorMsgLoc")[0].hidden = true;
    $("#scroll-to-top")[0].click();
  });
}

async function changePasswordFetch(password) {
  let headers = {
    Authorization: localStorage.getItem("token"),
  };
  let req = await fetch(
    "https://api.uploadr.club/api/v1/user/change_password",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        password: password,
      }),
    }
  );

  return req.json();
}

function changePassword() {
  let form = document.forms["passwordChange"];
  let nvp = form.new_password.value;
  if (!nvp) {
    return false;
  }
  changePasswordFetch(nvp).then(() => {
    let success = $("#successMsgLoc")[0];
    success.innerText = `Successfully changed the password`;
    success.hidden = false;
    $("#errorMsgLoc")[0].hidden = true;
    $("#scroll-to-top")[0].click();
  });
}

async function resetTokenFetch() {
  let headers = {
    Authorization: localStorage.getItem("token"),
  };
  let req = await fetch("https://api.uploadr.club/api/v1/user/reset_token", {
    method: "POST",
    headers: headers,
  });

  return req.json();
}

function resetToken() {
  resetTokenFetch().then((data) => {
    let success = $("#successMsgLoc")[0];
    success.innerText = `New Token: ${data.newToken}`;
    success.hidden = false;
    $("#errorMsgLoc")[0].hidden = true;
    $("#scroll-to-top")[0].click();
  });
}

loadData();
