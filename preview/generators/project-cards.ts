// Featured project cards.
import { join } from "node:path";
import type { ProfileConfig, Project, Theme } from "../config-types";
import { escape, imgs, sansFont, warn } from "../lib";

const width = 440;
const height = 160;
const pad = 20;
const descSize = 12;
const maxLines = 3;
// Average character width for the sans stack; an image SVG cannot measure or reflow text, so wrapping is estimated here.
const maxChars = Math.floor((width - pad * 2) / (descSize * 0.55));

function wrap(project: Project) {
	const lines: string[] = [];
	let line = "";
	for (const word of project.description.split(" ")) {
		if ((line + " " + word).trim().length > maxChars) {
			lines.push(line);
			line = word;
		} else {
			line = (line + " " + word).trim();
		}
	}
	lines.push(line);
	if (lines.length > maxLines) {
		warn(`projects: "${project.name}" description is too long and was cut to ${maxLines} lines (about ${maxChars * maxLines} characters max).`);
	}
	return lines.slice(0, maxLines);
}

function card(t: Theme, project: Project) {
	const status = project.inProgress
		? `<rect x="${width - pad - 96}" y="18" width="96" height="20" rx="10" fill="none" stroke="#${t.warning}"/>
	<text x="${width - pad - 48}" y="32" text-anchor="middle" font-size="11" fill="#${t.warning}">in progress</text>`
		: project.url
			? `<text x="${width - pad}" y="32" text-anchor="end" font-size="12" font-weight="600" fill="#${t.accent}">View Repo →</text>`
			: "";
	const description = wrap(project)
		.map((line, i) => `<text x="${pad}" y="${66 + i * 18}" font-size="${descSize}" fill="#${t.body}">${escape(line)}</text>`)
		.join("\n\t");

	let tagX = pad;
	const tags = project.tech.map((tech) => {
		const tagWidth = Math.ceil(tech.length * 6.4 + 16);
		const markup = `<rect x="${tagX}" y="${height - 36}" width="${tagWidth}" height="20" rx="10" fill="#${t.accent}" fill-opacity="0.12"/>
	<text x="${tagX + tagWidth / 2}" y="${height - 22}" text-anchor="middle" font-size="11" fill="#${t.accent}">${escape(tech)}</text>`;
		tagX += tagWidth + 6;
		return markup;
	}).join("\n\t");
	if (tagX > width - pad) {
		warn(`projects: "${project.name}" has too many tech tags to fit on one line.`);
	}

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escape(project.name)}: ${escape(project.description)}">
	<!-- Generated from profile.config.ts by preview/generators/project-cards.ts. -->
	<g font-family="${sansFont}">
	<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="10" fill="#${t.background}" stroke="#${t.border}"/>
	<rect x="0.5" y="0.5" width="4" height="${height - 1}" rx="2" fill="#${t.accent}"/>
	<text x="${pad}" y="33" font-size="16" font-weight="700" fill="#${t.text}">${escape(project.name)}</text>
	${status}
	${description}
	${tags}
	</g>
</svg>
`;
}

export async function buildProjectCards(config: ProfileConfig) {
	await Promise.all(config.projects.map((p) => Bun.write(join(imgs, "projects", `${p.id}.svg`), card(config.theme, p))));
	return config.projects.length;
}
