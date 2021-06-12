// noinspection JSUnresolvedVariable,DuplicatedCode

async function register(username, password) {
    let req = await fetch("https://api.uploadr.club/api/v1/user/create",  {
        method: "POST",
        body: JSON.stringify({
            "username": username,
            "password": password
        })})

    if (!req.ok) {
        return req;
    } else {
        return req;
    }

}

async function validateRegistration() {
    let form = document.forms["registerForm"];
    register(form["username"].value, form["password"].value).then(req => {
        req.json().then(data => {
            if (!req.ok) {
                let errorMsg = $("#formHandler")[0].children[2];
                errorMsg.hidden = false;
                errorMsg.innerText = data.error.description;
                return false;
            } else {
                let errorMsg = $("#formHandler")[0].children[2];
                errorMsg.hidden = true;
                $("#successMessage")[0].hidden = false;
            }
        })
    });
}