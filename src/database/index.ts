import { DataSource } from 'typeorm'

const dataSource = new DataSource({
    type: 'postgres',
    host: 'database_ignite', // change localhost
    port: 5432,
    username: "docker",
    password: "ignite",
    database: "rentx",
    entities: ["src/modules/**/entities/*.ts"],
    migrations: ["src/database/migrations/*.ts"]
})

dataSource.initialize()

export { dataSource } 