import { Router } from "express";
import prisma from "../lib/prisma";

export const settingsRouter = Router();

settingsRouter.get("/", async (req, res) => {
  try {
    let settings = await prisma.settings.findUnique({ where: { id: 1 } });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 1,
          workTime: 25,
          shortBreakTime: 5,
          longBreakTime: 15,
        },
      });
    }

    return res.json(settings);
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
});

settingsRouter.put("/", async (req, res) => {
  try {
    const { workTime, shortBreakTime, longBreakTime } = req.body as {
      workTime: number;
      shortBreakTime: number;
      longBreakTime: number;
    };

    if (
      !Number.isInteger(workTime) ||
      !Number.isInteger(shortBreakTime) ||
      !Number.isInteger(longBreakTime)
    ) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const updated = await prisma.settings.upsert({
      where: { id: 1 },
      update: { workTime, shortBreakTime, longBreakTime },
      create: { id: 1, workTime, shortBreakTime, longBreakTime },
    });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
});

export default settingsRouter;
