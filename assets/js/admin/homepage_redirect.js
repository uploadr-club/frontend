function checkIfLoggedIn() {
    let exp_ts = localStorage.getItem("expire_timestamp");  // expiry timestamp
    let c_ts = Math.round(new Date() / 1000);  // current timestamp
    if (exp_ts < c_ts) {
        window.location = "/login.html"
    } else {
        window.location = "/admin/dash.html"
    }
}

checkIfLoggedIn()