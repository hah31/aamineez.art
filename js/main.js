/**
 * Main application script
 * Renders gallery from ARTWORK data and handles lightbox
 */
(function () {
  "use strict";

  // --- Gallery Rendering ---
  const gallery = document.getElementById("gallery");

  function renderGallery() {
    const fragment = document.createDocumentFragment();

    ARTWORK.forEach(function (piece, index) {
      const item = document.createElement("article");
      item.className = "gallery-item";
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", "View " + piece.title);
      item.dataset.index = index;

      const imgWrap = document.createElement("div");
      imgWrap.className = "gallery-item-img-wrap";

      const img = document.createElement("img");
      img.src = piece.image;
      img.alt = piece.title;
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = function () {
        // Show placeholder if image fails to load
        imgWrap.classList.add("gallery-item-placeholder");
        imgWrap.textContent = "\u2702";
        img.remove();
      };

      imgWrap.appendChild(img);

      const info = document.createElement("div");
      info.className = "gallery-item-info";

      const title = document.createElement("h3");
      title.className = "gallery-item-title";
      title.textContent = piece.title;
      info.appendChild(title);

      if (piece.date || piece.medium) {
        const meta = document.createElement("p");
        meta.className = "gallery-item-meta";
        var parts = [];
        if (piece.date) parts.push(piece.date);
        if (piece.medium) parts.push(piece.medium);
        meta.textContent = parts.join(" \u00B7 ");
        info.appendChild(meta);
      }

      item.appendChild(imgWrap);
      item.appendChild(info);
      fragment.appendChild(item);
    });

    gallery.appendChild(fragment);
  }

  // --- Lightbox ---
  var currentIndex = 0;
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    // Force reflow before adding class for transition
    lightbox.offsetHeight;
    lightbox.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-active");
    document.body.style.overflow = "";
    setTimeout(function () {
      lightbox.hidden = true;
    }, 300);
  }

  function updateLightbox() {
    var piece = ARTWORK[currentIndex];
    lightboxImg.src = piece.image;
    lightboxImg.alt = piece.title;

    var caption = piece.title;
    if (piece.date || piece.medium) {
      var parts = [];
      if (piece.date) parts.push(piece.date);
      if (piece.medium) parts.push(piece.medium);
      caption += " \u2014 " + parts.join(", ");
    }
    lightboxCaption.textContent = caption;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % ARTWORK.length;
    updateLightbox();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + ARTWORK.length) % ARTWORK.length;
    updateLightbox();
  }

  // --- Event Listeners ---

  // Gallery click/keyboard
  gallery.addEventListener("click", function (e) {
    var item = e.target.closest(".gallery-item");
    if (item) {
      openLightbox(parseInt(item.dataset.index, 10));
    }
  });

  gallery.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      var item = e.target.closest(".gallery-item");
      if (item) {
        e.preventDefault();
        openLightbox(parseInt(item.dataset.index, 10));
      }
    }
  });

  // Lightbox controls
  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", prevImage);
  lightbox.querySelector(".lightbox-next").addEventListener("click", nextImage);

  // Click backdrop to close
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-active")) return;

    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowRight":
        nextImage();
        break;
      case "ArrowLeft":
        prevImage();
        break;
    }
  });

  // --- Init ---
  renderGallery();
})();
