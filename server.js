const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const recipesFilePath = path.join(__dirname, 'recipes.json');

// Utility function to read recipes
const readRecipes = () => {
  const data = fs.readFileSync(recipesFilePath);
  return JSON.parse(data);
};

// Utility function to write recipes
const writeRecipes = (data) => {
  fs.writeFileSync(recipesFilePath, JSON.stringify(data, null, 2));
};

// Get all recipes
app.get('/recipes', (req, res) => {
  res.json(readRecipes());
});

// Add a new recipe
app.post('/recipes', (req, res) => {
  const recipes = readRecipes();
  const newRecipe = { ...req.body, id: recipes.length + 1 };
  newRecipe.ingredients = Array.isArray(newRecipe.ingredients) ? newRecipe.ingredients : [];
  newRecipe.method = Array.isArray(newRecipe.method) ? newRecipe.method : [];
  recipes.push(newRecipe);
  writeRecipes(recipes);
  res.status(201).json(newRecipe);
});

// Update a recipe
app.put('/recipes/:id', (req, res) => {
  const recipes = readRecipes();
  const index = recipes.findIndex(recipe => recipe.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Recipe not found');
  
  const updatedRecipe = { ...req.body };
  updatedRecipe.ingredients = Array.isArray(updatedRecipe.ingredients) ? updatedRecipe.ingredients : [];
  updatedRecipe.method = Array.isArray(updatedRecipe.method) ? updatedRecipe.method : [];
  recipes[index] = { ...recipes[index], ...updatedRecipe };
  writeRecipes(recipes);
  res.json(recipes[index]);
});

// Delete a recipe
app.delete('/recipes/:id', (req, res) => {
  let recipes = readRecipes();
  recipes = recipes.filter(recipe => recipe.id !== parseInt(req.params.id));
  writeRecipes(recipes);
  res.status(204).send();
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
