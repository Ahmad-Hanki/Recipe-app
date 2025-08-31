import express from "express";
import { ENV } from "./config/env.js";
import router from "./apis/favorites.js";
import job from "./config/cron.js";

const app = express();
const PORT = ENV.PORT;

if (ENV.NODE_ENV == "production") job.start();
app.use(express.json());
app.use("/api", router);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
