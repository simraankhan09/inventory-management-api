import { NextFunction, Request, Response } from "express";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import { UserAuthResource } from "./interface";
import { CommonStatus, IResponse } from "../../common/types";
import { connectDatabase } from "../../utils/connect-database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import { userAuthSchema, userSignInSchema } from "../../schema/user-auth";
import { errorCode } from "../../common/error-code";

export const userSignUp = async (
  request: Request<any, any, UserAuthResource>,
  response: Response<IResponse>,
  next: NextFunction
) => {
  try {
    const { error } = userAuthSchema.validate(request.body, {
      abortEarly: false,
    });
    if (error) {
      response.status(400).json({
        code: errorCode.authError,
        message: "Authentication failed",
        payload: error.details.map((err) => err.message),
      });
      return;
    }
    const conn = await connectDatabase();
    if (!conn) return;
    const { email, password } = request.body;
    const selectUserByEmailQuery = `
        SELECT *
        FROM users
        WHERE email = ?
    `;
    const [rows] = await conn?.execute<RowDataPacket[]>(
      selectUserByEmailQuery,
      [email]
    );
    if (Array.isArray(rows) && rows[0]) {
      response.status(400).json({
        code: errorCode.emailInUsed,
        message: "Email already registered",
      });
      return;
    }

    const salt = genSaltSync(10);
    const hashPassword = hashSync(password, salt);

    const insertUserQuery =
      "INSERT INTO users(email, password, status) VALUES(?,?,?)";
    const [insertRows] = await conn.execute<ResultSetHeader>(insertUserQuery, [
      email,
      hashPassword,
      CommonStatus.ACTIVE,
    ]);
    if (insertRows.affectedRows === 1) {
      response.status(201).json({
        code: "201",
        message: "Created",
        payload: { userId: insertRows.insertId },
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

export const userSignIn = async (
  request: Request<any, any, UserAuthResource>,
  response: Response<IResponse>,
  next: NextFunction
) => {
  try {
    const { error } = userSignInSchema.validate(request.body, {
      abortEarly: false,
    });
    if (error) {
      response.status(400).json({
        code: errorCode.authError,
        message: "Authentication failed",
        payload: error.details.map((err) => err.message),
      });
      return;
    }
    const conn = await connectDatabase();
    if (!conn) return;
    const { email, password } = request.body;
    const selectUserByEmailQuery = `
            SELECT *
            FROM users
            WHERE email = ?
        `;
    const [userRows] = await conn?.execute<RowDataPacket[]>(
      selectUserByEmailQuery,
      [email]
    );
    if (!userRows.length) {
      response.status(400).json({
        code: errorCode.authError,
        message: "Email not match",
      });
      return;
    }
    if (!compareSync(password, userRows[0].password)) {
      response.status(400).json({
        code: errorCode.authError,
        message: "Password not match",
      });
      return;
    }
    const payload = {
      email: userRows[0].email,
      userId: userRows[0].id,
      role: userRows[0].role,
    };
    const token = jwt.sign(payload, String(process.env.JWT_SECRET), {
      expiresIn: "7d",
    });
    const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    response.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + sevenDaysInMilliseconds),
    });
    response.status(200).json({
      code: "200",
      message: "",
      payload: { token },
    });
  } catch (error) {
    const errorObj = error as any;
    response.status(500).json({
      code: errorObj?.code,
      message: errorObj?.message,
    });
  }
};

export const getUserDetails = async (
  request: Request<any, any, UserAuthResource>,
  response: Response<IResponse>,
  next: NextFunction
) => {
  try {
    const { userId } = (request as any).userData;
    if (!userId) {
      response.status(400).json({
        code: errorCode.userIdNotFound,
        message: "User ID not found",
      });
      return;
    }
    const selectUserByIdQuery = "SELECT * FROM users WHERE id = ?";
    const conn = await connectDatabase();
    if (!conn) return;

    const [rows] = await conn.query<RowDataPacket[]>(selectUserByIdQuery, [
      userId,
    ]);
    if (!rows.length) {
      response.status(400).json({
        code: errorCode.userNotFound,
        message: "User not found",
      });
      return;
    }
    const { id, email, role, created_date, status, store_id } = rows[0];
    const payload = {
      id,
      email,
      role,
      createdDate: created_date,
      status,
      storeId: store_id,
    };
    response.status(200).json({
      code: "200",
      message: "",
      payload,
    });
  } catch (error) {
    const errorObj = error as any;
    response.status(500).json({
      code: errorObj?.code,
      message: errorObj?.message,
    });
  }
};
