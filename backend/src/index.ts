import app from "./app.js";
import db from "./utils/database.js";

async function init() {
  try {
    const result = await db();

    console.log("Database status:", result);

    const PORT = 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

init();