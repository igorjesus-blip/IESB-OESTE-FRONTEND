import express from "express";
import cors from "cors";
import settingsRouter from "./routes/settings.routes";
import tasksRouter from "./routes/tasks.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
	return res.json({ ok: true, message: "Chronos API - root" });
});

app.get("/health", (_req, res) => {
	return res.json({ ok: true });
});

app.use("/settings", settingsRouter);
app.use("/tasks", tasksRouter);

export default app;
