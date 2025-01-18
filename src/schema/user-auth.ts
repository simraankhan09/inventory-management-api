import Joi from "joi";

export const userAuthSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Invalid email address",
    "any.required": "Email required",
  }),
  password: Joi.string()
    // .pattern(
    //   new RegExp(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{5,15}$/
    //   )
    // )
    .required()
    .messages({
      "string.base": "Password should be a string",
      "any.required": "Password is required",
      "string.pattern.base":
        "Password must be 5-15 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
});

export const userSignInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Invalid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});
