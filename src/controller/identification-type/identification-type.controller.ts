import { NextFunction, Request, Response } from "express";
import { IResponse } from "../../common/types";
import { IdentificationTypeCreateResource } from "./interface";
import { identificationCreateSchema } from "../../schema/identification-type";
import { errorCode } from "../../common/error-code";
import { connectDatabase } from "../../utils/connect-database";
import { ResultSetHeader } from "mysql2";

export const createIdentificationType = async (
  request: Request<any, any, IdentificationTypeCreateResource>,
  response: Response<IResponse>,
  next: NextFunction
) => {
  try {
    const { error } = identificationCreateSchema.validate(request.body, {
      abortEarly: false,
    });
    if (error) {
      response.status(400).json({
        code: errorCode.invalidIdentificationCreateRequest,
        message: "Invalid identification type create request",
        payload: error.details.map((err) => err.message),
      });
      return;
    }
    const conn = await connectDatabase();
    if (!conn) return;
    const instertIdentificationTypeQuery =
      "INSERT INTO identification_types (name) VALUES (?)";
    const [result] = await conn.query<ResultSetHeader>(
      instertIdentificationTypeQuery,
      [request.body.name]
    );
    if (result.affectedRows === 1) {
      response.status(201).json({
        code: "201",
        message: "Identification Type Created",
      });
    } else {
      response.status(400).json({
        code: errorCode.identificationTypeCreateError,
        message: "Identification type created failed",
      });
    }
  } catch (error) {
    const errorObj = error as any;
    response.status(500).json({
      code: errorObj?.code,
      message: errorObj?.message,
    });
  }
};
