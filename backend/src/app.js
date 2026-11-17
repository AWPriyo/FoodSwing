import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {errorHandler} from "./errors.js";
import {asyncHandler} from "./middleware/async-handler.js";
import {optionalSession} from "./auth/session.js";
import {pool} from "./db/pool.js";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import riderRouter from "./routes/rider.js";

const app = express();
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const frontendRoot = path.join(projectRoot, "frontend");

app.disable("x-powered-by");
app.use(helmet({contentSecurityPolicy: false}));
app.use(express.json({limit: "16kb"}));
app.use("/api", optionalSession);

app.get("/", (request, response) => response.sendFile(path.join(frontendRoot, "index.html")));
app.get("/admin", optionalSession, (request, response) => {
  if (request.auth?.role !== "admin") {
    response.redirect("/?admin=login");
    return;
  }
  response.set("Cache-Control", "no-store");
  response.sendFile(path.join(frontendRoot, "admin.html"));
});
app.get("/rider", optionalSession, (request, response) => {
  if (request.auth?.role !== "rider") {
    response.redirect("/?rider=login");
    return;
  }
  response.set("Cache-Control", "no-store");
  response.sendFile(path.join(frontendRoot, "rider.html"));
});
app.get("/style.css", (request, response) => response.sendFile(path.join(frontendRoot, "style.css")));
app.get("/script.js", (request, response) => response.sendFile(path.join(frontendRoot, "script.js")));
app.get("/admin.css", (request, response) => response.sendFile(path.join(frontendRoot, "admin.css")));
app.get("/admin.js", (request, response) => response.sendFile(path.join(frontendRoot, "admin.js")));
app.get("/rider.css", (request, response) => response.sendFile(path.join(frontendRoot, "rider.css")));
app.get("/rider.js", (request, response) => response.sendFile(path.join(frontendRoot, "rider.js")));
app.use("/images", express.static(path.join(projectRoot, "images"), {fallthrough: false}));

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {error: "Too many order attempts. Please try again later.", code: "RATE_LIMITED"}
});

app.get("/api/health", asyncHandler(async (request, response) => {
  await pool.query("SELECT 1");
  response.json({status: "ok", database: "connected"});
}));

app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", orderLimiter, ordersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/rider", riderRouter);

app.use("/api", (request, response) => {
  response.status(404).json({error: "API endpoint not found.", code: "NOT_FOUND"});
});

app.use((request, response) => {
  response.status(404).send("Page not found.");
});

app.use(errorHandler);

export default app;
