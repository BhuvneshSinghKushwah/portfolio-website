import { nanoid } from "nanoid";

/** Generates a URL-safe random slug of the given length (default 8). */
export function generateSlug(length = 8): string {
  return nanoid(length);
}
