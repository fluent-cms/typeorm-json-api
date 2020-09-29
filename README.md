# why this lib
This is a generic crud router, with several lines of code, you get crud json web api for all your type orm entities
``` typescript
import { repoRouter, setOrmConfig } from "typeorm-json-api";
const app = express()
app.use('/api/repos', repoRouter)
```

suppose you have entity user, then you have the following webapi
- get /api/repos/user 
- get /api/repos/user/:id
- post /api/repos/user
- put /api/repos/user/:id
- delete /api/repos/user/:id

# useage
## if you are starting a new project, you can clone https://github.com/jaikechen/typeorm-json-api/tree/master/src/app as an starter.

## if you want add this lib to an exists project
### install the type orm and express
``` s
npm i express  @types/express --save
```
### install type orm
``` s
npm i typeorm sqlite reflect-metadata --save
```
- typeorm is the typeorm package itself
- sqlite is the underlying database driver. If you are using a different database system, you must install the appropriate package
- reflect-metadata is required to make decorators to work properly

### add your typeorm configuration, ormconfig.ts
```typescript
 export const ormConfig = {
  "type": "sqlite",
  "database": "db.sqlite",
  "entities": [
    "src/entities/*.ts"
  ],
  "logging": false,
  "synchronize": true
}
```
### add entities to /src/entities, e.g. user.ts
```
import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
}
```

### add router

``` typescript
setOrmConfig(ormConfig)
const app = express()
app.use('/api/repos', repoRouter)
```

