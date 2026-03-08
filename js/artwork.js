/**
 * Artwork Data — Fallback
 *
 * This array is used as a fallback if the primary data file
 * (_data/artwork.json) cannot be loaded. The CMS manages artwork
 * through that JSON file. If you add artwork manually, update
 * both this file AND _data/artwork.json to keep them in sync.
 *
 * Fields:
 *   title       (required) — Name of the piece
 *   image       (required) — Path to image file, relative to site root
 *   date        (optional) — Year or date string
 *   medium      (optional) — e.g. "Ink on paper", "Digital"
 *   description (optional) — Brief description
 *   status      (required) — "available" or "sold"
 */
const ARTWORK = [
  {
    title: "Bismillah",
    images: [
      "images/artwork/IMG_9925.JPG",
      "images/artwork/IMG_9923.JPG",
    ],
    date: "2026",
    medium: "Ink on paper",
    description: "",
    status: "available",
  },
  {
    title: "Salam",
    images: [
      "images/artwork/IMG_9931.JPG",
      "images/artwork/IMG_9933.JPG",
      "images/artwork/IMG_9944.JPG",
    ],
    date: "2026",
    medium: "Ink on paper",
    description: "",
    status: "available",
  },
  {
    title: "Patience",
    images: [
      "images/artwork/IMG_9934.JPG",
      "images/artwork/IMG_9935.JPG",
    ],
    date: "2026",
    medium: "Ink on handmade paper",
    description: "",
    status: "available",
  },
  {
    title: "Light Upon Light",
    images: [
      "images/artwork/IMG_9937.JPG",
      "images/artwork/IMG_9936.JPG",
    ],
    date: "2026",
    medium: "Gold ink on black paper",
    description: "",
    status: "available",
  },
  {
    title: "Gratitude",
    images: [
      "images/artwork/IMG_9939.JPG",
      "images/artwork/IMG_9947.JPG",
    ],
    date: "2026",
    medium: "Watercolor and ink",
    description: "",
    status: "available",
  },
  {
    title: "The Pen",
    images: [
      "images/artwork/IMG_9948.JPG",
      "images/artwork/IMG_9954.JPG",
      "images/artwork/IMG_9956.JPG",
    ],
    date: "2026",
    medium: "Reed pen on cotton paper",
    description: "",
    status: "available",
  },
  {
    title: "The Waves",
    images: [
      "images/artwork/IMG_9962.JPG",
      "images/artwork/IMG_9976.JPG",
      "images/artwork/IMG_9980.JPG",
    ],
    date: "2026",
    medium: "Reed pen on cotton paper",
    description: "",
    status: "available",
  },
  {
    title: "The Big One",
    images: [
      "images/artwork/IMG_9984.JPG",
      "images/artwork/IMG_9985.JPG",
      "images/artwork/IMG_9987.JPG",
      "images/artwork/IMG_9990.JPG",
    ],
    date: "2026",
    medium: "Reed pen on cotton paper",
    description: "",
    status: "available",
  },
];
