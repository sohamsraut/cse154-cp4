# TaskMaster API Documentation
The TaskMaster API provides information related to the tasks of a given user, and the categories
of the tasks. It provides tools to access and manipulate the list of tasks of a user. There
are five categories a user can modify tasks for:
  - Learn
  - Assignments
  - Important
  - Other
  - All
___

## *Endpoint 1:* Get data about the tasks of a user for a category
**Request Format:** /tasks/:user

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Given a user as a parameter and a valid category name as a query, it returns a
JSON containing all the tasks for the passed category for the given user. A valid username should
be non-empty and should not contain special characters. A valid category name is one category out
of the five mentioned in the main description, where a category of "all" returns all the tasks
of the user.

**Example Request:** /tasks/test?category=all

**Example Response:**
```json
{
  "tasks": {
    "learn": ["Learn Express.js"],
    "assignments": [
      "Complete CP4",
      "Complete HW4"
    ],
    "important": ["Very Important Work"]
  },
  "message": "Welcome to TaskMaster, test!"
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (in plain text):
  - If passed an invalid category name, returns an error with the message: `Select a valid category`
___

## *Endpoint 2:* Add a task for a given user and category
**Request Format:** /tasks/:user/new

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given a valid username, a task, and a valid category, it returns a JSON object
containing the new category and task after updating the list of tasks for the given user. The
body of the request takes two values: the new task and the category. A valid username exists,
is non-empty, and contains no special characters. A valid category is one category out of five
categories out of the five mentioned in the main desciption.

**Example Request:** /tasks/test/new
  - Body of request is a FormData object containing:
    - task = "Study for finals"
    - category = "Important"

**Example Response:**
```json
{
  "category": "important",
  "task": "Study for finals"
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all in plain text):
  - If passed a username that does not exist, returns an error with the message: `Invalid username`
  - If either a task or a category is not passed, returns an error with the message: `Missing Task
    or Category`
  - If passed an invalid category, returns an error with the message: `Invalid category`
___

## *Endpoint 3:* Removes a task for a given user
**Request Format:** /tasks/:user/remove

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given a valid username, a task, and a valid category, it returns a message that
 informs the user that the requested task has been removed after updating the list of tasks for the
 given user. The body of the request takes two values: an existing task and the category the task belongs to. A valid
 username exists, is non-empty, and contains no special characters. A valid category is one
 category out of five categories out of the five mentioned in the main desciption.

**Example Request:** /tasks/test/remove
  - Body of request is a FormData object containing:
    - task = "Complete CP4"
    - category = "Assignments"

**Example Response:**
```
Removed task "Complete CP4" !
```

**Error Handling:**
- Possible 400 (invalid request) errors (all in plain text):
  - If passed a username that does not exist, returns an error with the message: `Invalid username`
  - If either a task or a category is not passed, returns an error with the message: `Missing Task or Category`
  - If passed an invalid category, returns an error with the message: `Invalid category`
___
&copy; Soham Raut, 2022
___