(function () {
  var root = document.getElementById("bridgecustom-embed");
  if (!root || root.getAttribute("data-bc-ready") === "1") return;
  root.setAttribute("data-bc-ready", "1");

  var origin = (root.getAttribute("data-app-origin") || "").replace(/\/$/, "");
  if (!origin) return;

  function findForm() {
    return (
      document.querySelector(".product-details form[action*='/cart/add'][data-type='add-to-cart-form']") ||
      document.querySelector(".product-details form[action*='/cart/add']") ||
      document.querySelector("form[action*='/cart/add'][data-type='add-to-cart-form']") ||
      document.querySelector("form[action*='/cart/add']")
    );
  }

  var host = document.getElementById("bridgecustom-form-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "bridgecustom-form-host";
    host.className = "bridgecustom-form";
    var block = document.querySelector("[data-bridgecustom-form='block']");
    var form = findForm();
    var buttons = form && form.querySelector(".product-form-buttons");
    if (block) block.appendChild(host);
    else if (buttons && buttons.parentNode) buttons.parentNode.insertBefore(host, buttons);
    else if (form) form.appendChild(host);
    else {
      var details = document.querySelector(".product-details");
      if (details) details.appendChild(host);
      else document.body.appendChild(host);
    }
  }

  host.hidden = false;
  host.removeAttribute("hidden");
  host.style.display = "block";
  host.style.width = "100%";
  if (!host.getAttribute("data-bc-placeholder") && !host.shadowRoot) {
    host.setAttribute("data-bc-placeholder", "1");
    host.innerHTML =
      '<p class="bridgecustom-form-placeholder">Loading personalization…</p>';
  }

  var script = document.createElement("script");
  script.src = origin + "/widget/customizer-widget-v15.js";
  script.defer = true;
  script.onerror = function () {
    host.innerHTML =
      '<p class="bridgecustom-form-placeholder">Personalization failed to load. Refresh the page.</p>';
  };
  document.head.appendChild(script);
})();
