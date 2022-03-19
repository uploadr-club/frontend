async function getUserData() {
  headers = {
    Authorization: localStorage.getItem("token"),
  };
  let req = await fetch("https://api.uploadr.cloud/api/v1/user/data", {
    headers: headers,
  });
  return req.json();
}

async function getMOTD() {
  let req = await fetch("https://api.uploadr.cloud/api/v1/motd");
  return req.json();
}

async function getVersion() {
  let req = await fetch("https://api.uploadr.cloud/api/v1/version");
  return req.json();
}

async function getGlobalFileViews() {
  let req = await fetch(
    "https://api.uploadr.cloud/api/v1/get_global_view_count"
  );
  return req.json();
}

async function getUploadedFiles(page) {
  let headers = {
    Authorization: localStorage.getItem("token"),
  };
  let req = await fetch("https://api.uploadr.cloud/api/v1/user/files", {
    headers: headers,
    body: JSON.stringify({
      page: page,
    }),
    method: "POST",
  });
  return req.json();
}

function loadData() {
  getUserData().then((data) => {
    if (data.error) {
      $("#total_files")[0].innerText = data.error.description;
    } else {
      $("#total_files")[0].innerText = data.files;
      // noinspection JSUnresolvedVariable
      let psUsed = Math.round(
        (data.ufs.bytes_used /
          (data.ufs.bytes_available + data.ufs.bytes_used)) *
          100
      );
      // noinspection JSUnresolvedVariable
      $("#storage_counter")[0].innerText = `${psUsed}%`;
      // noinspection JSUnresolvedVariable
      let sb = $("#storage_bar");
      sb[0].className = `progress-bar bg-info`;
      sb[0].setAttribute("aria-valuenow", String(psUsed));
      sb.css("width", `${psUsed}%`);
      // noinspection JSUnresolvedVariable
      $(
        "#userinfo"
      )[0].innerText = `UUID: ${data.user.uuid}\nFile Limit Enabled: ${data.ufs.enabled}`;
      // noinspection JSUnresolvedVariable
      if (!jQuery.isEmptyObject(data.discord)) {
        let elem = $("#dLinkButton")[0];
        elem.innerText = "Relink Discord";
        // noinspection JSUnresolvedVariable
        // $("#usernameDropDown")[0].innerHTML = `<img style="border-radius: 50%;" alt="Profile Picture" width="45" src="https://cdn.discordapp.com/avatars/${data.discord.discord_data.user.id}/${data.discord.discord_data.user.avatar}.png?size=256">  ${data.user.username}`;
      } else {
        $("#dLinkButton")[0].disabled = false;
        // $("#usernameDropDown")[0].innerHTML = data.user.username;
      }
    }
  });

  getMOTD().then((data) => {
    if (data.error) {
      $("#motd")[0].innerHTML = data.error.description;
    } else {
      // noinspection JSUnresolvedVariable
      $("#motd")[0].innerHTML = data.motd;
    }
  });

  getVersion().then((data) => {
    if (data.error) {
      $("#version")[0].innerText = data.error.description;
    } else {
      // noinspection JSUnresolvedVariable
      $("#version")[0].innerText = data.version;
    }
  });

  getGlobalFileViews().then((data) => {
    if (data.error) {
      $("#gfv")[0].innerText = data.error.description;
    } else {
      // noinspection JSUnresolvedVariable
      $("#gfv")[0].innerText = data.views;
    }
  });

  getUploadedFiles(0).then((data) => {
    if (data.error) {
      $("#activBox")[0].innerText = data.error.description;
    } else {
      data = data.slice(0, 5);
      let a_box = document.getElementById("activBox");
      while (a_box.firstChild) {
        a_box.removeChild(a_box.firstChild);
      }
      data.forEach((item) => {
        let node = document.createElement("li");
        node.classList.add("activity-item", "list-group-item");
        let innerNode = document.createElement("div");
        innerNode.classList.add("row", "align-items-center", "no-gutters");
        let innerNode2 = document.createElement("div");
        innerNode2.classList.add("col", "mr-2");
        let innerNode3 = document.createElement("h6");
        innerNode3.classList.add("mb-0");
        let innerNode4 = document.createElement("strong");
        let innerNode5 = document.createElement("a");
        innerNode5.classList.add("activA");
        innerNode5.onclick = () => {
          window.open(`https://${item.url}`);
        };
        let innerNode5Text = document.createTextNode(item.url);
        innerNode5.appendChild(innerNode5Text);
        innerNode4.appendChild(innerNode5);
        innerNode3.appendChild(innerNode4);
        innerNode2.appendChild(innerNode3);
        innerNode.appendChild(innerNode2);
        node.appendChild(innerNode);
        a_box.appendChild(node);
      });
    }
  });
}
loadData();
