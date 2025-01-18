import { NextFunction, Request, Response } from "express";
import { IResponse } from "../../common/types";
import { StoreCreateResource } from "./interface";
import { storeCreateSchema } from "../../schema/store";
import { errorCode } from "../../common/error-code";
import { connectDatabase } from "../../utils/connect-database";
import { ResultSetHeader } from "mysql2";

export const createStore = async (
  request: Request<any, any, StoreCreateResource>,
  response: Response<IResponse>,
  next: NextFunction
) => {
  try {
    const { error } = storeCreateSchema.validate(request.body, {
      abortEarly: false,
    });
    if (error) {
      response.status(400).json({
        code: errorCode.invalidStoreCreateRequest,
        message: "Invalid store create request",
        payload: error.details.map((err) => err.message),
      });
      return;
    }
    const conn = await connectDatabase();
    if (!conn) return;
    // Insert data into common_address table with address data
    const { buildingNo, city, postalCode, street } = request.body.address;
    const insertAddressQuery =
      "INSERT INTO common_address(building_no, street, city, postal_code) VALUES(?,?,?,?)";
    const [addressQueryResult] = await conn.query<ResultSetHeader>(
      insertAddressQuery,
      [buildingNo, street, city, postalCode]
    );
    if (addressQueryResult.affectedRows === 1) {
      // Insert data into store table
      const { name, registrationNo } = request.body;
      const commonAddressId = addressQueryResult.insertId;
      const insertStoreQuery =
        "INSERT INTO stores(name, common_address_id, registration_no) VALUES(?,?,?)";
      const [storeQueryResult] = await conn.query<ResultSetHeader>(
        insertStoreQuery,
        [name, commonAddressId, registrationNo]
      );
      if (storeQueryResult.affectedRows === 1) {
        // Update user table with store id
        const { userId } = (request as any).userData;
        const updateUsertableQuery = `
                UPDATE users
                SET store_id = ?
                WHERE id = ?
            `;
        const [userUpdateQueryResult] = await conn.query<ResultSetHeader>(
          updateUsertableQuery,
          [storeQueryResult.insertId, userId]
        );
        if (userUpdateQueryResult.affectedRows === 1) {
          response.status(201).json({
            code: "201",
            message: "Store created",
          });
          return;
        }
      }
    }
    response.status(400).json({
      code: errorCode.storeCreateError,
      message: "Something went wrong while creating store",
    });
  } catch (error) {
    const errorObj = error as any;
    response.status(500).json({
      code: errorObj?.code,
      message: errorObj?.message,
    });
  }
};
