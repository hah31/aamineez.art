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
    image: "images/artwork/bismillah.jpg",
    date: "2025",
    medium: "Ink on paper",
    description: "",
    status: "available",
  },
  {
    title: "Salaam",
    image: "images/artwork/salam.jpg",
    date: "2025",
    medium: "Ink on paper",
    description: "",
    status: "available",
  },
  {
    title: "Patience",
    image: "images/artwork/patience.jpg",
    date: "2024",
    medium: "Ink on handmade paper",
    description: "",
    status: "available",
  },
  {
    title: "Light Upon Light",
    image: "images/artwork/light-upon-light.jpg",
    date: "2024",
    medium: "Gold ink on black paper",
    description: "",
    status: "available",
  },
  {
    title: "Gratitude",
    image: "images/artwork/gratitude.jpg",
    date: "2024",
    medium: "Watercolor and ink",
    description: "",
    status: "available",
  },
  {
    title: "The Pen",
    image: "images/artwork/the-pen.jpg",
    date: "2023",
    medium: "Reed pen on cotton paper",
    description: "",
    status: "available",
  },
];
