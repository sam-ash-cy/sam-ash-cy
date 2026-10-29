// Generates assets/code-rain-left.svg and assets/code-rain-right.svg: narrow strips of falling code
// that the README floats beside the About section. Run with: bun preview/generate-code-rain.ts
import { join } from "node:path";

const width = 100;
const height = 800;
const lanes = [12, 31, 50, 69, 88];
const rowHeight = 15;
const rows = 60;
// Each lane is drawn twice, one loop apart, so the fall repeats seamlessly.
const loop = rows * rowHeight;

const tokens = [
	"$", "#", "{", "}", "()", "=>", "==", "!=", "&&", "||", "if", "fn", "let", "var", "rm", "ls", "cd",
	"ssh", "tls", "aes", "rsa", "sha", "xss", "csp", "jwt", "sql", "tcp", "443", "22", "401", "403",
	"0x0", "0xf", "1f", "a9", "7e", "c4", "ff", "00", "01", "10", "11", "<?", "?>", "/*", "*/", "//",
];

// Small seeded PRNG so regenerating gives the same output unless the seed changes.
function rng(seed: number) {
	return () => {
		seed = (seed * 1664525 + 1013904223) % 4294967296;
		return seed / 4294967296;
	};
}

function strip(seed: number) {
	const random = rng(seed);
	const laneMarkup = lanes.map((x, i) => {
		const duration = (14 + random() * 14).toFixed(1);
		const delay = (-random() * 20).toFixed(1);
		const glyphs = Array.from({ length: rows }, (_, row) => {
			const token = tokens[Math.floor(random() * tokens.length)];
			const bright = random() < 0.12;
			const opacity = bright ? 0.85 : (0.18 + random() * 0.3).toFixed(2);
			const fill = bright ? "#7ee787" : random() < 0.2 ? "#8b949e" : "#3fb950";
			return `<text x="${x}" y="${row * rowHeight}" fill="${fill}" opacity="${opacity}">${token.replace("<", "&lt;").replace(">", "&gt;").replace("&&", "&amp;&amp;")}</text>`;
		}).join("");
		return `
		<g class="lane" style="animation-duration: ${duration}s; animation-delay: ${delay}s;">
			<g id="l${seed}-${i}">${glyphs}</g>
			<use href="#l${seed}-${i}" y="${-loop}" />
		</g>`;
	}).join("");

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true">
	<style>
		text { font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 10px; text-anchor: middle; }
		.lane { animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; }
		@keyframes fall { from { transform: translateY(0); } to { transform: translateY(${loop}px); } }
		@media (prefers-reduced-motion: reduce) { .lane { animation: none; } }
	</style>
	<defs>
		<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#fff" stop-opacity="0" />
			<stop offset="0.12" stop-color="#fff" stop-opacity="1" />
			<stop offset="0.88" stop-color="#fff" stop-opacity="1" />
			<stop offset="1" stop-color="#fff" stop-opacity="0" />
		</linearGradient>
		<mask id="m"><rect width="${width}" height="${height}" fill="url(#fade)" /></mask>
	</defs>
	<g mask="url(#m)">${laneMarkup}
	</g>
</svg>
`;
}

const assets = join(import.meta.dir, "..", "assets");
await Bun.write(join(assets, "code-rain-left.svg"), strip(7));
await Bun.write(join(assets, "code-rain-right.svg"), strip(42));
console.log("Wrote assets/code-rain-left.svg and assets/code-rain-right.svg");
