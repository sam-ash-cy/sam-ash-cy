// Writes README.md from the config.
import { join } from "node:path";
import type { ProfileConfig, Section } from "../config-types";
import { escape, root } from "../lib";

const img = "./assets/imgs";

function about(config: ProfileConfig) {
	const paragraphs = config.about.map((p) => `<p>${p.label ? `<b>${escape(p.label)}</b> ` : ""}${escape(p.text)}</p>`);
	return `## ${config.headings.about}\n\n${paragraphs.join("\n\n")}`;
}

function certs(config: ProfileConfig) {
	const badges = config.certs.map((c) => {
		const alt = escape(`${c.name} (${c.inProgress ? "in progress" : c.year})`);
		return `<img src="${img}/badges/${c.id}.svg" height="28" alt="${alt}" title="${alt}" />`;
	});
	return `## ${config.headings.certs}\n\n<p>\n${badges.join("\n")}\n</p>`;
}

function projects(config: ProfileConfig) {
	const cards = config.projects.map((p) => {
		const alt = escape(`${p.name}${p.inProgress ? " (in progress)" : ""}: ${p.description}`);
		const image = `<img src="${img}/projects/${p.id}.svg" width="49%" alt="${alt}" />`;
		return `  ${p.url ? `<a href="${p.url}">${image}</a>` : image}`;
	});
	return `## ${config.headings.projects}\n\n<p align="center">\n${cards.join("\n")}\n</p>`;
}

function stack(config: ProfileConfig) {
	const groups = config.stack.map((group) => {
		const rows: string[] = [];
		if (group.icons?.length) {
			rows.push(`<p>\n${group.icons.map((i) => `<img src="${img}/icons/${i.id}.svg" width="48" height="48" alt="${escape(i.name)}" title="${escape(i.name)}" />`).join("\n")}\n</p>`);
		}
		if (group.pills?.length) {
			rows.push(`<p>\n${group.pills.map((p) => `<img src="${img}/badges/${p.id}.svg" height="20" alt="${escape(p.name)}" title="${escape(p.name)}" />`).join("\n")}\n</p>`);
		}
		return `### ${group.title}\n\n${rows.join("\n\n")}`;
	});
	return `## ${config.headings.stack}\n\n${groups.join("\n\n")}`;
}

// The only third-party image: it needs live GitHub data, so it cannot be generated ahead of time.
function streak(config: ProfileConfig) {
	const t = config.theme;
	const params = new URLSearchParams({
		user: config.githubUser,
		background: t.background,
		border: t.border,
		stroke: t.border,
		ring: t.accent,
		fire: t.accent,
		currStreakNum: t.text,
		sideNums: t.text,
		currStreakLabel: t.accent,
		sideLabels: t.muted,
		dates: t.dim,
		border_radius: "10",
	});
	return `<p align="center">\n  <img src="https://streak-stats.demolab.com/?${params.toString().replace(/&/g, "&amp;")}" alt="GitHub contribution streak" width="100%" />\n</p>`;
}

const sections: Record<Section, (config: ProfileConfig) => string> = { about, certs, projects, stack, streak };

export function buildReadme(config: ProfileConfig) {
	const rain = `<img src="${img}/code-rain.svg" width="100%" alt="" />`;
	const parts = [
		"<!-- Generated from profile.config.ts by `bun run build`. Edit the config, not this file: changes here are overwritten. -->",
		`<p align="center">\n  <img src="${img}/terminal-header.svg" alt="${escape(`Terminal session: whoami — ${config.header.name}, ${config.header.role}`)}" width="100%" />\n</p>`,
		`<p align="center">\n  <a href="${config.linkedin.url}"><img src="${img}/badges/linkedin.svg" height="${config.linkedin.height}" alt="${escape(`${config.linkedin.label}: ${config.linkedin.handle}`)}" /></a>\n</p>`,
		...(config.codeRain.positions.includes("top") ? [rain] : []),
		...config.sectionOrder.map((s) => sections[s](config)),
		...(config.codeRain.positions.includes("bottom") ? [rain] : []),
	];
	return Bun.write(join(root, "README.md"), parts.join("\n\n") + "\n");
}
