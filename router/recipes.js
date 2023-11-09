const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { recipeController, commentController } = require("../controllers");

// Recipe Related Routes
router.post("/create-recipe", auth(), recipeController.createRecipe);
router.put("/details/:recipeId/edit", auth(), recipeController.editRecipe);
router.put("/details/:recipeId/save", auth(), recipeController.saveRecipe);
router.delete(
  "/details/:recipeId/remove-saved",
  auth(),
  recipeController.removeSavedRecipe
);
router.delete(
  "/details/:recipeId/delete",
  auth(),
  recipeController.deleteRecipe
);
// Comment Related Routes
router.get("/details/:recipeId/comments", recipeController.getRecipeComments);
router.post(
  "/details/:recipeId/comment",
  auth(),
  commentController.commentRecipe
);
// router.put(
//   "/details/:recipeId/comments/:commentId",
//   auth(),
//   commentController.editComment
// );
router.delete(
  "/details/:recipeId/comments/:commentId",
  auth(),
  commentController.deleteRecipeComment
);
// Search route
router.get("/search", recipeController.search);

router.get("/details/:recipeId", recipeController.getRecipeById);
router.get("/", recipeController.getAllRecipes);

module.exports = router;
