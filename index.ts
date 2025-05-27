import WebServer from '@blockless/sdk-ts/dist/lib/web';
import { readFileSync } from "fs";
import { join } from "path";

const server = new WebServer();

// Serve static files (optional)
server.statics('public', '/');




server.get("/app.js", async (_, res) => {
    const scriptPath = join(__dirname, "script.js");
    const script = readFileSync(scriptPath, "utf-8");
    return res.send(script, 200, { "Content-Type": "application/javascript" });
});

// Start the server
server.start();
