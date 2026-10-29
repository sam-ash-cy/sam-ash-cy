// Generates the Featured Projects cards as local SVGs in assets/imgs/projects/.
// Run with: bun preview/generate-project-cards.ts
import { join } from "node:path";

type Project = {
	file: string;
	name: string;
	description: string;
	tech: string[];
	inProgress?: boolean;
};

const projects: Project[] = [
	{
		file: "dual-check-2fa",
		name: "Dual Check 2FA",
		description: "Open-source WordPress plugin adding email-based two-factor authentication, with hashed single-use codes, IP-aware lockout and trusted devices.",
		tech: ["PHP", "WordPress"],
	},
	{
		file: "vs-sound",
		name: "VS Sound",
		description: "VS Code extension that plays configurable sounds for diagnostics, tasks, saves, debug sessions and Git events.",
		tech: ["TypeScript", "VS Code API"],
	},
	{
		file: "discord-bot",
		name: "Discord Bot",
		description: "Open-source bot template with role-gated moderation commands, logging, polls and switchable JSON or MongoDB storage.",
		tech: ["Node.js", "discord.js", "MongoDB"],
	},
	{
		file: "aws-security-lab",
		name: "AWS Security Lab",
		description: "Containerised platform for emulating AWS services and testing security controls locally.",
		tech: ["Python", "FastAPI", "PostgreSQL", "Terraform"],
		inProgress: true,
	},
	{
		file: "mini-siem",
		name: "Mini SIEM for Windows",
		description: "Host event ingestion, a threshold-based rule engine and a React dashboard for managing alerts.",
		tech: ["C#", "ASP.NET Core", "React"],
		inProgress: true,
	},
];

const width = 440;
const height = 160;
const pad = 20;
// GitHub's own UI font stack, so the cards read like normal README text.
const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif";
const descSize = 12;
// Average character width for the sans stack; an image SVG cannot measure or reflow text, so wrapping is estimated here.
const charWidth = descSize * 0.55;
const maxChars = Math.floor((width - pad * 2) / charWidth);

function escape(text: string) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrap(text: string) {
	const lines: string[] = [];
	let line = "";
	for (const word of text.split(" ")) {
		if ((line + " " + word).trim().length > maxChars) {
			lines.push(line);
			line = word;
		} else {
			line = (line + " " + word).trim();
		}
	}
	lines.push(line);
	return lines.slice(0, 3);
}

function card(project: Project) {
	const status = project.inProgress
		? `<rect x="${width - pad - 96}" y="18" width="96" height="20" rx="10" fill="none" stroke="#d29922"/>
	<text x="${width - pad - 48}" y="32" text-anchor="middle" font-size="11" fill="#d29922">in progress</text>`
		: `<text x="${width - pad}" y="32" text-anchor="end" font-size="12" font-weight="600" fill="#3fb950">View Repo →</text>`;
	const description = wrap(project.description)
		.map((line, i) => `<text x="${pad}" y="${66 + i * 18}" font-size="${descSize}" fill="#c9d1d9">${escape(line)}</text>`)
		.join("\n\t");

	let tagX = pad;
	const tags = project.tech.map((tech) => {
		const tagWidth = Math.ceil(tech.length * 6.4 + 16);
		const markup = `<rect x="${tagX}" y="${height - 36}" width="${tagWidth}" height="20" rx="10" fill="#3fb950" fill-opacity="0.12"/>
	<text x="${tagX + tagWidth / 2}" y="${height - 22}" text-anchor="middle" font-size="11" fill="#3fb950">${escape(tech)}</text>`;
		tagX += tagWidth + 6;
		return markup;
	}).join("\n\t");

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escape(project.name)}: ${escape(project.description)}">
	<g font-family="${font}">
	<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="10" fill="#0d1117" stroke="#30363d"/>
	<rect x="0.5" y="0.5" width="4" height="${height - 1}" rx="2" fill="#3fb950"/>
	<text x="${pad}" y="33" font-size="16" font-weight="700" fill="#e6edf3">${escape(project.name)}</text>
	${status}
	${description}
	${tags}
	</g>
</svg>
`;
}

const dir = join(import.meta.dir, "..", "assets", "imgs", "projects");
for (const project of projects) {
	await Bun.write(join(dir, `${project.file}.svg`), card(project));
}
console.log(`Wrote ${projects.length} project cards to assets/imgs/projects/`);
