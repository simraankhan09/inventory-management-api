import { NextFunction, Request, Response } from "express";
import { IResponse } from "../../common/types";
import { IdentificationTypeCreateResource } from "./interface";
import { identificationCreateSchema } from "../../schema/identification-type";
import { errorCode } from "../../common/error-code";
import { connectDatabase } from "../../utils/connect-database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ResponseBuilder } from "../../common/response-builder";

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

export const getAllIdentificationTypes = async (
  request: Request,
  response: Response<IResponse>,
  next: NextFunction
) => {
  const responseBuilder = new ResponseBuilder(response);
  try {
    const conn = await connectDatabase();
    if (!conn) return;
    const query = "SELECT * FROM identification_types";
    const [identificationTypes] = await conn.query<RowDataPacket[]>(query);
    return responseBuilder
      .setCode("")
      .setMessage("")
      .setStatusCode(200)
      .setPayload(identificationTypes)
      .build();
  } catch (error) {
    const errorObj = error as any;
    responseBuilder.setCode(errorObj?.code);
    responseBuilder.setMessage(errorObj?.message);
    responseBuilder.setStatusCode(500);
    return responseBuilder.build();
  }
};
