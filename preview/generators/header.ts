// Animated terminal header: whoami -> name, role command -> role, headlines command -> cycling headlines.
import { join } from "node:path";
import type { ProfileConfig } from "../config-types";
import { escape, imgs, monoFont, monoWidth, warn } from "../lib";

const width = 1000;
const height = 380;
const commandSize = 15;
const headlineSize = 20;
const sessionX = 250;
// The session sits between the two code columns; text wider than this is clipped.
const sessionWidth = 514;
const streamLine = 16;
const streamTop = 64;
const streamVisible = 316;

function stream(id: string, x: number, lines: string[], className: string) {
	const text = lines.map((line, i) => `<text x="${x}" y="${streamTop + i * streamLine}" xml:space="preserve">${escape(line)}</text>`).join("\n\t\t\t");
	return `<g id="${id}" class="mono ${className}">\n\t\t\t${text}\n\t\t</g>`;
}

// Enough stacked copies to always fill the column, so the scroll loops without a gap.
function streamCopies(id: string, loop: number) {
	const copies = Math.ceil(streamVisible / loop) + 1;
	return Array.from({ length: copies }, (_, i) => `<use href="#${id}"${i ? ` y="${i * loop}"` : ""} />`).join("\n\t\t\t\t");
}

export function buildHeader(config: ProfileConfig) {
	const { theme: t, header: h } = config;
	const promptWidth = monoWidth(h.prompt.length + 1, commandSize);
	const commandX = sessionX + promptWidth;

	// Each command is uncovered one character per step by a background-coloured block sliding right.
	const typed = (command: string, y: number, delay: number) => {
		const coverWidth = Math.ceil(monoWidth(command.length, commandSize)) + 2;
		const duration = Math.max(0.5, command.length * 0.065).toFixed(2);
		return {
			end: delay + Number(duration),
			markup: `<text x="${sessionX}" y="${y}"><tspan class="prompt">${escape(h.prompt)} </tspan><tspan class="cmd">${escape(command)}</tspan></text>
		<rect class="cover type" x="${commandX}" y="${y - 14}" width="${coverWidth}" height="20" fill="#${t.background}" style="--w: ${coverWidth}px; animation-duration: ${duration}s; animation-delay: ${delay}s; animation-timing-function: steps(${command.length});" />`,
		};
	};

	const whoami = typed("whoami", 88, 0.4);
	const nameDelay = whoami.end + 0.2;
	const roleCmdDelay = nameDelay + 0.6;
	const roleCmd = typed(h.roleCommand, 182, roleCmdDelay + 0.3);
	const roleDelay = roleCmd.end + 0.3;
	const headCmdDelay = roleDelay + 0.6;
	const headCmd = typed(h.headlinesCommand, 278, headCmdDelay + 0.3);
	const headlinesDelay = headCmd.end + 0.3;

	const cycle = h.headlines.length * h.headlineSeconds;
	const slot = 100 / h.headlines.length;
	const headlines = h.headlines.map((headline, i) => {
		if (monoWidth(headline.length + 2, headlineSize) > sessionWidth) {
			warn(`header: headline "${headline}" is too long and will be clipped (max ${Math.floor(sessionWidth / (headlineSize * 0.6)) - 2} characters).`);
		}
		const delay = (headlinesDelay + i * h.headlineSeconds).toFixed(1);
		return `<text x="${sessionX}" y="309" class="focus cycle${i === 0 ? " cycle-first" : ""}" style="animation-delay: ${delay}s;"><tspan class="prompt">&gt; </tspan>${escape(headline)}</text>`;
	}).join("\n\t\t");

	for (const [label, text, size] of [["name", h.name, 38], ["role", h.role, 22]] as const) {
		if (monoWidth(text.length, size) * 1.05 > sessionWidth) {
			warn(`header: ${label} "${text}" is too long for the terminal and will be clipped.`);
		}
	}

	const leftLoop = h.leftStream.length * streamLine;
	const rightLoop = h.rightStream.length * streamLine;
	const cursorX = Math.round(sessionX + monoWidth(h.prompt.length + 1, commandSize));

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escape(h.name)} — ${escape(h.role)}">
	<!-- Generated from profile.config.ts by preview/generators/header.ts. Plain SVG + CSS only: GitHub's image proxy strips scripts and blocks web fonts. -->
	<style>
		.mono { font-family: ${monoFont}; }
		.prompt { fill: #${t.accent}; font-size: ${commandSize}px; }
		.cmd { fill: #${t.text}; font-size: ${commandSize}px; }
		.name { fill: #${t.text}; font-size: 38px; font-weight: 700; }
		.role { fill: #${t.text}; font-size: 22px; font-weight: 600; }
		.focus { fill: #${t.text}; font-size: ${headlineSize}px; font-weight: 600; }
		.focus .prompt { font-size: ${headlineSize}px; }
		.code { fill: #${t.accent}; font-size: 11px; opacity: 0.32; }
		.code-alt { fill: #${t.muted}; font-size: 11px; opacity: 0.4; }
		.title { fill: #${t.muted}; font-size: 12px; }

		.show { opacity: 0; animation: show 0.01s linear forwards; }
		.fade { opacity: 0; animation: fade 0.5s ease-out forwards; }
		@keyframes show { to { opacity: 1; } }
		@keyframes fade { to { opacity: 1; } }

		.type { animation-name: type; animation-fill-mode: forwards; }
		@keyframes type { to { transform: translateX(var(--w)); } }

		.cycle { opacity: 0; animation: cycle ${cycle}s linear infinite; }
		@keyframes cycle { 0% { opacity: 0; } ${(slot * 0.1).toFixed(2)}% { opacity: 1; } ${(slot * 0.9).toFixed(2)}% { opacity: 1; } ${slot.toFixed(2)}% { opacity: 0; } 100% { opacity: 0; } }

		.cursor { animation: blink 1s steps(1) infinite; }
		@keyframes blink { 50% { opacity: 0; } }

		.up { animation: up ${(leftLoop / 13).toFixed(1)}s linear infinite; }
		.down { animation: down ${(rightLoop / 11).toFixed(1)}s linear infinite; }
		@keyframes up { from { transform: translateY(0); } to { transform: translateY(-${leftLoop}px); } }
		@keyframes down { from { transform: translateY(-${rightLoop}px); } to { transform: translateY(0); } }

		@media (prefers-reduced-motion: reduce) {
			* { animation: none !important; }
			.show, .fade, .cycle-first { opacity: 1; }
			.cover { display: none; }
		}
	</style>

	<defs>
		<clipPath id="frame"><rect x="10" y="10" width="980" height="360" rx="10" /></clipPath>
		<clipPath id="colL"><rect x="24" y="48" width="196" height="${streamVisible}" /></clipPath>
		<clipPath id="colR"><rect x="780" y="48" width="196" height="${streamVisible}" /></clipPath>
		<clipPath id="centre"><rect x="236" y="48" width="528" height="${streamVisible}" /></clipPath>
		<linearGradient id="fadeV" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#fff" stop-opacity="0" />
			<stop offset="0.18" stop-color="#fff" stop-opacity="1" />
			<stop offset="0.82" stop-color="#fff" stop-opacity="1" />
			<stop offset="1" stop-color="#fff" stop-opacity="0" />
		</linearGradient>
		<mask id="fadeMask" maskUnits="userSpaceOnUse" x="0" y="48" width="1000" height="${streamVisible}">
			<rect x="0" y="48" width="1000" height="${streamVisible}" fill="url(#fadeV)" />
		</mask>
		${stream("streamL", 28, h.leftStream, "code")}
		${stream("streamR", 784, h.rightStream, "code-alt")}
	</defs>

	<rect x="10" y="10" width="980" height="360" rx="10" fill="#${t.background}" stroke="#${t.border}" />
	<g clip-path="url(#frame)">
		<rect x="10" y="10" width="980" height="30" fill="#${t.surface}" />
		<line x1="10" y1="40" x2="990" y2="40" stroke="#${t.border}" />
	</g>
	<circle cx="30" cy="25" r="6" fill="#ff5f56" />
	<circle cx="50" cy="25" r="6" fill="#ffbd2e" />
	<circle cx="70" cy="25" r="6" fill="#27c93f" />
	<text x="500" y="29" text-anchor="middle" class="mono title">${escape(h.windowTitle)}</text>

	<g mask="url(#fadeMask)">
		<g clip-path="url(#colL)">
			<g class="up">
				${streamCopies("streamL", leftLoop)}
			</g>
		</g>
		<g clip-path="url(#colR)">
			<g class="down">
				${streamCopies("streamR", rightLoop)}
			</g>
		</g>
	</g>
	<line x1="228" y1="56" x2="228" y2="356" stroke="#${t.border}" stroke-dasharray="2 4" />
	<line x1="772" y1="56" x2="772" y2="356" stroke="#${t.border}" stroke-dasharray="2 4" />

	<g clip-path="url(#centre)" class="mono">
		${whoami.markup}

		<text x="${sessionX}" y="138" class="name fade" style="animation-delay: ${nameDelay.toFixed(1)}s;">${escape(h.name)}</text>

		<g class="show" style="animation-delay: ${roleCmdDelay.toFixed(1)}s;">
		${roleCmd.markup}
		</g>

		<text x="${sessionX}" y="220" class="role fade" style="animation-delay: ${roleDelay.toFixed(1)}s;">${escape(h.role)}</text>

		<g class="show" style="animation-delay: ${headCmdDelay.toFixed(1)}s;">
		${headCmd.markup}
		</g>

		${headlines}

		<g class="show" style="animation-delay: ${headlinesDelay.toFixed(1)}s;">
			<text x="${sessionX}" y="342" class="prompt">${escape(h.prompt)}</text>
			<rect class="cursor" x="${cursorX}" y="329" width="9" height="17" fill="#${t.accent}" />
		</g>
	</g>
</svg>
`;
	return Bun.write(join(imgs, "terminal-header.svg"), svg);
}
