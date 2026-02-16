/**
 * Main application script
 * Loads artwork from _data/artwork.json (falls back to ARTWORK array),
 * filters by status, renders gallery, and handles lightbox.
 */
(function () {
  "use strict";

  var gallery = document.getElementById("gallery");
  if (!gallery) return;

  // Determine which status to show based on a data attribute on the gallery.
  // index.html sets data-status-filter="available"
  // previous-works.html sets data-status-filter="sold"
  var statusFilter = gallery.dataset.statusFilter || "available";

  // The filtered artwork for this page (populated after data loads)
  var displayedArtwork = [];

  // --- Data Loading ---

  function loadArtwork() {
    return fetch("_data/artwork.json")
      .then(function (res) {
        if (!res.ok) throw new Error("fetch failed");
        return res.json();
      })
      .then(function (data) {
        return data.pieces || [];
      })
      .catch(function () {
        // Fall back to the ARTWORK array defined in artwork.js
        return typeof ARTWORK !== "undefined" ? ARTWORK : [];
      });
  }

  function loadSettings() {
    fetch("_data/settings.json")
      .then(function (res) {
        if (!res.ok) throw new Error("fetch failed");
        return res.json();
      })
      .then(function (settings) {
        var heroHeading = document.querySelector(".hero h1");
        if (heroHeading && settings.heroHeading) {
          heroHeading.textContent = settings.heroHeading;
        }
        var aboutText = document.querySelector(".about-inner p");
        if (aboutText && settings.aboutText) {
          aboutText.textContent = settings.aboutText;
        }
      })
      .catch(function () {
        // Settings file not available; keep the hardcoded text
      });
  }

  // --- Gallery Rendering ---

  function renderGallery(artwork) {
    displayedArtwork = artwork.filter(function (piece) {
      return piece.status === statusFilter;
    });

    if (displayedArtwork.length === 0) {
      var empty = document.createElement("p");
      empty.className = "gallery-empty";
      empty.textContent =
        statusFilter === "sold"
          ? "No previous works to display yet."
          : "No artwork to display yet.";
      gallery.appendChild(empty);
      return;
    }

    var fragment = document.createDocumentFragment();

    displayedArtwork.forEach(function (piece, index) {
      var item = document.createElement("article");
      item.className = "gallery-item";
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", "View " + piece.title);
      item.dataset.index = index;

      var imgWrap = document.createElement("div");
      imgWrap.className = "gallery-item-img-wrap";

      var img = document.createElement("img");
      img.src = piece.image;
      img.alt = piece.title;
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = function () {
        imgWrap.classList.add("gallery-item-placeholder");
        imgWrap.textContent = "\u2702";
        img.remove();
      };

      imgWrap.appendChild(img);

      var info = document.createElement("div");
      info.className = "gallery-item-info";

      var title = document.createElement("h3");
      title.className = "gallery-item-title";
      title.textContent = piece.title;
      info.appendChild(title);

      if (piece.date || piece.medium) {
        var meta = document.createElement("p");
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
    var piece = displayedArtwork[currentIndex];
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
    currentIndex = (currentIndex + 1) % displayedArtwork.length;
    updateLightbox();
  }

  function prevImage() {
    currentIndex =
      (currentIndex - 1 + displayedArtwork.length) % displayedArtwork.length;
    updateLightbox();
  }

  // --- Event Listeners ---

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

  lightbox
    .querySelector(".lightbox-close")
    .addEventListener("click", closeLightbox);
  lightbox
    .querySelector(".lightbox-prev")
    .addEventListener("click", prevImage);
  lightbox
    .querySelector(".lightbox-next")
    .addEventListener("click", nextImage);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

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
  loadArtwork().then(renderGallery);
  loadSettings();
})();
