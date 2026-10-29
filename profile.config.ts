// Single source of truth for the GitHub profile.
// Edit this file, then run `bun run build` (the dev server does this for you on save).
// README.md and everything in assets/imgs/ are generated from it, so edit here rather than there.
import type { ProfileConfig } from "./preview/config-types";

export default {
	githubUser: "sam-ash-cy",

	// Hex colours without "#". Used by every generated image and the streak card.
	theme: {
		accent: "3fb950",
		accentBright: "7ee787",
		background: "0d1117",
		surface: "161b22",
		border: "30363d",
		text: "e6edf3",
		body: "c9d1d9",
		muted: "8b949e",
		dim: "6e7681",
		warning: "d29922",
	},

	header: {
		name: "Samuel Ashman",
		role: "Full Stack Developer",
		prompt: "sam@ashman:~$",
		windowTitle: "sam@ashman: ~/profile — zsh",
		roleCommand: "cat role.txt",
		headlinesCommand: "./skills-headlines",
		headlines: [
			"Cyber Security",
			"Full Stack Web Development",
			"Cloud and Developer Operations",
			"Programming",
			"Application Development/Architecture",
		],
		headlineSeconds: 3,
		leftStream: [
			"$ nmap -sV 10.0.0.12",
			"PORT    STATE  SERVICE",
			"22/tcp  open   ssh",
			"443/tcp open   https",
			"$ tail -f auth.log",
			"Failed password: root",
			"fail2ban: ban 203.0.113.7",
			"$ terraform plan",
			"+ aws_kms_key.audit",
			"+ aws_s3_bucket.logs",
			"Plan: 4 to add, 0 change",
			"$ gh api /dependabot",
			"alerts: 0 open",
			"$ openssl s_client",
			"Verify return code: 0",
			"$ sha256sum release.zip",
			"9f86d081884c7d65...",
			"$ ufw status: active",
		],
		rightStream: [
			"function verify($u, $c) {",
			"  $h = get_hash($u);",
			"  if (!hash_equals(",
			"    $h, hash('sha256', $c)",
			"  )) {",
			"    lockout($u, $ip);",
			"    return false;",
			"  }",
			"  consume($u);",
			"  return true;",
			"}",
			"const csp = [",
			"  \"default-src 'self'\",",
			"  \"frame-ancestors 'none'\",",
			"].join('; ');",
			"SELECT id FROM users",
			" WHERE email = ?;",
			"// prepared, never concat",
		],
	},

	linkedin: {
		url: "https://www.linkedin.com/in/samuel-ashman/",
		label: "LinkedIn",
		handle: "samuel-ashman",
		// Height in px on the profile; the width scales with it.
		height: 44,
	},

	codeRain: {
		positions: ["top", "bottom"],
		height: 180,
		laneGap: 22,
		// Change the seed for a different random pattern.
		seed: 7,
		tokens: [
			"$", "#", "{", "}", "()", "=>", "==", "!=", "&&", "||", "if", "fn", "let", "var", "rm", "ls", "cd",
			"ssh", "tls", "aes", "rsa", "sha", "xss", "csp", "jwt", "sql", "tcp", "443", "22", "401", "403",
			"0x0", "0xf", "1f", "a9", "7e", "c4", "ff", "00", "01", "10", "11", "<?", "?>", "/*", "*/", "//",
		],
	},

	// Order of sections below the header. Remove one to hide it.
	sectionOrder: ["about", "certs", "projects", "stack", "streak"],

	headings: {
		about: "WHO AM I?",
		certs: "My Tech Certifications",
		projects: "Featured Projects",
		stack: "Full Tech Stack",
	},

	about: [
		{ text: "I'm a full stack developer with a passion for Cyber Security. I enjoy finding out how things work, delving into the unknown and how to keep them safe/secure." },
		{ label: "How I got here:", text: "Java was my first language and gave me the foundations to pick up Python, C, C++, JavaScript, etc... Additionally, I can now confidently learn any programming language from learning the fundamentals of programming." },
		{ text: "I have recently gone from a BSc (Hons) in Computer Science at Swansea University to an NCSC-certified MSc in Cyber Security (Distinction) at Cardiff University, where I worked on penetration testing, malware analysis, incident response and cyber risk management." },
		{ label: "What I do:", text: "I build and secure production web platforms end to end, across WordPress, Laravel and Vue/Nuxt on AWS and Terraform, and bring security into every stage, from secure coding and hardened authentication to monitoring and incident response." },
		{ label: "What I'm working on:", text: "the Google Cybersecurity Professional Certification, hands-on labs on TryHackMe and Hack The Box, and my own security tooling, including a local AWS security lab and a mini SIEM." },
	],

	// inProgress shows an amber label; otherwise the year shows in green.
	certs: [
		{ id: "cert-google-cybersecurity", name: "Google Cybersecurity Professional Certificate", badgeText: "Google Cybersecurity Professional", inProgress: true, logo: "google" },
		{ id: "cert-google-ai", name: "Google AI Professional Certificate", badgeText: "Google AI Professional", year: 2026, logo: "google" },
		{ id: "cert-ibm-cybersecurity", name: "IBM Cybersecurity Fundamentals", badgeText: "IBM Cybersecurity Fundamentals", year: 2026 },
		{ id: "cert-fortinet-fcf", name: "Fortinet Certified Fundamentals in Cyber Security", badgeText: "Fortinet Certified Fundamentals in Cyber Security", year: 2025, logo: "fortinet" },
		{ id: "cert-cyber-bootcamp", name: "Cyber Security in Business Bootcamp, Level 3", badgeText: "Cyber Security in Business Bootcamp (L3)", year: 2024 },
	],

	// A url makes the card clickable and shows "View Repo"; inProgress shows an amber pill instead.
	projects: [
		{
			id: "dual-check-2fa",
			name: "Dual Check 2FA",
			description: "Open-source WordPress plugin adding email-based two-factor authentication, with hashed single-use codes, IP-aware lockout and trusted devices.",
			tech: ["PHP", "WordPress"],
			url: "https://github.com/sam-ash-cy/dual-check-2fa",
		},
		{
			id: "vs-sound",
			name: "VS Sound",
			description: "VS Code extension that plays configurable sounds for diagnostics, tasks, saves, debug sessions and Git events.",
			tech: ["TypeScript", "VS Code API"],
			url: "https://github.com/sam-ash-cy/VS-Sound",
		},
		{
			id: "discord-bot",
			name: "Discord Bot",
			description: "Open-source bot template with role-gated moderation commands, logging, polls and switchable JSON or MongoDB storage.",
			tech: ["Node.js", "discord.js", "MongoDB"],
			url: "https://github.com/sam-ash-cy/Discord-Bot",
		},
		{
			id: "aws-security-lab",
			name: "AWS Security Lab",
			description: "Containerised platform for emulating AWS services and testing security controls locally.",
			tech: ["Python", "FastAPI", "PostgreSQL", "Terraform"],
			inProgress: true,
		},
		{
			id: "mini-siem",
			name: "Mini SIEM for Windows",
			description: "Host event ingestion, a threshold-based rule engine and a React dashboard for managing alerts.",
			tech: ["C#", "ASP.NET Core", "React"],
			inProgress: true,
		},
	],

	// icons: large tiles from tandpfun/skill-icons (https://github.com/tandpfun/skill-icons/tree/main/icons).
	// pills: small badges, for tools skill-icons doesn't cover. logo = Simple Icons slug.
	stack: [
		{
			title: "Language Stack",
			icons: [
				{ id: "php", name: "PHP", skillIcon: "PHP-Dark" },
				{ id: "javascript", name: "JavaScript", skillIcon: "JavaScript" },
				{ id: "typescript", name: "TypeScript", skillIcon: "TypeScript" },
				{ id: "python", name: "Python", skillIcon: "Python-Dark" },
				{ id: "csharp", name: "C#", skillIcon: "CS" },
				{ id: "java", name: "Java", skillIcon: "Java-Dark" },
				{ id: "c", name: "C", skillIcon: "C" },
				{ id: "cpp", name: "C++", skillIcon: "CPP" },
				{ id: "html", name: "HTML", skillIcon: "HTML" },
				{ id: "css", name: "CSS", skillIcon: "CSS" },
				{ id: "sass", name: "Sass", skillIcon: "Sass" },
				{ id: "bash", name: "Bash", skillIcon: "Bash-Dark" },
			],
		},
		{
			title: "Framework Stack",
			icons: [
				{ id: "laravel", name: "Laravel", skillIcon: "Laravel-Dark" },
				{ id: "wordpress", name: "WordPress", skillIcon: "Wordpress" },
				{ id: "vue", name: "Vue", skillIcon: "VueJS-Dark" },
				{ id: "nuxt", name: "Nuxt", skillIcon: "NuxtJS-Dark" },
				{ id: "pinia", name: "Pinia", skillIcon: "Pinia-Dark" },
				{ id: "react", name: "React", skillIcon: "React-Dark" },
				{ id: "nodejs", name: "Node.js", skillIcon: "NodeJS-Dark" },
				{ id: "bun", name: "Bun", skillIcon: "Bun-Dark" },
				{ id: "dotnet", name: ".NET", skillIcon: "DotNet" },
				{ id: "fastapi", name: "FastAPI", skillIcon: "FastAPI" },
				{ id: "tailwind", name: "Tailwind CSS", skillIcon: "TailwindCSS-Dark" },
				{ id: "alpinejs", name: "Alpine.js", skillIcon: "AlpineJS-Dark" },
				{ id: "threejs", name: "Three.js", skillIcon: "ThreeJS-Dark" },
				{ id: "vite", name: "Vite", skillIcon: "Vite-Dark" },
				{ id: "vitest", name: "Vitest", skillIcon: "Vitest-Dark" },
				{ id: "graphql", name: "GraphQL", skillIcon: "GraphQL-Dark" },
				{ id: "apollo", name: "Apollo", skillIcon: "Apollo" },
				{ id: "discordjs", name: "discord.js", skillIcon: "DiscordJS-Dark" },
			],
			pills: [
				{ id: "react-native", name: "React Native", logo: "react", logoColor: "61DAFB" },
				{ id: "expo", name: "Expo", logo: "expo" },
				{ id: "ionic", name: "Ionic", logo: "ionic", logoColor: "3880FF" },
				{ id: "capacitor", name: "Capacitor", logo: "capacitor", logoColor: "119EFF" },
				{ id: "gsap", name: "GSAP", logo: "greensock", logoColor: "88CE02" },
				{ id: "playwright", name: "Playwright" },
			],
		},
		{
			title: "Data Engineering Stack",
			icons: [
				{ id: "mysql", name: "MySQL", skillIcon: "MySQL-Dark" },
				{ id: "postgres", name: "PostgreSQL", skillIcon: "PostgreSQL-Dark" },
				{ id: "mongodb", name: "MongoDB", skillIcon: "MongoDB" },
				{ id: "dynamodb", name: "DynamoDB", skillIcon: "DynamoDB-Dark" },
			],
			pills: [
				{ id: "algolia", name: "Algolia", logo: "algolia" },
				{ id: "meilisearch", name: "Meilisearch", logo: "meilisearch", logoColor: "FF5CAA" },
				{ id: "typesense", name: "Typesense" },
			],
		},
		{
			title: "Cloud/Devops Stack",
			icons: [
				{ id: "aws", name: "AWS", skillIcon: "AWS-Dark" },
				{ id: "terraform", name: "Terraform", skillIcon: "Terraform-Dark" },
				{ id: "docker", name: "Docker", skillIcon: "Docker" },
				{ id: "githubactions", name: "GitHub Actions", skillIcon: "GithubActions-Dark" },
				{ id: "git", name: "Git", skillIcon: "Git" },
				{ id: "github", name: "GitHub", skillIcon: "Github-Dark" },
				{ id: "linux", name: "Linux", skillIcon: "Linux-Dark" },
			],
			pills: [
				{ id: "datadog", name: "Datadog", logo: "datadog" },
				{ id: "dependabot", name: "Dependabot", logo: "dependabot" },
				{ id: "jamf", name: "Jamf" },
			],
		},
		{
			title: "Security Stack",
			pills: [
				{ id: "owasp", name: "OWASP", logo: "owasp" },
				{ id: "wireshark", name: "Wireshark", logo: "wireshark", logoColor: "1679A7" },
				{ id: "metasploit", name: "Metasploit", logo: "metasploit", logoColor: "2596CD" },
				{ id: "nmap", name: "Nmap" },
				{ id: "autopsy", name: "Autopsy" },
				{ id: "encase", name: "EnCase" },
				{ id: "flipper-zero", name: "Flipper Zero" },
				{ id: "bitdefender", name: "Bitdefender", logo: "bitdefender", logoColor: "ED1C24" },
			],
		},
	],
} satisfies ProfileConfig;
