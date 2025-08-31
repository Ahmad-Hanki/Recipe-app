import { addToFavorite, deleteFavorite, getFavorites, } from "../middlewares/favorites.js";
import { Router } from "express";
const router = Router();
router.get("/favorites/:userId", getFavorites);
router.post("/favorites", addToFavorite);
router.delete("/favorites/:userId/:recipeId", deleteFavorite);
export default router;
