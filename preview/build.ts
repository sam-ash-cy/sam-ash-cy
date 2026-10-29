// Regenerates README.md and every image in assets/imgs/ from profile.config.ts.
// Usage: bun run build            (reuses downloaded icons)
//        bun run build --refresh-icons
import config from "../profile.config";
import { buildBadges } from "./generators/badges";
import { buildCodeRain } from "./generators/code-rain";
import { buildHeader } from "./generators/header";
import { buildIcons } from "./generators/icons";
import { buildProjectCards } from "./generators/project-cards";
import { buildReadme } from "./generators/readme";
import { warnings } from "./lib";

const refresh = process.argv.includes("--refresh-icons");

const [icons, badges, cards] = await Promise.all([
	buildIcons(config, refresh),
	buildBadges(config),
	buildProjectCards(config),
	buildHeader(config),
	buildCodeRain(config),
]);
// README last, so it never points at an image that failed to build.
await buildReadme(config);

console.log(`Built README.md, header, code rain, ${badges} badges, ${cards} project cards (${icons} icons downloaded).`);
for (const message of warnings) {
	console.warn(`warning: ${message}`);
}
