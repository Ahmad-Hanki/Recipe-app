import express from "express";
import { ENV } from "./config/env.js";
import router from "./apis/favorites.js";
const app = express();
const PORT = ENV.PORT;
app.use(express.json());

app.use("/api", router);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





