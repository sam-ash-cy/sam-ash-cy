// Full-width strip of falling code.
import { join } from "node:path";
import type { ProfileConfig } from "../config-types";
import { escape, imgs, monoFont, rng } from "../lib";

const width = 1000;
const rowHeight = 15;

export function buildCodeRain(config: ProfileConfig) {
	const { theme: t, codeRain: c } = config;
	const random = rng(c.seed);
	// Each lane is drawn twice, one loop apart, so the fall repeats seamlessly; the loop must exceed the strip height.
	const rows = Math.ceil(c.height / rowHeight) + 12;
	const loop = rows * rowHeight;
	const laneCount = Math.floor(width / c.laneGap);

	const lanes = Array.from({ length: laneCount }, (_, i) => {
		const x = c.laneGap / 2 + i * c.laneGap;
		const duration = (8 + random() * 10).toFixed(1);
		const delay = (-random() * 15).toFixed(1);
		const glyphs = Array.from({ length: rows }, (_, row) => {
			const token = c.tokens[Math.floor(random() * c.tokens.length)];
			const bright = random() < 0.1;
			const opacity = bright ? "0.85" : (0.15 + random() * 0.3).toFixed(2);
			const fill = bright ? t.accentBright : random() < 0.2 ? t.muted : t.accent;
			return `<text x="${x}" y="${row * rowHeight}" fill="#${fill}" opacity="${opacity}">${escape(token)}</text>`;
		}).join("");
		return `
		<g class="lane" style="animation-duration: ${duration}s; animation-delay: ${delay}s;">
			<g id="l${i}">${glyphs}</g>
			<use href="#l${i}" y="${-loop}" />
		</g>`;
	}).join("");

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${c.height}" width="${width}" height="${c.height}" aria-hidden="true">
	<!-- Generated from profile.config.ts by preview/generators/code-rain.ts. -->
	<style>
		text { font-family: ${monoFont}; font-size: 10px; text-anchor: middle; }
		.lane { animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; }
		@keyframes fall { from { transform: translateY(0); } to { transform: translateY(${loop}px); } }
		@media (prefers-reduced-motion: reduce) { .lane { animation: none; } }
	</style>
	<defs>
		<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#fff" stop-opacity="0" />
			<stop offset="0.2" stop-color="#fff" stop-opacity="1" />
			<stop offset="0.8" stop-color="#fff" stop-opacity="1" />
			<stop offset="1" stop-color="#fff" stop-opacity="0" />
		</linearGradient>
		<mask id="m"><rect width="${width}" height="${c.height}" fill="url(#fade)" /></mask>
	</defs>
	<g mask="url(#m)">${lanes}
	</g>
</svg>
`;
	return Bun.write(join(imgs, "code-rain.svg"), svg);
}
