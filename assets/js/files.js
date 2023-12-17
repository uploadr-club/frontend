var btns = document.querySelectorAll(".copy");

let pageNumber = 0;

for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("mouseleave", clearTooltip);
  btns[i].addEventListener("blur", clearTooltip);
}

function clearTooltip(e) {
  e.currentTarget.setAttribute("class", "copy btn btn-primary");
  e.currentTarget.removeAttribute("aria-label");
}

function showTooltip(elem, msg) {
  elem.setAttribute("class", "copy btn btn-primary tooltipped tooltipped-s");
  elem.setAttribute("aria-label", msg);
}

function fallbackMessage(action) {
  var actionMsg = "";
  var actionKey = action === "cut" ? "X" : "C";
  if (/iPhone|iPad/i.test(navigator.userAgent)) {
    actionMsg = "There is no support for copying on this device!";
  } else if (/Mac/i.test(navigator.userAgent)) {
    actionMsg = "Press ⌘-" + actionKey + " to " + action;
  } else {
    actionMsg = "Press Ctrl-" + actionKey + " to " + action;
  }
  return actionMsg;
}

$("#delete-all").on("click", function () {
  if (confirm("Are you sure you want to delete all files?")) {
    $.post(
      window.location.href,
      {
        action: "delete_all",
      },
      function (p) {
        if (p.success) {
          alert("Removed all files from database!");
          window.location.reload();
        } else {
          alert("Deletion failed.");
        }
      },
    );
  } else {
    // Do nothing uwu
  }
});

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

function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

function loadFiles() {
  let tb = document.getElementById("tableBody");
  while (tb.firstChild) {
    tb.removeChild(tb.firstChild);
  }
  getUploadedFiles(pageNumber).then((data) => {
    data.forEach((img) => {
      let imgurl = `https://${img.full_domain}/${img.name}${img.extension}`;

      let tableRow = document.createElement("tr");
      tableRow.id = img.name;
      let tableD0 = document.createElement("td");
      tableD0.innerText = `${img.name}${img.extension}`;
      let tableD1 = document.createElement("td");
      tableD1.innerText = img.ip;
      let tableD2 = document.createElement("td");
      tableD2.innerText = humanFileSize(img.size);
      let tableD3 = document.createElement("td");
      tableD3.innerText = `Not Available`;
      let tableD4 = document.createElement("td");

      // open image button

      let tableD4Btn0 = document.createElement("button");
      tableD4Btn0.className = "btn btn-secondary";
      tableD4Btn0.onclick = () => {
        window.open(imgurl, "_blank");
      };
      let td4bi = document.createElement("i");
      td4bi.className = "fas fa-share";

      // copy image button

      let tableD4Btn1 = document.createElement("button");
      tableD4Btn1.className = "btn btn-primary copy";
      tableD4Btn1.setAttribute("data-clipboard-text", imgurl);
      let td4bi1 = document.createElement("i");
      td4bi1.className = "fas fa-clipboard";

      // delete image button

      let tableD4Btn2 = document.createElement("button");
      tableD4Btn2.className = "btn btn-danger delete";
      tableD4Btn2.id = img.id;
      tableD4Btn2.onclick = () => {
        const elm = $(`#${img.id}`);
        elm.prop("disabled", true);
        fetch("https://api.uploadr.cloud/api/v1/user/file", {
          body: JSON.stringify({
            file_id: img.id,
            host: img.full_domain,
          }),
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }).then((p) => {
          p.json().then((x) => {
            if (x.deleted) {
              elm.remove();
            } else {
              alert("Deletion failed.");
            }
          });
        });
      };
      let td4bi2 = document.createElement("i");
      td4bi2.className = "fas fa-trash-alt";

      tableD4Btn0.appendChild(td4bi);
      tableD4Btn1.appendChild(td4bi1);
      tableD4Btn2.appendChild(td4bi2);
      tableD4.appendChild(tableD4Btn0);
      tableD4.appendChild(tableD4Btn1);
      tableD4.appendChild(tableD4Btn2);
      // table row stuff
      tableRow.appendChild(tableD0);
      tableRow.appendChild(tableD1);
      tableRow.appendChild(tableD2);
      tableRow.appendChild(tableD3);
      tableRow.appendChild(tableD4);
      tb.appendChild(tableRow);
    });
  });

  if (pageNumber === 0) {
    let ppage = $("#ppage")[0];
    ppage.disabled = true;
    ppage.className = "page-item disabled";
    let npage = $("#npage")[0];
    npage.disabled = false;
    npage.className = "page-item";
  } else {
    let ppage = $("#ppage")[0];
    ppage.disabled = false;
    ppage.className = "page-item";
    let npage = $("#npage")[0];
    npage.disabled = false;
    npage.className = "page-item";
  }
}

loadFiles();

$(".preview").on("click", function () {
  $("#preview-img").attr(
    "src",
    "https://gitlab.has-bad.tech/3uuMk0J8A5rrUA.gif",
  );
  let imgurl = $(this).data("img");
  $("#preview-img").attr("src", imgurl);
  $("#preview-modal").show();
});
$(".close").on("click", function () {
  $("#preview-modal").hide();
});
window.onclick = function (event) {
  if (event.target === $("#preview-modal")) {
    $("#preview-modal").hide();
  }
};

function pageBack() {
  if (pageNumber !== 0) {
    pageNumber--;
    loadFiles();
  }
}

function pageFwd() {
  pageNumber++;
  loadFiles();
}
