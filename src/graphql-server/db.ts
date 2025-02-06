import { RowDataPacket } from "mysql2";
import { connectDatabase } from "../utils/connect-database";

const getAllCustomers = async () => {
  try {
    const conn = await connectDatabase();
    if (!conn) return [];
    const query = "SELECT * FROM customers";
    const [customers] = await conn.query<RowDataPacket[]>(query);
    return customers;
  } catch (error) {
    return [];
  }
};

const getAddressById = async (id: number) => {
  try {
    const conn = await connectDatabase();
    if (!conn) return [];
    const query = `SELECT * FROM common_address WHERE id = ${id}`;
    const [address] = await conn.query<RowDataPacket[]>(query);
    return address[0];
  } catch (error) {
    return [];
  }
};

const getIdentificationById = async (id: number) => {
  try {
    const conn = await connectDatabase();
    if (!conn) return [];
    const query = `SELECT * FROM customer_identifications WHERE id = ${id}`;
    const [identifications] = await conn.query<RowDataPacket[]>(query);
    return identifications[0];
  } catch (error) {
    return [];
  }
};

const getIdentificationTypeById = async (id: number) => {
  try {
    const conn = await connectDatabase();
    if (!conn) return [];
    const query = `SELECT * FROM identification_types WHERE id = ${id}`;
    const [identificationTypes] = await conn.query<RowDataPacket[]>(query);
    return identificationTypes[0];
  } catch (error) {
    return [];
  }
};

const getCustomerById = async (id: number) => {
  try {
    const conn = await connectDatabase();
    if (!conn) return undefined;
    const query = `SELECT * FROM customers WHERE id = ${id}`;
    const [customer] = await conn.query<RowDataPacket[]>(query);
    return customer[0];
  } catch (error) {
    return undefined;
  }
};

export {
  getAllCustomers,
  getAddressById,
  getIdentificationById,
  getIdentificationTypeById,
  getCustomerById,
};
