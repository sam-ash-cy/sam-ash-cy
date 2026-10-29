import { watch } from "node:fs";
import { join, normalize } from "node:path";
import { marked } from "marked";

const root = join(import.meta.dir, "..");
const port = Number(process.env.PORT ?? 3030);

const clients = new Set<ReadableStreamDefaultController>();

// GitHub renders profile READMEs as GFM without soft line breaks, so mirror that here.
marked.setOptions({ gfm: true, breaks: false });

function page(body: string, theme: string) {
	const other = theme === "dark" ? "light" : "dark";
	const bg = theme === "dark" ? "#0d1117" : "#ffffff";
	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Profile preview (${theme})</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown-${theme}.min.css">
	<style>
		body { background: ${bg}; margin: 0; }
		.markdown-body { max-width: 896px; margin: 0 auto; padding: 32px 16px; }
		.bar { position: fixed; top: 8px; right: 8px; font: 12px ui-monospace, Menlo, monospace; z-index: 1; }
		.bar a { padding: 4px 8px; border: 1px solid #30363d; border-radius: 6px; background: #161b22; color: #e6edf3; text-decoration: none; }
	</style>
</head>
<body>
	<div class="bar"><a href="/?theme=${other}">${other} mode</a></div>
	<article class="markdown-body">${body}</article>
	<script>
		new EventSource("/__reload").onmessage = () => location.reload();
	</script>
</body>
</html>`;
}

function notifyClients() {
	for (const client of clients) {
		try {
			client.enqueue("data: reload\n\n");
		} catch {
			clients.delete(client);
		}
	}
}

// Heartbeat keeps the reload stream open through proxies and Docker port forwarding.
setInterval(() => {
	for (const client of clients) {
		try {
			client.enqueue(": ping\n\n");
		} catch {
			clients.delete(client);
		}
	}
}, 5000);

// Editors often fire several events per save; collapse them into one reload.
let reloadTimer: Timer | undefined;
function scheduleReload() {
	clearTimeout(reloadTimer);
	reloadTimer = setTimeout(notifyClients, 100);
}
watch(join(root, "assets"), { recursive: true }, scheduleReload);

// Rebuild README.md and assets whenever the config or a generator changes; the watchers above then reload the page.
let building = false;
let buildQueued = false;
async function rebuild() {
	if (building) {
		buildQueued = true;
		return;
	}
	building = true;
	const proc = Bun.spawn(["bun", join(root, "preview", "build.ts")], { cwd: root, stdout: "inherit", stderr: "inherit" });
	await proc.exited;
	building = false;
	if (buildQueued) {
		buildQueued = false;
		rebuild();
	}
}

let buildTimer: Timer | undefined;
function scheduleBuild() {
	clearTimeout(buildTimer);
	buildTimer = setTimeout(rebuild, 150);
}

// Watch folders, not single files: many editors save by replacing the file, which silently ends a watch on the file itself.
watch(root, (_, filename) => {
	if (filename === "README.md") {
		scheduleReload();
	} else if (filename === "profile.config.ts") {
		scheduleBuild();
	}
});
watch(join(root, "preview"), { recursive: true }, (_, filename) => {
	if (filename === "lib.ts" || filename === "config-types.ts" || filename?.startsWith("generators")) {
		scheduleBuild();
	}
});
rebuild();

Bun.serve({
	port,
	async fetch(req, server) {
		const url = new URL(req.url);

		if (url.pathname === "/__reload") {
			// The reload stream sits idle between saves; Bun would otherwise close it after 10 seconds.
			server.timeout(req, 0);
			let self: ReadableStreamDefaultController;
			const stream = new ReadableStream({
				start(controller) {
					self = controller;
					clients.add(controller);
					controller.enqueue(": connected\n\n");
				},
				cancel() {
					clients.delete(self);
				},
			});
			return new Response(stream, {
				headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
			});
		}

		if (url.pathname === "/") {
			const theme = url.searchParams.get("theme") === "light" ? "light" : "dark";
			const markdown = await Bun.file(join(root, "README.md")).text();
			return new Response(page(await marked.parse(markdown), theme), {
				headers: { "Content-Type": "text/html; charset=utf-8" },
			});
		}

		// Only serve the folder the README references, so .git and other repo files stay private.
		const filePath = normalize(join(root, decodeURIComponent(url.pathname)));
		const allowed = filePath.startsWith(join(root, "assets/"));
		if (!allowed) {
			return new Response("Not found", { status: 404 });
		}
		const file = Bun.file(filePath);
		if (await file.exists()) {
			return new Response(file, { headers: { "Cache-Control": "no-store" } });
		}
		return new Response("Not found", { status: 404 });
	},
});

console.log(`Profile preview running at http://localhost:${port}`);
