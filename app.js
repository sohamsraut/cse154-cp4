/*
 * Name: Soham Raut
 * Date: May 21, 2022
 * Section: CSE 154 AF
 * This is the app.js file used to implement the TaskManager API. It contains details related to
 * the tasks like the list of categories, the list of users, and the tasks. It contains three
 * endpoints, one GET (to get task data) and two POST (to add and remove a task) endpoints.
 */
"use strict";

let categories = ["learn", "assignments", "important", "other", "all"];
let users = ["test"];
let userTasks = {
  "test": {
    "tasks": {
      "learn": ["Learn Express.js"],
      "assignments": ["Complete CP4", "Complete HW4"],
      "important": ["Very Important Work"]
    }
  }
};

const express = require("express");
const multer = require("multer");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

/**
 * Used to send data related to the tasks for a given valid user and a passed valid category
 */
app.get("/tasks/:user", (req, res) => {
  let user = req.params.user;
  let category = req.query.category;
  userUpdate(user);
  if (category && categories.includes(category)) {
    if (category === "all") {
      res.json(userTasks[user]);
    } else {
      let data = oneCategoryTask(user, category);
      res.json(data);
    }
  } else {
    res.type("text");
    res.status(400).send("Select a valid category");
  }
});

/**
 * Used to add a new task to a passed valid category for a given user
 */
app.post("/tasks/:user/new", (req, res) => {
  let user = req.params.user;
  let newTask = req.body["new-task"];
  let newCategory = req.body["new-category"].toLowerCase();
  if (users.includes(user)) {
    if (newTask && newCategory) {
      if (categories.includes(newCategory)) {
        if (!userTasks[user]["tasks"][newCategory]) {
          userTasks[user]["tasks"][newCategory] = [];
        }
        let tasksList = userTasks[user]["tasks"][newCategory];
        tasksList[tasksList.length] = newTask;
        res.json({
          "category": newCategory,
          "task": newTask
        });
      } else {
        res.type("text");
        res.status(400).send("Invalid category");
      }
    } else {
      res.type("text");
      res.status(400).send("Missing Task or Category");
    }
  } else {
    res.type("text");
    res.status(400).send("Invalid username");
  }
});

/**
 * Used to remove a task of a passed valid category from the task list of a given user.
 */
app.post("/tasks/:user/remove", (req, res) => {
  res.type("text");
  let user = req.params.user;
  let task = req.body["task"];
  let category = req.body["category"];
  if (users.includes(user)) {
    if (task && category) {
      if (categories.includes(category)) {
        let taskList = userTasks[user]["tasks"][category];
        for (let i = 0; i < taskList.length; i++) {
          if (taskList[i] === task) {
            taskList.splice(i, 1);
          }
        }
        res.send("Removed task \"" + task + "\" !");
      } else {
        res.status(400).send("Invalid category");
      }
    } else {
      res.status(400).send("Missing task or category");
    }
  } else {
    res.status(400).send("Invalid Username");
  }
});

/**
 * Checks whether the user is a new or recurring user, and creates an object containing the task
 * data if the user is new.
 * @param {String} user : The username of the user to check
 */
function userUpdate(user) {
  let message = "Welcome back, " + user + "!";
  if (!users.includes(user)) {
    message = "Welcome to TaskMaster, " + user + "!";
    users[users.length] = user;
    userTasks[user] = {
      "tasks": {},
      "message": ""
    };
  }
  userTasks[user].message = message;
}

/**
 * Isolates the task data of the passed category for a user
 * @param {String} user : The username of the user
 * @param {String} category : The category to be isolated
 * @returns {Object} : An object containing the data of one category for the user
 */
function oneCategoryTask(user, category) {
  let newTask = {
    "tasks": {},
    "message": userTasks[user]["message"]
  };
  newTask["tasks"][category] = userTasks[user]["tasks"][category];
  return newTask;
}

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);