/*
 * Name: Vivek Hegde
 * Date: July 29, 2022
 * Section: CSE 154 AB
 *
 * This is the index.js file that adds functionality to my "index.html" webpage.
 * This JS updates the stats/information in the "display-card" section of the HTML using data
 * from PokeAPI. When the search button is clicked, it retrieves the data about the pokemon in
 * the search field and dynamically updates the web page as needed.
 */

"use strict";
(function() {

  // module global constant to hold the base URL
  const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";

  window.addEventListener("load", init);

  /**
   * Initiates page on load
   */
  function init() {
    id("search-btn").addEventListener("click", makeRequest);
  }

  /**
   * This function fetches data about the pokemon entered in the search field, processes it,
   * and updates the web page as required
   */
  function makeRequest() {
    let pokemonName = id("input-box").value;

    if (pokemonName !== "") {
      fetch(BASE_URL + pokemonName.toLowerCase())
        .then(statusCheck)
        .then(resp => resp.json())
        .then(processPokemon)
        .catch(handleError);
    }
  }

  /**
   * This function takes in a JSON object (which contains information about the pokemon entered)
   * and processes it to update the web page as necessary.
   * It does this by first clearing the "display-card" and inserting the information relevant
   * to the name of the pokemon entered in the search box.
   * @param {object} response - a JSON object returned by the PokeAPI according to the
   * pokemon name
   */
  function processPokemon(response) {
    id("display-card").innerHTML = "";
    insertImage(response);

    let detailsContainer = gen("section");
    detailsContainer.setAttribute("id", "details-container");
    id("display-card").appendChild(detailsContainer);

    insertName(response);
    insertHPXP(response);
    insertAttributes(response);
    id("input-box").value = "";
  }

  /**
   * This is a helper function takes in the JSON object as input and
   * updates the image of the pokemon on the webpage as necessary.
   * @param {object} response - a JSON object returned by the PokeAPI according to the
   * pokemon name
   */
  function insertImage(response) {
    let image = gen("img");
    image.setAttribute("id", "pokemon-img");
    image.src = response.sprites.other["official-artwork"]["front_default"];
    image.alt = response.name;
    id("display-card").appendChild(image);
  }

  /**
   * This is a helper function takes in the JSON object as input and
   * updates the name of the pokemon on the webpage as necessary. It also adds in a dummy HP bar
   * after the pokemon name
   * @param {object} response - a JSON object returned by the PokeAPI according to the
   * pokemon name.
   */
  function insertName(response) {
    let name = gen("p");
    name.setAttribute("id", "name");
    name.textContent = response.name;
    id("details-container").appendChild(name);

    let healthBar = gen("hr");
    healthBar.setAttribute("id", "hp-bar");
    id("details-container").appendChild(healthBar);
  }

  /**
   * This is a helper function takes in the JSON object as input and
   * updates the HP and XP of the pokemon on webpage. It also includes a verticle line that
   * separates HP and XP.
   * @param {object} response - a JSON object returned by the PokeAPI according to the
   * pokemon name.
   */
  function insertHPXP(response) {
    let hpXp = gen("div");
    hpXp.setAttribute("id", "hp-xp");

    let maxHP = response.stats[0]["base_stat"];
    let hp = gen("span");
    hp.textContent = "HP " + maxHP + "/" + maxHP;
    hpXp.appendChild(hp);

    let divider = gen("hr");
    divider.setAttribute("id", "divider");
    hpXp.appendChild(divider);

    let maxXP = response.base_experience;
    let xp = gen("span");
    xp.textContent = "XP " + Math.floor(Math.random() * maxXP) + "/" + maxXP;
    hpXp.appendChild(xp);

    id("details-container").appendChild(hpXp);
  }

  /**
   * This is a helper function takes in the JSON object as input and
   * updates the attributes of the pokemon on webpage. This includes the pokemon's type,
   * weight, and its height.
   * @param {object} response - a JSON object returned by the PokeAPI according to the
   * pokemon name
   */
  function insertAttributes(response) {
    let attributes = gen("div");
    attributes.setAttribute("id", "attributes");

    let type = setType(response.types);
    attributes.appendChild(type);

    let weight = setWeight(response.weight);
    attributes.appendChild(weight);

    let height = setHeight(response.height);
    attributes.appendChild(height);
    id("details-container").appendChild(attributes);
  }

  /**
   * This is a helper function that takes in the weight of the pokemon (returned through fetch)
   * and returns a div containing the weight in Kgs along with the heading "Weight"
   * @param {number} number -"weight" attribute of the pokemon returned by
   * the fetch call to PokeAPI
   * @returns {div} a div containing the weight in Kgs and the heading "Weight"
   */
  function setWeight(number) {
    let pokeWeight = gen("div");
    pokeWeight.setAttribute("class", "attribute");

    let weightInKgs = gen("span");
    weightInKgs.textContent = (number / 10) + " Kgs";
    pokeWeight.appendChild(weightInKgs);

    let heading = gen("span");
    heading.textContent = "Weight";
    pokeWeight.appendChild(heading);

    return pokeWeight;
  }

  /**
   * This is a helper function that takes in the height of the pokemon (returned through fetch)
   * and returns a div containing the height in meters along with the heading "Height"
   * @param {number} number -"height" attribute of the pokemon returned by
   * the fetch call to PokeAPI
   * @returns {div} a div containing the height in meters and the heading "Height"
   */
  function setHeight(number) {
    let pokeHeight = gen("div");
    pokeHeight.setAttribute("class", "attribute");

    let heightInMeters = gen("span");
    heightInMeters.textContent = (number / 10) + " m";
    pokeHeight.appendChild(heightInMeters);

    let heading = gen("span");
    heading.textContent = "Height";
    pokeHeight.appendChild(heading);

    return pokeHeight;
  }

  /**
   * This is a helper function that takes in the array of "types"
   * of the pokemon (returned through fetch) and returns a div containing the string of types
   * along with the heading "Type"
   * @param {array} array -"Types" array attribute of the pokemon returned by
   * the fetch call to PokeAPI
   * @returns {div} a div containing the types as a string and the heading "Type"
   */
  function setType(array) {
    let pokeType = gen("div");
    pokeType.setAttribute("class", "attribute");

    let types = gen("span");
    types.textContent = array[0].type.name;
    for (let i = 1; i < array.length; i++) {
      types.textContent += "/" + array[i].type.name;
    }
    pokeType.appendChild(types);

    let heading = gen("span");
    heading.textContent = "Type";
    pokeType.appendChild(heading);

    return pokeType;
  }

  /**
   * This function is the helper to catch block in processPokemon()
   * This function clears the "display-card" and updates it to alert the user and displays
   * a descriptive error message.
   * @param {string} error - this is the string that consists of the error message
   */
  function handleError(error) {
    id("display-card").innerHTML = "";
    id("input-box").value = "";

    let errorMsg = gen("div");
    errorMsg.setAttribute("id", "err-msg");

    let alert = gen("p");
    alert.textContent = "Weird... Something went wrong! Please try again.";
    errorMsg.appendChild(alert);

    let message = gen("p");
    message.textContent = error;
    errorMsg.appendChild(message);

    id("display-card").appendChild(errorMsg);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} DOM object associated with ID.
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * creates and returns a new empty DOM node representing an element of that tagName type
   * @param {string} tagName - HTML element type.
   * @returns {object} - A new DOM object representing an element of that tagName type
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();