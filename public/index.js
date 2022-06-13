/*
 * Name: Soham Raut
 * Date: May 21, 2022
 * Section: CSE 154 AF
 * This is the index.js page used to add functionality and manage the UI of the TaskMaster task
 * manager. It is used to implement button click functions, and modify elements on the webpage
 * using data from the developed TaskManager API.
 */
"use strict";

(function() {

  const BASE_URL = "tasks/";
  let username;

  window.addEventListener('load', init);

  /**
   * Sets up the start and new task buttons, along with the category selector.
   */
  function init() {
    id("enter-user").addEventListener('click', fetchUserTasks);
    id("new-btn").addEventListener('click', addNewTask);
    let categories = qsa("#category-select input");
    for (let i = 0; i < categories.length; i++) {
      categories[i].addEventListener('click', selectCategory);
      if (categories[i].value === "all") {
        categories[i].checked = true;
      }
    }
    id("new-task").value = "";
    id("new-category").value = "";
    id("username").value = "";
  }

  /**
   * Fetches the task data of a user for a certain category to be displayed.
   */
  function fetchUserTasks() {
    username = id("username").value;
    let category = qs("input:checked").value;
    if (username !== "") {
      fetch(BASE_URL + username + "?category=" + category)
        .then(statusCheck)
        .then(res => res.json())
        .then(displayTasks)
        .catch(taskError);
    }
  }

  /**
   * Implements the selection of task category by the user to display tasks of a category.
   */
  function selectCategory() {
    this.checked = true;
    let categories = qsa("#category-select input");
    for (let i = 0; i < categories.length; i++) {
      if (categories[i] !== this) {
        categories[i].checked = false;
      }
    }
    id("tasks").innerHTML = "";
    fetchUserTasks();
  }

  /**
   * Sets up the task view and displays the tasks of the selected user and category
   * @param {Object} responseData : The object containing data about the tasks of the selected
   *                                  user and category.
   */
  function displayTasks(responseData) {
    if (id("task-view").classList.contains("hidden")) {
      id("intro-view").classList.add("hidden");
      qs("header").classList.add("hidden");
      id("task-view").classList.remove("hidden");
      id("user-message").textContent = responseData["message"];
    }
    for (let i in responseData["tasks"]) {
      let category = responseData["tasks"][i];
      for (let j = 0; j < category.length; j++) {
        createTaskCard(i, category[j]);
      }
    }
  }

  /**
   * Creates a card structure for one task of a certain category.
   * @param {String} category : The category that the passed task belongs to.
   * @param {String} task : The task for which the card is created.
   */
  function createTaskCard(category, task) {
    let taskCard = gen("section");
    taskCard.classList.add("task");
    let taskName = gen("p");
    let categoryName = gen("p");
    let clearButton = gen("button");
    clearButton.id = "clear-btn";
    clearButton.textContent = "Clear";
    clearButton.addEventListener('click', clearTask);
    taskName.textContent = task;
    categoryName.textContent = category;
    if (category === "important") {
      taskCard.classList.add("important");
    }
    categoryName.classList.add("category");
    taskCard.appendChild(taskName);
    taskCard.appendChild(categoryName);
    taskCard.appendChild(clearButton);
    id("tasks").appendChild(taskCard);
  }

  /**
   * Adds a new task to the current user's list of tasks and updates the webpage.
   */
  function addNewTask() {
    let data = new FormData(qs("form"));
    fetch(BASE_URL + username + "/new", {method: "POST", body: data})
      .then(statusCheck)
      .then(res => res.json())
      .then((res) => {
        createTaskCard(res["category"], res["task"]);
      })
      .catch(taskError);
    id("new-task").value = "";
    id("new-category").value = "";
  }

  /**
   * Removes the selected task from the list of tasks and updates the webpage.
   */
  function clearTask() {
    let taskCardParts = this.parentElement.children;
    let data = new FormData();
    data.append("task", taskCardParts[0].textContent);
    data.append("category", taskCardParts[1].textContent);
    fetch(BASE_URL + username + "/remove", {method: "POST", body: data})
      .then(statusCheck)
      .then(res => res.text())
      .then(function(res) {
        id("tasks").removeChild(this.parentElement);
        displayMessage(res);
      })
      .catch(taskError);
  }

  /**
   * Displays a message on the screen for 5 seconds.
   * @param {String} responseData : The contents of the message to be displayed.
   */
  function displayMessage(responseData) {
    const delayTime = 5000;
    id("task-message").classList.remove("hidden");
    id("task-message").textContent = responseData;
    setTimeout(() => {
      id("task-message").classList.add("hidden");
      id("task-message").classList.remove("error");
    }, delayTime);
  }

  /**
   * Used to display an error message on the screen.
   * @param {String} err : The contents of the error message to be displayed.
   */
  function taskError(err) {
    id("task-message").classList.add("error");
    displayMessage(err);
  }

  /**
   * Checks the status of the data requested from the API, throws an error if there are problems.
   * @param {Promise} res : The response object after data is requested
   * @returns {Promise} : The response object passed (if there are no problems)
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element with the passed ID value
   * @param {string} idName : The id of the element
   * @returns {Element} : The object associated with the passed id
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the passed CSS selector
   * @param {string} selector : One or more CSS selectors to select elements
   * @returns {Element} : The first element matching the given selector
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns a list of elements that match with the passed CSS selectors
   * @param {String} selector : One or more CSS selectors to select elements
   * @returns {NodeList} : A list of elements that match the given CSS selector
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the passed tag name
   * @param {string} tagName : The tag name for the new DOM element
   * @returns {Element} : a new element with the given tag name
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();