function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_uuid");
    localStorage.removeItem("expire_timestamp")
    window.location = "/login.html"
}

logout()