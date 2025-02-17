import { NextFunction, Request, Response } from "express";
import { IResponse, PaginatedResponse } from "../../common/types";
import { ResponseBuilder } from "../../common/response-builder";
import { createCustomerSchema } from "../../schema/customer";
import { CustomerCreateResource, CustomerSearchResponse } from "./interface";
import { errorCode } from "../../common/error-code";
import { connectDatabase } from "../../utils/connect-database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const createCustomer = async (
  request: Request<any, any, CustomerCreateResource>,
  response: Response<IResponse>,
  next: NextFunction
) => {
  try {
    const responseBuilder = new ResponseBuilder(response);
    const { error } = createCustomerSchema.validate(request.body, {
      abortEarly: false,
    });
    if (error) {
      return responseBuilder
        .setCode(errorCode.invalidCustomerCreateRequest)
        .setMessage("Invalid customer create request")
        .setStatusCode(400)
        .setPayload(error.details.map((err) => err.message))
        .build();
    }
    const conn = await connectDatabase();
    if (!conn) return;
    // Check identification type id valid
    const getIdentificationTypeQuery =
      "SELECT * FROM identification_types WHERE id = ?";
    const [identificationTypeRows] = await conn.query<RowDataPacket[]>(
      getIdentificationTypeQuery,
      [request.body.identificationTypeId]
    );
    if (!identificationTypeRows.length) {
      return responseBuilder
        .setCode(errorCode.invalidIdentificationType)
        .setMessage("Invalid identification type")
        .setStatusCode(400)
        .build();
    }
    // Insert address details in common_address table
    const { buildingNo, city, postalCode, street } = request.body.address;
    const insertAddressQuery =
      "INSERT INTO common_address (building_no,street,city, postal_code) VALUES (?,?,?,?)";
    const [addressQueryResult] = await conn.query<ResultSetHeader>(
      insertAddressQuery,
      [buildingNo, street, city, postalCode]
    );

    // Insert identification details in customer_identifications table
    const { identificationNo, identificationTypeId } = request.body;
    const insertIdentificationQuery =
      "INSERT INTO customer_identifications (identification_no, identification_type_id) VALUES (?,?)";
    const [identificationQueryResult] = await conn.query<ResultSetHeader>(
      insertIdentificationQuery,
      [identificationNo, identificationTypeId]
    );

    // Get customer ref code prefix & last index value
    const refCodeQuery = "SELECT * FROM customer_ref_code";
    const [refCodeRows] = await conn.query<RowDataPacket[]>(refCodeQuery);

    // Save customer
    if (
      addressQueryResult.insertId &&
      identificationQueryResult.insertId &&
      refCodeRows.length
    ) {
      const { firstName, lastName, dateOfBirth, telephone } = request.body;
      const saveCustomerQuery = `INSERT INTO 
        customers (first_name, last_name, common_address_id, telephone_no, date_of_birth, customer_ref_code, identification_id, userId)
        VALUES (?,?,?,?,?,?,?,?)
        `;
      const paddedLastIndex = String(refCodeRows[0]["last_index"]).padStart(
        6,
        "0"
      );
      const customerRefCode = `${refCodeRows[0]["ref_code_prefix"]}${paddedLastIndex}`;
      const [saveCustomerQueryResult] = await conn.query<ResultSetHeader>(
        saveCustomerQuery,
        [
          firstName,
          lastName,
          addressQueryResult.insertId,
          telephone ?? null,
          dateOfBirth ?? null,
          customerRefCode,
          identificationQueryResult.insertId,
          // @ts-ignore
          request.userData.userId,
        ]
      );
      if (saveCustomerQueryResult.affectedRows === 1) {
        // Update customer_ref_code table
        const updateRefCodeQuery = `
          UPDATE customer_ref_code
          SET last_index = ?
          WHERE id = ?
        `;
        const lastIndex = refCodeRows[0]["last_index"] + 1;
        await conn.query<ResultSetHeader>(updateRefCodeQuery, [
          lastIndex,
          refCodeRows[0]["id"],
        ]);
        return responseBuilder
          .setCode("201")
          .setMessage("Customer created")
          .setStatusCode(201)
          .build();
      }
    }

    return responseBuilder
      .setCode(errorCode.customerCreateError)
      .setMessage("Something went wrong when creating customer")
      .setStatusCode(400)
      .build();
  } catch (error) {
    console.log(error);
    const responseBuilder = new ResponseBuilder(response);
    const errorObj = error as any;
    responseBuilder.setCode(errorObj?.code);
    responseBuilder.setMessage(errorObj?.message);
    responseBuilder.setStatusCode(500);
    return responseBuilder.build();
  }
};

export const getCustomersByUserId = async (
  request: Request<any, any, any>,
  response: Response<IResponse>,
  next: NextFunction
) => {
  const responseBuilder = new ResponseBuilder(response);
  try {
    const conn = await connectDatabase();
    if (!conn) return;
    // @ts-ignore
    const userId = request.userData.userId;
    const query = "SELECT * FROM customers WHERE userId = ?";
    const [customers] = await conn.query<RowDataPacket[]>(query, [userId]);
    return responseBuilder
      .setCode("")
      .setMessage("")
      .setPayload(customers)
      .setStatusCode(200)
      .build();
  } catch (error) {
    console.log(error);
    const errorObj = error as any;
    responseBuilder.setCode(errorObj?.code);
    responseBuilder.setMessage(errorObj?.message);
    responseBuilder.setStatusCode(500);
    return responseBuilder.build();
  }
};

export const customerSearch = async (
  request: Request<
    any,
    any,
    any,
    {
      searchKey: string;
      keyValue: string;
      pageSize: string;
      pageNumber: string;
    }
  >,
  response: Response<IResponse>,
  next: NextFunction
) => {
  const responseBuilder = new ResponseBuilder(response);
  try {
    const conn = await connectDatabase();
    if (!conn) return;
    const { searchKey, keyValue, pageSize, pageNumber } = request.query;
    // @ts-ignore
    const userId = request.userData.userId;
    const searchKeyValue = `%${keyValue?.toString()}%'`;
    const likeQuery =
      searchKey && keyValue ? `AND ${searchKey} LIKE '${searchKeyValue}` : "";
    const query = `
        SELECT COUNT(*) as total
        FROM customers
        WHERE userId = ${userId} ${likeQuery};
        SELECT *
        FROM customers
        WHERE userId = ${userId} ${likeQuery}
        ORDER BY id DESC
        LIMIT ${pageSize} OFFSET ${Number(pageSize) * Number(pageNumber)};
    `;
    const [results] = await conn.query<RowDataPacket[]>(query);
    const paginatedResponse: PaginatedResponse<CustomerSearchResponse> = {
      content: results[1] as CustomerSearchResponse[],
      current: Number(pageNumber),
      size: Number(pageSize),
      total: results[0][0].total,
    };
    return responseBuilder
      .setCode("")
      .setMessage("")
      .setPayload(paginatedResponse)
      .setStatusCode(200)
      .build();
  } catch (error) {
    console.log(error);
    const errorObj = error as any;
    responseBuilder.setCode(errorObj?.code);
    responseBuilder.setMessage(errorObj?.message);
    responseBuilder.setStatusCode(500);
    return responseBuilder.build();
  }
};
