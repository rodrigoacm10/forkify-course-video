import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.renderPages());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    const { recipe } = model.state;

    recipeView.render(model.state.recipe);

    console.log(recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();

    if (!query) return;

    await model.loadSearchResults(query);
    // console.log(model.state.search.results);

    // resultsView.render(model.state.search.results);
    resultsView.render(model.renderPages());

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  console.log(goToPage);

  resultsView.render(model.renderPages(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlAddBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    // addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('Get a error');
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('welcome to the app');
};

const init = function () {
  bookmarksView.addHandlerRender(controlAddBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerAddBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addhandlerUpdateServings(controlServings);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();

//const num = Number(prompt('Answer a number here!'));

//const fact = Array(num)
//  .fill(null)
//  .map((val, len) => len + 1).reduce((acc, val, leng) => );
//console.log(fact);

// function factorialize(num) {
//  if (num < 0) return -1;
//  else if (num == 0) return 1;
//  else {
//    return num * factorialize(num - 1);
//  }
// }
// console.log(factorialize(5));
