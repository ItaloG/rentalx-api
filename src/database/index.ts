import { DataSource } from 'typeorm'

const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    username: "",
    password: "",
    database: "rentx"
})

dataSource.initialize()