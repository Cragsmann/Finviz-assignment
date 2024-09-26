import express, { Express } from "express";
import cors from "cors";
import { PORT } from "./config/config";
import treedDataRouter from "./routes/imageTreeRoute";
import { getDbConnection } from "./db/database";
import { initializeData } from "./services/dataInit";

const app: Express = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (_, res) => {
  res.status(200).send("Image tree server is running");
});
app.use("/treeData", treedDataRouter);

const startServer = async () => {
  try {
    const db = getDbConnection();
    console.log("DB connected");
    await initializeData(db);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
