import app from "./app";
import { PORT } from "./config/config";
import { getDbConnection } from "./db/database";
import { initializeData } from "./db/dataSeed";

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
