// Generates the LinkedIn button, certification badges and tech pills as local SVGs in assets/imgs/badges/,
// replacing shields.io. Logos come from Simple Icons (CC0). Run with: bun preview/generate-badges.ts
import { join } from "node:path";

const simpleIcons = "https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons";
const dir = join(import.meta.dir, "..", "assets", "imgs", "badges");

// Monospace keeps text width predictable: an image SVG cannot load web fonts, so width must not depend on which font the viewer has.
const font = "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

async function logoPath(slug: string) {
	const svg = await (await fetch(`${simpleIcons}/${slug}.svg`)).text();
	const d = svg.match(/ d="([^"]+)"/)?.[1];
	if (!d) {
		throw new Error(`No path for ${slug}`);
	}
	return d;
}

function escape(text: string) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Large two-part badge, same layout as shields.io "for-the-badge".
async function bigBadge(label: string, message: string, labelColor: string, logo?: string) {
	const charWidth = 7.2;
	const pad = 10;
	const logoSize = 14;
	const logoSpace = logo ? logoSize + 6 : 0;
	const labelWidth = pad * 2 + logoSpace + label.length * charWidth;
	const messageWidth = pad * 2 + message.length * charWidth;
	const width = Math.ceil(labelWidth + messageWidth);
	const logoMarkup = logo
		? `<svg x="${pad}" y="7" width="${logoSize}" height="${logoSize}" viewBox="0 0 24 24"><path fill="#fff" d="${await logoPath(logo)}"/></svg>`
		: "";
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="28" role="img" aria-label="${escape(label)}: ${escape(message)}">
	<rect width="${labelWidth}" height="28" fill="#${labelColor}"/>
	<rect x="${labelWidth}" width="${width - labelWidth}" height="28" fill="#0d1117"/>
	${logoMarkup}
	<g font-family="${font}" font-size="10" font-weight="700" letter-spacing="1.2" fill="#fff">
		<text x="${pad + logoSpace}" y="18">${escape(label.toUpperCase())}</text>
		<text x="${labelWidth + pad}" y="18">${escape(message.toUpperCase())}</text>
	</g>
</svg>
`;
}

// Small single-colour pill, same layout as shields.io "flat-square".
async function pill(text: string, logo?: string, logoColor = "fff") {
	const charWidth = 6.6;
	const pad = 6;
	const logoSize = 14;
	const logoSpace = logo ? logoSize + 4 : 0;
	const width = Math.ceil(pad * 2 + logoSpace + text.length * charWidth);
	const logoMarkup = logo
		? `<svg x="${pad}" y="3" width="${logoSize}" height="${logoSize}" viewBox="0 0 24 24"><path fill="#${logoColor}" d="${await logoPath(logo)}"/></svg>`
		: "";
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="${escape(text)}">
	<rect width="${width}" height="20" fill="#30363d"/>
	${logoMarkup}
	<text x="${pad + logoSpace}" y="14" font-family="${font}" font-size="11" fill="#fff">${escape(text)}</text>
</svg>
`;
}

const big: Record<string, Parameters<typeof bigBadge>> = {
	"linkedin": ["LinkedIn", "samuel-ashman", "3fb950"],
	"cert-google-cybersecurity": ["in progress", "Google Cybersecurity Professional", "d29922", "google"],
	"cert-google-ai": ["2026", "Google AI Professional", "3fb950", "google"],
	"cert-ibm-cybersecurity": ["2026", "IBM Cybersecurity Fundamentals", "3fb950"],
	"cert-fortinet-fcf": ["2025", "Fortinet Certified Fundamentals in Cyber Security", "3fb950", "fortinet"],
	"cert-cyber-bootcamp": ["2024", "Cyber Security in Business Bootcamp (L3)", "3fb950"],
};

const pills: Record<string, Parameters<typeof pill>> = {
	"react-native": ["React Native", "react", "61DAFB"],
	"expo": ["Expo", "expo"],
	"ionic": ["Ionic", "ionic", "3880FF"],
	"capacitor": ["Capacitor", "capacitor", "119EFF"],
	"gsap": ["GSAP", "greensock", "88CE02"],
	"playwright": ["Playwright"],
	"algolia": ["Algolia", "algolia"],
	"meilisearch": ["Meilisearch", "meilisearch", "FF5CAA"],
	"typesense": ["Typesense"],
	"datadog": ["Datadog", "datadog"],
	"dependabot": ["Dependabot", "dependabot"],
	"jamf": ["Jamf"],
	"owasp": ["OWASP", "owasp"],
	"wireshark": ["Wireshark", "wireshark", "1679A7"],
	"metasploit": ["Metasploit", "metasploit", "2596CD"],
	"nmap": ["Nmap"],
	"autopsy": ["Autopsy"],
	"encase": ["EnCase"],
	"flipper-zero": ["Flipper Zero"],
	"bitdefender": ["Bitdefender", "bitdefender", "ED1C24"],
};

for (const [name, args] of Object.entries(big)) {
	await Bun.write(join(dir, `${name}.svg`), await bigBadge(...args));
}
for (const [name, args] of Object.entries(pills)) {
	await Bun.write(join(dir, `${name}.svg`), await pill(...args));
}

console.log(`Wrote ${Object.keys(big).length + Object.keys(pills).length} badges to assets/imgs/badges/`);
