# why this lib
Leveraging Express and TypeOrm, this lib helps you add a generic CRUD(create, read, update, delete) router to you Node.js application.
With several lines of code, you get CRUD json web api for all your type orm entities.<br/> You can also add  authorization handler to secure the CRUD router.

``` typescript
- query records: get /api/repos/yourEntity 
- query by id: get /api/repos/yourEntity/:id
- add a records: post /api/repos/yourEntity
- modify a record: put /api/repos/yourEntity/:id
- delete a records: /api/repos/yourEntity/:id
```

with query parameters, the get api supports
- pagination
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
- key 's' - how many records should skip
- key 'c' - how many records should return 
- so this example skips the first 3 records, takes 2 records: 
## get api/repos/user?firstName=a
- the key firstName means field name
- 'a' and 'd' are two reserved values, 'a' means order by user asc, 'd' means order by user desc
- so this example return all users, order by firstName asc
## api/repos/user?firstName=*Joe
- query the users whose firstName contains 'Joe', 
```sql
firstName like '%Joe%'
```
## api/repos/user?firstName=Joe
- query the users whose firstName exactly match 'Joe'
```sql
firstName = 'Joe'
```
## api/repos/user?id=2~4
- find user id range from 2 to 4<br/>
```sql
firstName between (2,4)
```
## api/repos/user?id=2~
- find user id >= 2 <br/>
## api/repos/user?id=~4
- find user id <= 4

# installation
## if you are starting a new project,
 you can clone https://github.com/jaikechen/typeorm-json-api/tree/master/src/app as an starter.
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
import {createCRUDRouter} from 'typeorm-json-api'
const app = express()
...
app.use('/api/repos', createCRUDRouter(ormConfig))
```

# log
the second parameter of createCRUDRouter is a callback function to log CRUD request
## default log
```typescript
createCRUDRouter(ormConfig)
or
createCRUDRouter(ormConfig, undefined)
```
## disable log
```typescript
createCRUDRouter(ormConfig,null)
```
## customze log
```typescript
createCRUDRouter(ormConfig,(level,msg)=>{
  /* your own log code*/ 
  })
```
# authorization
the third parameter of createCRUDRouter is the verifyToken handler,
``` typescript
app.use('/api/repos', createCRUDRouter(ormConfig, undefined,verifyToken))
```
the following is a very simple version of verify token handler
``` typescript
const secret = 'very secret'
function getToken(req: Request, res: Response) {
    const token = jwt.sign({ username: 'joe@a.com' }, secret, { expiresIn: '1800s' })
    res.send(token)
}
function verifyToken(req, res, next) {
    console.log('in verify token')
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.sendStatus(401)
    }
    jwt.verify(token, secret, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403)
        }
        req.user = user
        next() // pass the execution off to whatever request the client intended
    })
}
```