// Makes user-friendly slugs by:
// strips strings of punctuation and accent marks,
// then replaces spaces with dashes
export const makeURLSafe = (name: string): string => {
  var slug = name;
  slug = slug
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s\']|_/g, "")
    .replace(/\s+/g, "-");

  // Return url safe version as a precaution
  return encodeURIComponent(slug);
};
