import Joi from "joi";
import { CommonAddressSchema } from "../common/schema";

export const createCustomerSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name cannot be empty",
    "string.base": "First name should be string",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name cannot be empty",
    "string.base": "Last name should be string",
    "any.required": "Last name is required",
  }),
  address: CommonAddressSchema.required().messages({
    "object.base": "Address must be an object.",
    "any.required": "Address is a required field.",
  }),
  telephone: Joi.string()
    .custom((value: string) => {
      let regEx = /^[\d]{10}$/;
      if (value.includes("+")) {
        regEx = /^\+[\d]{11}$/;
      }
      if (!regEx.test(value)) {
        throw new Error();
      }
    })
    .messages({
      "string.pattern.base": "Invalid telephone number",
      "any.custom": "Invalid telephone number",
    }),
  dateOfBirth: Joi.string()
    .isoDate()
    .custom((value, helper) => {
      const regEx = new RegExp(/^[\d]{4}\-[\d]{2}\-[\d]{2}$/);
      if (!regEx.test(helper.original)) {
        throw new Error();
      }
    })
    .messages({
      "any.custom": "Invalid date format",
      "date.format": "Invalid date format",
    }),
  identificationNo: Joi.string().required().messages({
    "string.empty": "Identification number cannot be empty",
    "string.base": "Identification number should be string",
    "any.required": "Identification number is required",
  }),
  identificationTypeId: Joi.number().required().messages({
    "number.empty": "Identification type cannot be empty",
    "any.required": "Identification type is required",
  }),
});
