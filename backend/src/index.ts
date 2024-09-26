import express, { Express } from "express";
import cors from "cors";
import { PORT } from "./config/config";
import treedDataRouter from "./routes/parsedDataRoute";
import { getDbConnection } from "./db/database";
import { fetchAndParseImageNet } from "./services/dataInit";

const app: Express = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (_, res) => {
  res.status(200).send("Welcome to the API!");
});
app.use("/treeData", treedDataRouter);

const startServer = async () => {
  try {
    // await connectDB();
    const db = getDbConnection();
    console.log("DB connected");
    await fetchAndParseImageNet(db);

    // await initDataFetch();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
