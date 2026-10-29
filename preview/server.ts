import { watch } from "node:fs";
import { join, normalize } from "node:path";
import { marked } from "marked";

const root = join(import.meta.dir, "..");
const port = Number(process.env.PORT ?? 3030);

// The real 3D graph only exists after the GitHub Action has run, so fall back to the tool's demo image locally.
const demo3dBase = "https://raw.githubusercontent.com/yoshi389111/github-profile-3d-contrib/main/docs/demo/";

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

// Editors often fire several events per save; collapse them into one reload.
let reloadTimer: Timer | undefined;
for (const target of ["README.md", "assets"]) {
	watch(join(root, target), { recursive: true }, () => {
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout(notifyClients, 100);
	});
}

Bun.serve({
	port,
	async fetch(req) {
		const url = new URL(req.url);

		if (url.pathname === "/__reload") {
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

		// Only serve the folders the README references, so .git and other repo files stay private.
		const filePath = normalize(join(root, decodeURIComponent(url.pathname)));
		const allowed = ["assets/", "profile-3d-contrib/"].some((dir) => filePath.startsWith(join(root, dir)));
		if (!allowed) {
			return new Response("Not found", { status: 404 });
		}
		const file = Bun.file(filePath);
		if (await file.exists()) {
			return new Response(file, { headers: { "Cache-Control": "no-store" } });
		}
		if (url.pathname.startsWith("/profile-3d-contrib/")) {
			return Response.redirect(demo3dBase + url.pathname.split("/").pop(), 302);
		}
		return new Response("Not found", { status: 404 });
	},
});

console.log(`Profile preview running at http://localhost:${port}`);
