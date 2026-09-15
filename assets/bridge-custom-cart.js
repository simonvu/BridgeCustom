(function () {
  if (window.__BRIDGECUSTOM_CART_JS__) return;
  window.__BRIDGECUSTOM_CART_JS__ = true;

  var STYLE_ID = "bridgecustom-cart-css";
  if (!document.getElementById(STYLE_ID)) {
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      ".bridgecustom-edit-design{display:inline-flex;align-items:center;gap:.4rem;margin:.55rem 0 0;padding:0;border:0;background:none;color:#334155;font-size:.8125rem;font-weight:600;cursor:pointer;text-decoration:underline;text-underline-offset:2px}" +
      ".cart-items__media-container[data-bc-zoom]{cursor:zoom-in}" +
      ".bridgecustom-edit-modal{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,42,.55)}" +
      ".bridgecustom-edit-modal__dialog{position:relative;width:min(1120px,100%);height:min(760px,92vh);background:#fff;border-radius:16px;box-shadow:0 24px 80px rgba(15,23,42,.35);overflow:hidden;display:flex;flex-direction:column}" +
      ".bridgecustom-edit-modal__bar{display:flex;align-items:center;justify-content:center;position:relative;padding:14px 48px;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:15px;color:#0f172a}" +
      ".bridgecustom-edit-modal__close{position:absolute;right:12px;top:50%;transform:translateY(-50%);width:36px;height:36px;border:0;background:none;font-size:22px;line-height:1;cursor:pointer;color:#64748b}" +
      ".bridgecustom-edit-modal__frame{flex:1;width:100%;border:0;background:#fff}" +
      ".bridgecustom-edit-modal__status{position:absolute;inset:auto 0 0 0;padding:10px 16px;background:#0f172a;color:#fff;font-size:13px;font-weight:600;text-align:center}" +
      ".bridgecustom-zoom{position:fixed;inset:0;z-index:2147483001;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,42,.82)}" +
      ".bridgecustom-zoom img{max-width:min(960px,100%);max-height:92vh;object-fit:contain;border-radius:12px;background:#fff;box-shadow:0 24px 80px rgba(15,23,42,.45)}" +
      ".bridgecustom-zoom__close{position:absolute;top:12px;right:12px;width:40px;height:40px;border:0;border-radius:999px;background:#fff;color:#0f172a;font-size:24px;line-height:1;cursor:pointer}";
    document.head.appendChild(style);
  }

  function appOriginFrom(button) {
    return (
      (button && button.getAttribute("data-app-origin")) ||
      window.__BRIDGECUSTOM_APP_ORIGIN__ ||
      "https://app.bridgecustom.com"
    ).replace(/\/$/, "");
  }

  function applyCartPreviewImages() {
    fetch("/cart.js", { credentials: "same-origin", headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (cart) {
        if (!cart || !cart.items) return;
        cart.items.forEach(function (item) {
          var props = item.properties || {};
          var preview = props._bc_preview || props["_bc_preview"];
          if (!preview) return;
          document.querySelectorAll('[data-key="' + item.key + '"] .cart-items__media-image').forEach(function (img) {
            if (img.getAttribute("src") !== preview) img.setAttribute("src", preview);
          });
        });
      })
      .catch(function () {});
  }

  document.addEventListener("DOMContentLoaded", applyCartPreviewImages);
  document.addEventListener("shopify:section:load", applyCartPreviewImages);
  window.setTimeout(applyCartPreviewImages, 400);
  window.setTimeout(applyCartPreviewImages, 1600);
  document.addEventListener("cart:updated", applyCartPreviewImages);
  document.addEventListener("cart:change", applyCartPreviewImages);

  var activeModal = null;

  function closeModal() {
    if (!activeModal) return;
    activeModal.remove();
    activeModal = null;
    document.body.style.removeProperty("overflow");
  }

  var zoomOverlay = null;
  function closeImageZoom() {
    if (!zoomOverlay) return;
    zoomOverlay.remove();
    zoomOverlay = null;
    document.body.style.removeProperty("overflow");
  }
  function openImageZoom(src, alt) {
    if (!src) return;
    closeImageZoom();
    var overlay = document.createElement("div");
    overlay.className = "bridgecustom-zoom";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML =
      '<button type="button" class="bridgecustom-zoom__close" aria-label="Close">&times;</button><img src="' +
      String(src).replace(/"/g, "&quot;") +
      '" alt="' +
      String(alt || "").replace(/"/g, "&quot;") +
      '">';
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay || (event.target.closest && event.target.closest(".bridgecustom-zoom__close"))) {
        closeImageZoom();
      }
    });
    document.body.style.overflow = "hidden";
    document.body.appendChild(overlay);
    zoomOverlay = overlay;
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeImageZoom();
  });

  async function replaceCartLine(opts) {
    var change = await fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ id: opts.lineKey, quantity: 0 }),
    });
    if (!change.ok) throw new Error("Could not update cart line");
    var payload = {
      items: [
        {
          id: Number(opts.variantId),
          quantity: Number(opts.quantity) || 1,
          properties: opts.properties || {},
        },
      ],
    };
    if (opts.sellingPlan) payload.items[0].selling_plan = Number(opts.sellingPlan);
    var add = await fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!add.ok) throw new Error("Could not add updated design");
    window.location.reload();
  }

  function openModal(button) {
    closeModal();
    var origin = appOriginFrom(button);
    var shop = button.getAttribute("data-shop") || "";
    var productId = button.getAttribute("data-product-id") || "";
    var designId = button.getAttribute("data-design-id") || "";
    var lineKey = button.getAttribute("data-line-key") || "";
    var variantId = button.getAttribute("data-variant-id") || "";
    var quantity = button.getAttribute("data-quantity") || "1";
    var sellingPlan = button.getAttribute("data-selling-plan") || "";
    var color = button.getAttribute("data-product-color") || "";
    var src =
      origin +
      "/customize?shop=" +
      encodeURIComponent(shop) +
      "&product=" +
      encodeURIComponent(productId) +
      "&embed=1&slot=modal" +
      (designId ? "&design=" + encodeURIComponent(designId) : "") +
      (color ? "&color=" + encodeURIComponent(color) : "");

    var overlay = document.createElement("div");
    overlay.className = "bridgecustom-edit-modal";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML =
      '<div class="bridgecustom-edit-modal__dialog">' +
      '<div class="bridgecustom-edit-modal__bar">Edit Personalization<button type="button" class="bridgecustom-edit-modal__close" aria-label="Close">&times;</button></div>' +
      '<iframe class="bridgecustom-edit-modal__frame" title="Edit Personalization" src="' +
      src +
      '"></iframe>' +
      "</div>";
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    activeModal = overlay;

    overlay.querySelector(".bridgecustom-edit-modal__close").addEventListener("click", closeModal);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) closeModal();
    });

    function onMessage(event) {
      if (event.origin.replace(/\/$/, "") !== origin) return;
      var data = event.data || {};
      if (data.type !== "bridgecustom:save-design") return;
      window.removeEventListener("message", onMessage);
      var status = document.createElement("div");
      status.className = "bridgecustom-edit-modal__status";
      status.textContent = "Saving your design…";
      overlay.querySelector(".bridgecustom-edit-modal__dialog").appendChild(status);
      replaceCartLine({
        lineKey: lineKey,
        variantId: variantId,
        quantity: quantity,
        sellingPlan: sellingPlan,
        properties: data.properties || {},
      }).catch(function (err) {
        console.error("Bridge Custom edit design", err);
        window.alert("Could not save the updated design. Please try again.");
        closeModal();
      });
    }
    window.addEventListener("message", onMessage);
  }

  document.addEventListener("click", function (event) {
    var button = event.target && event.target.closest ? event.target.closest("[data-bc-edit]") : null;
    if (button) {
      event.preventDefault();
      openModal(button);
      return;
    }
    var media = event.target && event.target.closest ? event.target.closest("[data-bc-zoom]") : null;
    if (!media) return;
    var img = media.querySelector("img");
    var src = media.getAttribute("data-bc-zoom-src") || (img && (img.currentSrc || img.src)) || "";
    if (!src) return;
    event.preventDefault();
    openImageZoom(src, (img && img.getAttribute("alt")) || "");
  });
})();
