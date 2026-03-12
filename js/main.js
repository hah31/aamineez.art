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
        var pieces = data.pieces || [];
        // Support both old "image" and new "images" format for backward compatibility
        return pieces.map(function (piece) {
          if (!piece.images && piece.image) {
            piece.images = [piece.image];
          }
          return piece;
        });
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

      // Display the first image from the images array
      var imgSrc = piece.images && piece.images.length > 0 ? piece.images[0] : piece.image;
      // Use resized thumbnail (800px wide) for gallery to reduce bandwidth
      var thumbSrc = imgSrc.replace("images/artwork/", "images/artwork/thumbs/");
      var img = document.createElement("img");
      img.src = thumbSrc;
      img.srcset = thumbSrc + " 800w";
      img.sizes = "(max-width: 480px) calc(100vw - 32px), (max-width: 768px) calc(50vw - 28px), 380px";
      img.alt = piece.title;
      img.loading = "lazy";
      img.decoding = "async";
      // Explicit dimensions prevent layout shift (aspect ratio matches container)
      img.width = 400;
      img.height = 500;
      img.style.aspectRatio = "4/5";

      // Track loading state
      var isLoading = true;
      img.addEventListener("loadstart", function () {
        imgWrap.classList.add("is-loading");
      });
      img.addEventListener("load", function () {
        isLoading = false;
        imgWrap.classList.remove("is-loading");
        imgWrap.classList.add("is-loaded");
      });

      img.onerror = function () {
        isLoading = false;
        imgWrap.classList.remove("is-loading");
        imgWrap.classList.add("gallery-item-placeholder");
        imgWrap.textContent = "\u2702";
        img.remove();
      };

      imgWrap.appendChild(img);

      // Add image count badge if there are multiple images
      if (piece.images && piece.images.length > 1) {
        var countBadge = document.createElement("div");
        countBadge.className = "gallery-item-count";
        countBadge.textContent = "+" + (piece.images.length - 1);
        imgWrap.appendChild(countBadge);
      }

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

  var currentPieceIndex = 0;
  var currentImageIndex = 0;
  var lightbox = document.getElementById("lightbox");
  var scrollYBeforeLightbox = 0;
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");

  // Track lightbox image loading state
  lightboxImg.addEventListener("loadstart", function () {
    lightboxImg.classList.add("is-loading");
  });
  lightboxImg.addEventListener("load", function () {
    lightboxImg.classList.remove("is-loading");
  });

  function openLightbox(index) {
    currentPieceIndex = index;
    currentImageIndex = 0;
    updateLightbox();
    lightbox.hidden = false;
    lightbox.offsetHeight;
    lightbox.classList.add("is-active");
    // iOS Safari scroll-lock: position:fixed prevents momentum scroll-through
    scrollYBeforeLightbox = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = "-" + scrollYBeforeLightbox + "px";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-active");
    // Restore scroll position before unlocking
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";
    window.scrollTo(0, scrollYBeforeLightbox);
    setTimeout(function () {
      lightbox.hidden = true;
    }, 300);
  }

  function updateLightbox() {
    var piece = displayedArtwork[currentPieceIndex];
    var images = piece.images || (piece.image ? [piece.image] : []);

    lightboxImg.src = images[currentImageIndex];
    lightboxImg.alt = piece.title;

    lightboxCaption.innerHTML = "";

    var titleLine = document.createElement("span");
    var captionText = piece.title;
    if (images.length > 1) {
      captionText += " \u2014 Image " + (currentImageIndex + 1) + " of " + images.length;
    }
    if (piece.date || piece.medium) {
      var parts = [];
      if (piece.date) parts.push(piece.date);
      if (piece.medium) parts.push(piece.medium);
      captionText += " \u2014 " + parts.join(", ");
    }
    titleLine.textContent = captionText;
    lightboxCaption.appendChild(titleLine);

    if (piece.description) {
      var descLine = document.createElement("span");
      descLine.className = "lightbox-description";
      descLine.textContent = piece.description;
      lightboxCaption.appendChild(descLine);
    }

    // Preload adjacent images for smooth navigation
    preloadLightboxImages();
  }

  function preloadLightboxImages() {
    var currentPiece = displayedArtwork[currentPieceIndex];
    var currentImages = currentPiece.images || (currentPiece.image ? [currentPiece.image] : []);

    var imagesToPreload = [];

    // Preload next image in current piece or first image of next piece
    if (currentImageIndex < currentImages.length - 1) {
      imagesToPreload.push(currentImages[currentImageIndex + 1]);
    } else if (currentPieceIndex < displayedArtwork.length - 1) {
      var nextPiece = displayedArtwork[currentPieceIndex + 1];
      imagesToPreload.push(nextPiece.images && nextPiece.images.length > 0 ? nextPiece.images[0] : nextPiece.image);
    }

    // Preload previous image
    if (currentImageIndex > 0) {
      imagesToPreload.push(currentImages[currentImageIndex - 1]);
    }

    imagesToPreload.forEach(function (src) {
      if (src && !document.querySelector('link[rel="prefetch"][href="' + src + '"]')) {
        var link = document.createElement("link");
        link.rel = "prefetch";
        link.as = "image";
        link.href = src;
        document.head.appendChild(link);
      }
    });
  }

  function nextImage() {
    var piece = displayedArtwork[currentPieceIndex];
    var images = piece.images || (piece.image ? [piece.image] : []);

    if (currentImageIndex < images.length - 1) {
      // Move to next image within this piece
      currentImageIndex++;
    } else {
      // Move to first image of next piece
      currentPieceIndex = (currentPieceIndex + 1) % displayedArtwork.length;
      currentImageIndex = 0;
    }
    updateLightbox();
  }

  function prevImage() {
    if (currentImageIndex > 0) {
      // Move to previous image within this piece
      currentImageIndex--;
    } else {
      // Move to last image of previous piece
      currentPieceIndex =
        (currentPieceIndex - 1 + displayedArtwork.length) % displayedArtwork.length;
      var prevPiece = displayedArtwork[currentPieceIndex];
      var prevImages = prevPiece.images || (prevPiece.image ? [prevPiece.image] : []);
      currentImageIndex = prevImages.length - 1;
    }
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

  // --- Touch / Swipe ---

  var touchStartX = 0;
  var touchStartY = 0;

  lightbox.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener("touchmove", function (e) {
    // Prevent background page scroll while lightbox is open
    e.preventDefault();
  }, { passive: false });

  lightbox.addEventListener("touchend", function (e) {
    var deltaX = e.changedTouches[0].clientX - touchStartX;
    var deltaY = e.changedTouches[0].clientY - touchStartY;

    // Only fire if swipe is more horizontal than vertical and exceeds 50px threshold
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  }, { passive: true });

  // --- Init ---
  loadArtwork().then(renderGallery);
  loadSettings();
})();
