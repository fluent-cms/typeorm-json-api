# why this lib
this lib dependes on Node.js, express, typeorm<br/>
This is a generic CRUD(create, read, update, delete)  router, with several lines of code, you get CRUD json web api for all your type orm entities.

``` typescript
- query records: get /api/repos/yourEntity 
- query by id: get /api/repos/yourEntity/:id
- add a records: post /api/repos/yourEntity
- modify a record: put /api/repos/yourEntity/:id
- del a records: /api/repos/yourEntity/:id
```
query records api supports
- pagignation
- filter on each field 
- order on each field

# usage
suppose you have a repo/entity/model user as following:
```typescript
{id:number, firstName:number, lastName:number}

## /api/repos/user

```
- get all user<br/>
api/repos/user , without any query parameter
- get all user order by id desc<br/>
api/repos/user?id=d
- get the users order by id asc, skip 3, take 2 <br/>
api/repos/user?id=a&s=3&c=2
- find users firstName contains Joe<br/>
api/repos/user?firstName=*Joe
- find users firstName exact match Joe<br/>
api/repos/user?firstName=Joe
- fidnd user id range from 2 to 4<br/>
api/repos/user?id=2~4
- fidnd user id >2 <br/>
api/repos/user?id=2~
- fidnd user id >4 <br/>
api/repos/user?id=~4
# installation
## if you are starting a new project, you can clone https://github.com/jaikechen/typeorm-json-api/tree/master/src/app as an starter.
## if you want add this lib to an exists project
1. install the typeorm and express and this package
```
npm i express  @types/express --save
npm i typeorm sqlite reflect-metadata --save
npm i typeorm-json-api
```

2. add your typeorm configuration 
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

3. add an entity to /src/entities, e.g. user.ts
``` typescript
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
const app = express()
...
setCRUDRouter(ormConfig)
app.use('/api/repos', repoRouter)
```