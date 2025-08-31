import { db } from "../config/db.js";
import { favoritesTable } from "../db/schema.js";
import { and, eq } from "drizzle-orm";
export const getFavorites = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const favorites = await db
            .select()
            .from(favoritesTable)
            .where(eq(favoritesTable.userId, String(userId)));
        res.status(200).json({ message: "Favorites fetched", data: favorites });
    }
    catch (error) {
        console.log("Error fetching favorites:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
export const addToFavorite = async (req, res) => {
    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;
        if (!userId || !recipeId || !title) {
            return res
                .status(400)
                .json({ error: "User ID, Recipe ID, and Title are required" });
        }
        const [newFavorite] = await db
            .insert(favoritesTable)
            .values({
            userId: String(userId),
            recipeId: Number(recipeId),
            title: String(title),
            image: image || null,
            cookTime: cookTime || null,
            servings: servings || null,
        })
            .returning({
            id: favoritesTable.id,
            userId: favoritesTable.userId,
            recipeId: favoritesTable.recipeId,
            title: favoritesTable.title,
            image: favoritesTable.image,
            cookTime: favoritesTable.cookTime,
            servings: favoritesTable.servings,
            createdAt: favoritesTable.createdAt,
        });
        res.status(201).json({ message: "Added to favorites", data: newFavorite });
    }
    catch (error) {
        console.log("Error adding to favorites:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
export const deleteFavorite = async (req, res) => {
    try {
        const { userId, recipeId } = req.params;
        if (!userId || !recipeId) {
            return res
                .status(400)
                .json({ error: "User ID and Recipe ID are required" });
        }
        const deletedFavorite = await db
            .delete(favoritesTable)
            .where(and(eq(favoritesTable.userId, String(userId)), eq(favoritesTable.recipeId, Number(recipeId))))
            .returning({ id: favoritesTable.id }); // optional: return deleted row(s)
        res
            .status(200)
            .json({ message: "Favorite removed", data: deletedFavorite });
    }
    catch (error) {
        console.log("Error removing favorite:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
