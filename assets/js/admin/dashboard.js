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
            userFlags = data.user.flags;
        }
    });
    dashAccordian();


}
loadData();
