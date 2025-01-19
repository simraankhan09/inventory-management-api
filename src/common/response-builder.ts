import { Response } from "express";
import { IResponse } from "./types";

export class ResponseBuilder {
  private code: string = "";
  private message: string = "";
  private statusCode: number = 200;
  private payload: any;

  constructor(private response: Response<IResponse>) {}

  public setCode(code: string) {
    this.code = code;
    return this;
  }

  public setMessage(message: string) {
    this.message = message;
    return this;
  }

  public setStatusCode(statusCode: number) {
    this.statusCode = statusCode;
    return this;
  }

  public setPayload(payload: any) {
    this.payload = payload;
    return this;
  }

  public build() {
    return this.response.status(this.statusCode).json({
      code: this.code,
      message: this.message,
      payload: this.payload,
    });
  }
}
