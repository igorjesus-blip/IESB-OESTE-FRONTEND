import { Router } from "express";
import prisma from "../lib/prisma";

export const tasksRouter = Router();

function serializeTask(t: any) {
  return {
    ...t,
    startDate: String(t.startDate),
    completeDate: t.completeDate === null ? null : String(t.completeDate),
    interruptDate: t.interruptDate === null ? null : String(t.interruptDate),
  };
}

tasksRouter.get("/", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { startDate: "desc" } });
    return res.json(tasks.map(serializeTask));
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
});

tasksRouter.post("/", async (req, res) => {
  try {
    // debug log
    // eslint-disable-next-line no-console
    console.log('POST /tasks body ->', req.body)
    const payload = req.body as any;

    const created = await prisma.task.create({ data: {
      id: payload.id,
      name: payload.name,
      duration: payload.duration,
      type: payload.type,
      startDate: BigInt(payload.startDate),
      completeDate: payload.completeDate === null || payload.completeDate === undefined ? null : BigInt(payload.completeDate),
      interruptDate: payload.interruptDate === null || payload.interruptDate === undefined ? null : BigInt(payload.interruptDate),
    }});

    return res.status(201).json(serializeTask(created));
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
});

tasksRouter.patch("/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    // debug log
    // eslint-disable-next-line no-console
    console.log(`PATCH /tasks/${id}/complete body ->`, req.body)
    const { completeDate } = req.body as { completeDate: number };

    const updated = await prisma.task.update({
      where: { id },
      data: { completeDate: BigInt(completeDate) },
    });

    return res.json(serializeTask(updated));
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
});

tasksRouter.patch("/:id/interrupt", async (req, res) => {
  try {
    const { id } = req.params;
    // debug log
    // eslint-disable-next-line no-console
    console.log(`PATCH /tasks/${id}/interrupt body ->`, req.body)
    const { interruptDate } = req.body as { interruptDate: number };

    const updated = await prisma.task.update({
      where: { id },
      data: { interruptDate: BigInt(interruptDate) },
    });

    return res.json(serializeTask(updated));
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
});

tasksRouter.delete("/", async (req, res) => {
  try {
    await prisma.task.deleteMany({});
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
});

export default tasksRouter;
