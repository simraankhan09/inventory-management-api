import { CommonAddressType } from "../../common/types";

export interface StoreCreateResource {
  name: string;
  registrationNo: string;
  address: CommonAddressType;
}
