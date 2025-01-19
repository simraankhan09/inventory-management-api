import Joi from "joi";

export const identificationCreateSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name should be character",
    "any.required": "Name is required",
    "string.empty": "Name is cannot be empty",
  }),
});
