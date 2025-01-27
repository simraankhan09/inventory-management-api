export type IResponse = {
  code: string;
  message: string;
  payload?: any;
};

export enum CommonStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum UserType {
  USER = "USER",
  ADMIN = "ADMIN",
}

export type CommonAddressType = {
  buildingNo: number;
  street: string;
  city: string;
  postalCode: number;
};

export interface PaginatedResponse<T> {
  content: T[];
  total: number;
  current: number;
  size: number;
}
