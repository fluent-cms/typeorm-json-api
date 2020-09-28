 export const ormConfig = {
  "type": "sqlite",
  "database": "db.sqlite",
  "entities": [
    "src/entities/*.ts"
  ],
  "logging": false,
  "synchronize": true
}