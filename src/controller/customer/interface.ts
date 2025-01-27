import { CommonAddressType } from "../../common/types";

export interface CustomerCreateResource {
  firstName: string;
  lastName: string;
  address: CommonAddressType;
  telephone?: string;
  dateOfBirth?: string;
  identificationNo: string;
  identificationTypeId: number;
}

export interface CustomerSearchResponse {
  id: number;
  firstName: string;
  lastName: string;
  common_address_id: number;
  telephone?: string;
  dateOfBirth?: string;
  customer_ref_code: string;
  identification_id: number;
  userId: number;
}
