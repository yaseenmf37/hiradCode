import type { Locale } from "./config";
import { en } from "./dictionaries/en";
import { fa, type Dictionary } from "./dictionaries/fa";

const dictionaries: Record<Locale, Dictionary> = { fa, en };

/** Synchronous — the dictionaries are static modules, so no async import is needed. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
