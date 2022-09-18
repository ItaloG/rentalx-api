import { DataSource } from "typeorm";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost", // change localhost to run migration
  port: 5432,
  username: "docker",
  password: "ignite",
  database: "rentx",
  entities: ["src/modules/**/entities/*.ts"],
  migrations: ["src/shared/infra/typeorm/migrations/*.ts"],
});

dataSource.initialize();

export { dataSource };
