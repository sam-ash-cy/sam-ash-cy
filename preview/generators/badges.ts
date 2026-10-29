// LinkedIn button, certification badges and tech pills. Logos come from Simple Icons (CC0).
import { join } from "node:path";
import type { ProfileConfig, Theme } from "../config-types";
import { escape, imgs, monoFont } from "../lib";

const simpleIcons = "https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons";
const dir = join(imgs, "badges");
const logoCache = new Map<string, string>();

async function logoPath(slug: string) {
	if (!logoCache.has(slug)) {
		const res = await fetch(`${simpleIcons}/${slug}.svg`);
		const d = (await res.text()).match(/ d="([^"]+)"/)?.[1];
		if (!res.ok || !d) {
			throw new Error(`Simple Icons has no logo "${slug}" (HTTP ${res.status}). Check the slug at https://simpleicons.org.`);
		}
		logoCache.set(slug, d);
	}
	return logoCache.get(slug)!;
}

// Large two-part badge, same layout as shields.io "for-the-badge". Monospace keeps the width exact.
async function bigBadge(theme: Theme, label: string, message: string, labelColor: string, logo?: string) {
	const charWidth = 7.2;
	const pad = 10;
	const logoSize = 14;
	const logoSpace = logo ? logoSize + 6 : 0;
	const labelWidth = pad * 2 + logoSpace + label.length * charWidth;
	const width = Math.ceil(labelWidth + pad * 2 + message.length * charWidth);
	const logoMarkup = logo
		? `<svg x="${pad}" y="7" width="${logoSize}" height="${logoSize}" viewBox="0 0 24 24"><path fill="#fff" d="${await logoPath(logo)}"/></svg>`
		: "";
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="28" role="img" aria-label="${escape(label)}: ${escape(message)}">
	<rect width="${labelWidth}" height="28" fill="#${labelColor}"/>
	<rect x="${labelWidth}" width="${width - labelWidth}" height="28" fill="#${theme.background}"/>
	${logoMarkup}
	<g font-family="${monoFont}" font-size="10" font-weight="700" letter-spacing="1.2" fill="#fff">
		<text x="${pad + logoSpace}" y="18">${escape(label.toUpperCase())}</text>
		<text x="${labelWidth + pad}" y="18">${escape(message.toUpperCase())}</text>
	</g>
</svg>
`;
}

// Small single-colour pill, same layout as shields.io "flat-square".
async function pill(theme: Theme, text: string, logo?: string, logoColor = "fff") {
	const pad = 6;
	const logoSize = 14;
	const logoSpace = logo ? logoSize + 4 : 0;
	const width = Math.ceil(pad * 2 + logoSpace + text.length * 6.6);
	const logoMarkup = logo
		? `<svg x="${pad}" y="3" width="${logoSize}" height="${logoSize}" viewBox="0 0 24 24"><path fill="#${logoColor}" d="${await logoPath(logo)}"/></svg>`
		: "";
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="${escape(text)}">
	<rect width="${width}" height="20" fill="#${theme.border}"/>
	${logoMarkup}
	<text x="${pad + logoSpace}" y="14" font-family="${monoFont}" font-size="11" fill="#fff">${escape(text)}</text>
</svg>
`;
}

export async function buildBadges(config: ProfileConfig) {
	const { theme: t } = config;
	const writes: Promise<number>[] = [];

	writes.push(Bun.write(join(dir, "linkedin.svg"), await bigBadge(t, config.linkedin.label, config.linkedin.handle, t.accent)));

	for (const cert of config.certs) {
		const label = cert.inProgress ? "in progress" : String(cert.year ?? "");
		const color = cert.inProgress ? t.warning : t.accent;
		writes.push(Bun.write(join(dir, `${cert.id}.svg`), await bigBadge(t, label, cert.badgeText, color, cert.logo)));
	}

	for (const group of config.stack) {
		for (const p of group.pills ?? []) {
			writes.push(Bun.write(join(dir, `${p.id}.svg`), await pill(t, p.name, p.logo, p.logoColor)));
		}
	}

	await Promise.all(writes);
	return writes.length;
}
