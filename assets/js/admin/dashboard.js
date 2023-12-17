async function getUserData() {
  let headers = {
    Authorization: localStorage.getItem("token"),
  };
  let req = await fetch("https://api.uploadr.cloud/api/v1/user/data", {
    headers: headers,
  });
  return req.json();
}

async function getDomainCount() {
  let headers = {
    Authorization: localStorage.getItem("token"),
  };
  let req = await fetch(
    "https://api.uploadr.cloud/api/v1/admin/domains/count",
    {
      headers: headers,
    },
  );
  return req.json();
}

async function getFileCount() {
  let headers = {
    Authorization: localStorage.getItem("token"),
  };
  let req = await fetch("https://api.uploadr.cloud/api/v1/admin/files/count", {
    headers: headers,
  });
  return req.json();
}

function loadData() {
  getUserData().then((data) => {
    if (data.error) {
      $("#total_files")[0].innerText = data.error.description;
    } else {
      getDomainCount().then((dc) => {
        // noinspection JSUnresolvedVariable
        $("#domain_count")[0].innerText = dc.domains;
      });
      getFileCount().then((dc) => {
        // noinspection JSUnresolvedVariable
        $("#file_count")[0].innerText = dc.files;
      });

      // noinspection JSBitwiseOperatorUsage
      if (data.user.flags & (8 === 0)) {
        window.location = "/dash.html"; // redirect to dashboard if insufficient perms
      }
    }
  });
}
loadData();
