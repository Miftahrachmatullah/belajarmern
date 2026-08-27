import app from "./app";
import db from "./utils/database";

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