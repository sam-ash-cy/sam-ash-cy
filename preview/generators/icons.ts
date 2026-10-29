// Stack icons from tandpfun/skill-icons (MIT, licence copied alongside). Already-downloaded icons are reused,
// so builds work offline; pass --refresh-icons to download them all again.
import { join } from "node:path";
import type { ProfileConfig } from "../config-types";
import { imgs } from "../lib";

const source = "https://raw.githubusercontent.com/tandpfun/skill-icons/main";
const dir = join(imgs, "icons");

export async function buildIcons(config: ProfileConfig, refresh: boolean) {
	let downloaded = 0;
	const icons = config.stack.flatMap((group) => group.icons ?? []);
	for (const icon of icons) {
		const target = Bun.file(join(dir, `${icon.id}.svg`));
		if (!refresh && (await target.exists())) {
			continue;
		}
		const res = await fetch(`${source}/icons/${icon.skillIcon}.svg`);
		if (!res.ok) {
			throw new Error(`skill-icons has no "${icon.skillIcon}.svg" (HTTP ${res.status}). Check names at https://github.com/tandpfun/skill-icons/tree/main/icons.`);
		}
		await Bun.write(target, await res.text());
		downloaded++;
	}
	const licence = Bun.file(join(dir, "LICENSE-skill-icons"));
	if (refresh || !(await licence.exists())) {
		await Bun.write(licence, await (await fetch(`${source}/LICENSE`)).text());
	}
	return downloaded;
}
