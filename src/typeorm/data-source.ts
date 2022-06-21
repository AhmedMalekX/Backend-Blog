import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.TYPEORM_POSTGRES_USERNAME,
  password: process.env.TYPEORM_POSTGRES_PASSWORD,
  database: process.env.TYPEORM_POSTGRES_DATABASE_NAME,
  synchronize: true,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
});
