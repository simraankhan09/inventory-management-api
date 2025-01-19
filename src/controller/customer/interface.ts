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
