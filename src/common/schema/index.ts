import Joi from "joi";

export const CommonAddressSchema = Joi.object({
  buildingNo: Joi.number().required().messages({
    "number.base": "Invalid building number, should be number",
    "any.required": "Building number is required",
  }),
  street: Joi.string().required().messages({
    "string.empty": "Street name cannot be empty",
    "any.required": "Street name is required",
  }),
  city: Joi.string().required().messages({
    "string.empty": "City name cannot be empty",
    "any.required": "City name is required",
  }),
  postalCode: Joi.number().required().messages({
    "number.base": "Invalid postal code, should be number",
    "any.required": "Postal code  is required",
  }),
});
