/**
 * Structural metadata for the marketing content. The localized copy (titles,
 * descriptions, bullets, testimonials, FAQ) lives in the i18n dictionaries;
 * this file only holds the stable ids and icons that don't change per language.
 */

export type ServiceIconName =
  | "design"
  | "code"
  | "brand"
  | "speed"
  | "seo"
  | "support";

/** id → drives the anchor (`/services#id`); icon → picks the glyph. Order matches
 *  `dict.content.services`, so pages zip the two together by index. */
export const SERVICE_META: { id: string; icon: ServiceIconName }[] = [
  { id: "design", icon: "design" },
  { id: "development", icon: "code" },
  { id: "branding", icon: "brand" },
  { id: "performance", icon: "speed" },
  { id: "seo", icon: "seo" },
  { id: "support", icon: "support" },
];
