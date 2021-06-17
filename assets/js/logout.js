function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_uuid");
    localStorage.removeItem("expire_timestamp")
    localStorage.removeItem("plan")
    window.location = "/login.html"
}

logout()