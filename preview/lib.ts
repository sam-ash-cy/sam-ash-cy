import { join } from "node:path";

export const root = join(import.meta.dir, "..");
export const imgs = join(root, "assets", "imgs");

// Image SVGs on GitHub cannot load web fonts, so every generated asset uses system font stacks.
export const monoFont = "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
export const sansFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif";

// Monospace glyphs are 0.6em wide in practically every coding font, which is what lets typing widths be computed.
export const monoWidth = (chars: number, fontSize: number) => chars * fontSize * 0.6;

export function escape(text: string) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Small seeded PRNG so regenerating gives the same output unless the seed changes.
export function rng(seed: number) {
	return () => {
		seed = (seed * 1664525 + 1013904223) % 4294967296;
		return seed / 4294967296;
	};
}

export const warnings: string[] = [];
export function warn(message: string) {
	warnings.push(message);
}
