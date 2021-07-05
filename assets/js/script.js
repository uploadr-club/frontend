const darkSwitch = document.getElementById("darkSwitch");

function initTheme() {
  let e = "dark" === localStorage.getItem("darkSwitch");
  null === localStorage.getItem("darkSwitch") && (e = !0),
    (darkSwitch.checked = e),
    e
      ? document.body.setAttribute("data-theme", "dark")
      : document.body.removeAttribute("data-theme");
}

function resetTheme() {
  darkSwitch.checked
    ? (document.body.setAttribute("data-theme", "dark"),
      localStorage.setItem("darkSwitch", "dark"))
    : (document.body.removeAttribute("data-theme"),
      localStorage.setItem("darkSwitch", "light"));
}
window.addEventListener("load", () => {
  darkSwitch &&
    (initTheme(),
    darkSwitch.addEventListener("change", () => {
      resetTheme();
    }));
}),
  (function (e) {
    "use strict";
    e("body.fixed-nav .sidebar").on(
      "mousewheel DOMMouseScroll wheel",
      function (t) {
        if (e(window).width() > 768) {
          var o = t.originalEvent,
            a = o.wheelDelta || -o.detail;
          (this.scrollTop += 30 * (a < 0 ? 1 : -1)), t.preventDefault();
        }
      }
    ),
      e(document).on("scroll", function () {
        e(this).scrollTop() > 100
          ? e(".scroll-to-top").fadeIn()
          : e(".scroll-to-top").fadeOut();
      }),
      e(document).on("click", "a.scroll-to-top", function (t) {
        var o = e(this);
        e("html, body")
          .stop()
          .animate(
            {
              scrollTop: e(o.attr("href")).offset().top,
            },
            1e3,
            "easeInOutExpo"
          ),
          t.preventDefault();
      });
  })(jQuery);

function reqHandler() {
  let req = fetch("https://api.uploadr.club/api/v1/session/check", {
    method: "POST",
    body: JSON.stringify({
      token: localStorage.getItem("token"),
    }),
  });
  if (req.ok) {
    return req;
  } else {
    return req;
  }
}

function checkIfLoggedIn() {
  let exp_ts = localStorage.getItem("expire_timestamp"); // expiry timestamp
  let c_ts = Math.round(new Date() / 1000); // current timestamp
  if (exp_ts < c_ts) {
    if (
      window.location.pathname !== "/login.html" &&
      window.location.pathname !== "/register.html"
    ) {
      window.location = "/login.html";
      return false;
    }
  } else {
    reqHandler().then((req) => {
      if (!req.ok) {
        if (
          window.location.pathname !== "/login.html" &&
          window.location.pathname !== "/register.html"
        ) {
          window.location = "/login.html";
          return false;
        }
      } else {
        if (
          window.location.pathname === "/login.html" ||
          window.location.pathname === "/register.html"
        ) {
          window.location = "/dash.html";
        }
        return true;
      }
    });
  }
}

checkIfLoggedIn();

const dashboard_urls = [
  "/dash.html",
  "/profile.html",
  "/files.html",
  "/admin/dash.html",
  // "/auditlog.html"
];

function dashAccordian(userFlags) {
  let dashboard_names = [
    {
      name: "Dashboard",
      className: "fas fa-tachometer-alt",
      requirement: 0,
    },
    {
      name: "Profile",
      className: "fas fa-user",
      requirement: 0,
    },
    {
      name: "Files",
      className: "fas fa-table",
      requirement: 0,
    },
    {
      name: "Admin Dashboard",
      className: "fas fa-toolbox",
      requirement: 8,
    }
  ];
  if (dashboard_urls.indexOf(window.location.pathname) > -1) {
    let accordian = document.getElementById("accordionSidebar");
    for (let page in dashboard_urls) {
      // noinspection JSBitwiseOperatorUsage
      if (dashboard_names[page].requirement === 0 || userFlags & dashboard_names[page].requirement) {
        let main_node = document.createElement("li");
        main_node.className = "nav-item";
        let linkNode = document.createElement("a");
        linkNode.href = dashboard_urls[page];
        linkNode.className = `nav-link${
            dashboard_urls[page] === window.location.pathname ? " active" : ""
        }`;
        let iconNode = document.createElement("i");
        iconNode.className = dashboard_names[page]["className"];
        let nameNode = document.createElement("span");
        nameNode.innerText = dashboard_names[page]["name"];
        linkNode.appendChild(iconNode);
        main_node.appendChild(linkNode);
        linkNode.appendChild(nameNode);
        accordian.appendChild(main_node);
      }
    }
  }
}

// dashAccordian();

async function getUserData() {
  let headers = {
    Authorization: localStorage.getItem("token"),
  };
  let req = await fetch("https://api.uploadr.club/api/v1/user/data", {
    headers: headers,
  });
  return req.json();
}

function usernameDropdown() {
  if (dashboard_urls.indexOf(window.location.pathname) > -1) {
    // user specific parts
    getUserData().then((data) => {
      // noinspection JSUnresolvedVariable
      if (!jQuery.isEmptyObject(data.discord)) {
        // noinspection JSUnresolvedVariable
        $(
          "#usernameDropDownSpan"
        )[0].innerHTML = `<img style="border-radius: 50%;" alt="Profile Picture" width="45" src="https://cdn.discordapp.com/avatars/${data.discord.discord_data.user.id}/${data.discord.discord_data.user.avatar}.png?size=256">  ${data.user.username}`;
      } else {
        $("#usernameDropDownSpan")[0].innerHTML = data.user.username;
      }
    });

    const uDropDown = document.getElementById("usernameDropDown");
    let opts = [
      [
        {
          name: "Settings",
          icon: "fas fa-cogs fa-sm fa-fw mr-2 text-gray-400",
          link_url: "/profile.html",
        },
        // {
        // 	name: "Activity Log",
        // 	icon: "fas fa-list fa-sm fa-fw mr-2 text-gray-400",
        // 	link_url: "/auditlog.html"
        // },
      ],
      [
        {
          name: "Logout",
          icon: "fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400",
          link_url: "/logout.html",
        },
      ],
    ];

    for (let catag in opts) {
      for (let item in opts[catag]) {
        let itm = opts[catag][item];
        let node = document.createElement("a");
        node.className = "dropdown-item";
        console.log(itm.name);
        if (itm.name === "Logout") {
          node.className += "";
        }
        node.href = itm.link_url;
        let iconNode = document.createElement("i");
        iconNode.className = itm.icon;
        let textNode = document.createElement("span");
        textNode.innerText = itm.name;
        node.appendChild(iconNode);
        node.appendChild(textNode);
        uDropDown.appendChild(node);
      }
      if (opts.length - 1 !== Number(catag)) {
        let dividerNode = document.createElement("div");
        dividerNode.className = "dropdown-divider";
        uDropDown.appendChild(dividerNode);
      }
    }
  }
}

usernameDropdown();
