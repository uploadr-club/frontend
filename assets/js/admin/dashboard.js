async function getUserData() {
    let headers = {
        Authorization: localStorage.getItem("token"),
    };
    let req = await fetch("https://api.uploadr.club/api/v1/user/data", {
        headers: headers,
    });
    return req.json();
}

function loadData() {
    getUserData().then((data) => {
        if (data.error) {
            $("#total_files")[0].innerText = data.error.description;
        } else {
            // noinspection JSUnresolvedVariable
            $(
                "#userinfo"
            )[0].innerText = `UUID: ${data.user.uuid}\nFile Limit Enabled: ${data.ufs.enabled}`;
            // noinspection JSBitwiseOperatorUsage
            if (userFlags & 8 === 0 ) {
                window.location = "/dash.html";  // redirect to dashboard if insufficient perms
            }
        }
    });
}
loadData();
