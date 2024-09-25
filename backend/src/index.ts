import express, { Express } from "express";
import cors from "cors";
import { PORT } from "./config/config";
import treeData from "./routes/treeDataRoute";
import { connectDB } from "./db/database";
import { initDataFetch } from "./services/dataInitializer";
import { LinearData } from "./models/linearDataModel";

const app: Express = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (_, res) => {
  res.status(200).send("Welcome to the API!");
});
app.use("/treeData", treeData);

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");

    // await initDataFetch();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
