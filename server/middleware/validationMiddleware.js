const { body, param, query, validationResult } = require("express-validator");

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid Email required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be minimum 6 characters"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm Password and Password must be same");
      }
      return true;
    }),
];

const createProjectValidation = [
  body("name").trim().notEmpty().withMessage("Project Name is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project Description is required"),
  body("status")
    .isIn(["planning", "active", "completed", "archived"])
    .withMessage("Invalid Project Status"),
  body("icon")
    .trim()
    .notEmpty()
    .withMessage("Icon is required")
    .isIn([
      "monitor",
      "mobile",
      "shopping",
      "chart",
      "dashboard",
      "code",
      "design",
    ])
    .withMessage("Invalid Icon"),
  body("color")
    .trim()
    .notEmpty()
    .withMessage("Color is required")
    .isIn(["red", "green", "blue", "orange", "violet", "slate"])
    .withMessage("Invalid Color"),
];

const updateProjectValidation = [
  body("name").trim().notEmpty().withMessage("Project Name is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project Description is required"),
  body("status")
    .isIn(["planning", "active", "completed", "archived"])
    .withMessage("Invalid Project Status"),
  body("icon")
    .trim()
    .notEmpty()
    .withMessage("Icon is required")
    .isIn([
      "monitor",
      "mobile",
      "shopping",
      "chart",
      "dashboard",
      "code",
      "design",
    ])
    .withMessage("Invalid Icon"),
  body("color")
    .trim()
    .notEmpty()
    .withMessage("Color is required")
    .isIn(["red", "green", "blue", "orange", "violet", "slate"])
    .withMessage("Invalid Color"),
];

const addProjectMembersValidation = [
  body("members")
    .isArray({ min: 1 })
    .withMessage("Atleast one member is required"),

  body("members.*").isMongoId().withMessage("Invalid Member ID"),
];

const deleteProjectValidation = [
  body("members")
    .isArray({ min: 1 })
    .withMessage("Atleast one member is required"),

  body("members.*").isMongoId().withMessage("Invalid Member ID"),
];

const createTaskValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("assignedTo")
    .isArray({ min: 1 })
    .withMessage("Atleast one member is required"),
  body("assignedTo.*").isMongoId().withMessage("Invalid assigned user ID"),
  body("priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority level"),
  body("dueDate")
    .trim()
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Date format is required"),
];

const updateTaskValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("assignedTo")
    .isArray({ min: 1 })
    .withMessage("Atleast one member is required"),
  body("assignedTo.*").isMongoId().withMessage("Invalid assigned user ID"),
  body("priority").isIn(["low", "medium", "high"]),
  body("dueDate")
    .trim()
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Date format is required"),
];

const updateTaskStatusValidation = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid Status"),
];

const updateUserRoleValidation = [
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["member", "manager"])
    .withMessage("Invalid Role"),
];

const updateUserStatusValidation = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["active", "disabled"])
    .withMessage("Invalid Status"),
];

const forgotPasswordValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Enter a valid email"),
];

const resetpassword = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be minimum 6 characters"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be minimum 6 characters"),
];

const mongoIdValidation = [param("id").isMongoId().withMessage("Invalid ID")];

const fetchTaskValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid status"),
  query("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),
  query("sort")
    .optional()
    .isIn(["newest", "oldest", "due-asc", "due-desc"])
    .withMessage("Invalid sort option"),
  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search text is too long"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
};

module.exports = {
  loginValidation,
  registerValidation,
  createProjectValidation,
  updateProjectValidation,
  addProjectMembersValidation,
  deleteProjectValidation,
  createTaskValidation,
  updateTaskValidation,
  updateTaskStatusValidation,
  updateUserRoleValidation,
  updateUserStatusValidation,
  forgotPasswordValidation,
  resetpassword,
  mongoIdValidation,
  fetchTaskValidation,
  validate,
};
