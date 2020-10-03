import express from "express";
import { ormConfig } from "./config/ormconfig";
import { repoRouter, setOrmConfig } from "./routers/repoCrud";
//import { repoRouter, setOrmConfig } from "typeorm-json-api";
import { testRouter } from "./routers/repoCrudTester";
setOrmConfig(ormConfig)
const app = express()
app.use('/api/repos', repoRouter)
app.use('/test/repos', testRouter)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
})