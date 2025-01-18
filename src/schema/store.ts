import Joi from "joi";
import { CommonAddressSchema } from "../common/schema";

export const storeCreateSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Store name cannot be empty",
    "any.required": "Store name is required",
  }),
  registrationNo: Joi.string().required().messages({
    "string.empty": "Registration number cannot be empty",
    "any.required": "Registration number is required",
  }),
  address: CommonAddressSchema.required().messages({
    "object.base": "Address must be an object.",
    "any.required": "Address is a required field.",
  }),
});
