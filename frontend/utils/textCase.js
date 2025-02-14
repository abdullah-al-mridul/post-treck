/**
 * Utility functions for text case conversions
 */

// Convert to camelCase
export const toCamelCase = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""));
};

// Convert to PascalCase
export const toPascalCase = (text) => {
  if (!text) return "";

  return text.toLowerCase().replace(/[-_\s]+(.)?|^(.)/g, (_, char1, char2) => {
    return (char1 || char2).toUpperCase();
  });
};

// Convert to Title Case
export const toTitleCase = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[-_\s]+(.)?|^(.)/g, (_, char1, char2) => {
      return " " + (char1 || char2).toUpperCase();
    })
    .trim();
};

// Convert to snake_case
export const toSnakeCase = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[-\s]+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");
};

// Convert to kebab-case
export const toKebabCase = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[-_\s]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");
};
