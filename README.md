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

with query parameters, the get api supports
- pagignation
- filter on each field 
- order on each field

# query parameters usage
suppose you have a repo/entity/model user as following:
```typescript
{id:number, firstName:number, lastName:number}
```
## get /api/repos/user
if the client request the api without parameter, the api will return all users
## get  api/repos/user?s=3&c=2 
- s how many records should skip
- c how many records should return 
- so this example skips the first 3 records, takes 2 records: 
## get api/repos/user?firstName=a
- the key firstName means field name
- a and d are two reserved value, a means order by user asc, d means order by user desc
- so this example return all users, order by firstName asc
## api/repos/user?firstName=*Joe
- query the users whose firstName contains 'Joe'
## api/repos/user?firstName=Joe
- query the users whose firstName exactly match 'Joe'
## api/repos/user?id=2~4
- find user id range from 2 to 4<br/>
## api/repos/user?id=2~
- find user id >= 2 <br/>
## api/repos/user?id=~4
- find user id <= 4

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