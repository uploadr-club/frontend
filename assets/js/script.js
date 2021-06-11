const darkSwitch = document.getElementById("darkSwitch");

function initTheme() {
	let e = "dark" === localStorage.getItem("darkSwitch");
	null === localStorage.getItem("darkSwitch") && (e = !0), darkSwitch.checked = e, e ? document.body.setAttribute("data-theme", "dark") : document.body.removeAttribute("data-theme")
}

function resetTheme() {
	darkSwitch.checked ? (document.body.setAttribute("data-theme", "dark"), localStorage.setItem("darkSwitch", "dark")) : (document.body.removeAttribute("data-theme"), localStorage.setItem("darkSwitch", "light"))
}
window.addEventListener("load", () => {
		darkSwitch && (initTheme(), darkSwitch.addEventListener("change", () => {
			resetTheme()
		}))
	}),
	function(e) {
		"use strict";
		e("body.fixed-nav .sidebar").on("mousewheel DOMMouseScroll wheel", (function(t) {
			if (e(window).width() > 768) {
				var o = t.originalEvent,
					a = o.wheelDelta || -o.detail;
				this.scrollTop += 30 * (a < 0 ? 1 : -1), t.preventDefault()
			}
		})), e(document).on("scroll", (function() {
			e(this).scrollTop() > 100 ? e(".scroll-to-top").fadeIn() : e(".scroll-to-top").fadeOut()
		})), e(document).on("click", "a.scroll-to-top", (function(t) {
			var o = e(this);
			e("html, body").stop().animate({
				scrollTop: e(o.attr("href")).offset().top
			}, 1e3, "easeInOutExpo"), t.preventDefault()
		}))
	}(jQuery);

function reqHandler() {
	let req = fetch("https://api.uploadr.club/api/v1/session/check", {
		method: "POST",
		body: JSON.stringify({
			token: localStorage.getItem("token")
		})
	})
	if (req.ok) {
		return req;
	} else {
		return req;
	}
}

function checkIfLoggedIn() {
	let exp_ts = localStorage.getItem("expire_timestamp");  // expiry timestamp
	let c_ts = Math.round(new Date() / 1000);  // current timestamp
	if (exp_ts < c_ts) {
		if (window.location.pathname !== "/login.html") {
			window.location = "/login.html"
			return false;
		}
	} else {
		reqHandler().then(req => {
			if (!req.ok) {
				if (window.location.pathname !== "/login.html") {
					window.location = "/login.html"
					return false;
				}
			} else {
				if (window.location.pathname === "/login.html") {
					window.location = "/dash.html"
				}
				return true;
			}
		})
	}

}

checkIfLoggedIn()
