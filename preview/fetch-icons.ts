// Downloads the tech-stack icons into assets/imgs/icons/ so the README never depends on a third-party image host.
// Icons are from tandpfun/skill-icons (MIT, licence copied alongside). Run with: bun preview/fetch-icons.ts
import { join } from "node:path";

const source = "https://raw.githubusercontent.com/tandpfun/skill-icons/main";

// Local filename -> skill-icons filename.
const icons: Record<string, string> = {
	php: "PHP-Dark", javascript: "JavaScript", typescript: "TypeScript", python: "Python-Dark", csharp: "CS",
	java: "Java-Dark", c: "C", cpp: "CPP", html: "HTML", css: "CSS", sass: "Sass", bash: "Bash-Dark",
	laravel: "Laravel-Dark", wordpress: "Wordpress", vue: "VueJS-Dark", nuxt: "NuxtJS-Dark", pinia: "Pinia-Dark",
	react: "React-Dark", nodejs: "NodeJS-Dark", bun: "Bun-Dark", dotnet: "DotNet", fastapi: "FastAPI",
	tailwind: "TailwindCSS-Dark", alpinejs: "AlpineJS-Dark", threejs: "ThreeJS-Dark", vite: "Vite-Dark",
	vitest: "Vitest-Dark", graphql: "GraphQL-Dark", apollo: "Apollo", discordjs: "DiscordJS-Dark",
	mysql: "MySQL-Dark", postgres: "PostgreSQL-Dark", mongodb: "MongoDB", dynamodb: "DynamoDB-Dark",
	aws: "AWS-Dark", terraform: "Terraform-Dark", docker: "Docker", githubactions: "GithubActions-Dark",
	git: "Git", github: "Github-Dark", linux: "Linux-Dark",
};

const dir = join(import.meta.dir, "..", "assets", "imgs", "icons");

for (const [name, file] of Object.entries(icons)) {
	const res = await fetch(`${source}/icons/${file}.svg`);
	if (!res.ok) {
		throw new Error(`${file}.svg: HTTP ${res.status}`);
	}
	await Bun.write(join(dir, `${name}.svg`), await res.text());
}

const licence = await fetch(`${source}/LICENSE`);
await Bun.write(join(dir, "LICENSE-skill-icons"), await licence.text());

console.log(`Wrote ${Object.keys(icons).length} icons to assets/imgs/icons/`);
