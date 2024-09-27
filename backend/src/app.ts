import express, { Express, Request, Response } from "express";
import cors from "cors";
import treedDataRouter from "./routes/imageTreeRoute";

const app: Express = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Image tree server is running");
});

app.use("/treeData", treedDataRouter);

app.use((err: Error, _req: Request, res: Response) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
