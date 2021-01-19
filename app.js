// JSON Daten in m/cm/lbs umwandeln - lbs * 0.45359237 = KG; 1inch : 39,37 = m; 1inch * 2,54 = cm

import dataimport from "./dino.js";
const dinosArray = dataimport["dinosArray"];
const HumanTest = dataimport["Human"];
const dinoCompare = document.getElementById("dino-compare");
const infographicsGrid = document.getElementById("grid");

// Boolean Test Env - Hardcode
const enviroment = "prod";
// const enviroment = 'prod'

// Create Dino Constructor

function Animal(species, weight, height, diet, fact, where, when) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.facts = fact;
  this.image = "images/" + species.toLowerCase() + ".png";
}

function Dino(species, weight, height, diet, fact) {
  Animal.call(this, species, weight * 0.45359237, height * 2.54, diet, fact);
}

Dino.prototype = Object.create(Animal.prototype);
Dino.prototype.constructor = Dino;

// Create Dino Objects

let DinosList = dinosArray.map(
  (dinojson) =>
    new Dino(
      dinojson.species,
      dinojson.weight,
      dinojson.height,
      dinojson.diet,
      [
        dinojson.fact,
        `My species: ${dinojson.species}.`,
        `I belong to: ${dinojson.where}.`,
        `My when value is ${dinojson.when}.`,
      ]
    )
);

// Create Human Object

function Human(name, weight, height, diet) {
  Animal.call(this, "human", weight, height, diet);
  this.name = name;
}

Human.prototype = Object.create(Animal.prototype);
Human.prototype.constructor = Human;

// Use IIFE to get human data from form

function getHuman() {
  return (function () {
    if (enviroment === "test") {
      const name = HumanTest["name"];
      const heightMeter = HumanTest["heightMeter"];
      const heightCentimeter = HumanTest["heightCentimeter"];
      const weight = HumanTest["weight"];
      const diet = HumanTest["diet"];
      return new Human(
        name,
        weight,
        heightMeter * 100 + heightCentimeter,
        diet
      );
    } else {
      const name = getInputValue("name");
      const heightMeter = parseFloat(getInputValue("meter"));
      const heightCentimeter = parseFloat(getInputValue("centimeter"));
      const weight = parseFloat(getInputValue("weight"));
      const diet = getInputValue("diet");
      return new Human(
        name,
        weight,
        heightMeter * 100 + heightCentimeter,
        diet
      );
    }
  })();
}

function getInputValue(elementId) {
  return document.getElementById(elementId).value;
}

// const human = getHuman();
// console.log(human);

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
// For each dino??

const compareWeight = (dino) => {
  if (dino.weight > human.weight) {
    dino.facts.push("You are like a feather compared this dino, little guy!");
  } else if (dino.weight < human.weight) {
    dino.facts.push("The dinos diet is much more better then yours.");
  } else if (
    dino.weight > human.weight - 100 &&
    dino.weight < human.weight + 100
  ) {
    dino.facts.push("Maybe you are related. You eat the same stuff.");
  }
  return dino;
};

DinosList = DinosList.map(compareWeight);

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.

const compareHeight = (dino) => {
  if (dino.height > human.height) {
    dino.facts.push("You are like a minion compared to this dino, little guy!");
  } else if (dino.height < human.height) {
    dino.facts.push("You could spit on his head.");
  } else if (
    dino.height > human.height - 25 &&
    dino.height < human.height + 25
  ) {
    dino.facts.push("You seem to be as big as the dinooo.");
  }
  return dino;
};

DinosList = DinosList.map(compareHeight);

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.

function compareDiet(dino) {
  if (dino.diet === human.diet.toLowerCase()) {
    dino.facts.push(`Like you, ${dino.species} had ${dino.diet} diet`);
  } else {
    dino.facts.push(`Unlike you, ${dino.species} had ${dino.diet} diet`);
  }
  return dino;
}

DinosList = DinosList.map(compareDiet);

// richtig random??
getRandomFact = (list) => list[Math.floor(Math.random() * list.length)];

// Generate Tiles for each Dino in Array

// Add tiles to DOM

// Remove form from screen

// On button click, prepare and display infographic

function createTile(animal) {
  const tile = document.createElement("div");
  tile.classList.add("grid-item");
  tile.innerHTML = `
    <h3>${animal.species}</h3>
    <img src="${animal.image}">
    `;
  // capitalize species?
  if (animal.species !== "Pigeon" && animal instanceof Dino) {
    const facts = [
      animal.fact,
      compareWeight(animal),
      compareHeight(animal),
      compareDiet(animal),
    ];
    // can getRandomFact auf facts zugreifen??
    tile.innerHTML += `<p>${getRandomFact(facts)}</p>`;
  } else if (animal.species === "Pigeon") {
    tile.innerHTML += `<p>${animal.fact}</p>`;
  }
  infographicsGrid.appendChild(tile);
}

function generateInfographics(objects) {
  objects.forEach((object) => createTile(object));
}

// Show infographic
function showInfographics(array) {
  generateInfographics(array);
  dinoCompare.style.display = "none";
  infographicsGrid.style.display = "flex";
}

document
  .getElementById("compareMeBtn")
  .addEventListener("click", showInfographics);
