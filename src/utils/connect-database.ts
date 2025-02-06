import {
  Connection,
  ConnectionOptions,
  createConnection,
} from "mysql2/promise";

let isConnected = false;
let conn: Connection | undefined = undefined;

export const connectDatabase = () => {
  return new Promise<Connection | undefined>(async (resolve, reject) => {
    if (isConnected) {
      console.info("Database already connected!");
      return resolve(conn);
    }
    try {
      const config: ConnectionOptions = {
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER_NAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST_NAME,
        multipleStatements: true,
      };
      conn = await createConnection(config);
      isConnected = true;
      console.info("Database connected!");
      return resolve(conn);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
