# why this lib
It helps synchronizing external data to your local database. 
# usage
```typescript
export const mergeRecord = async <T>(
  src: T[], 
  target: T[],
  keyFields: (keyof T)[] | (keyof T),
  valueFields: (keyof T)[] | (keyof T) = undefined,
  insertFunc: (p: T) => void = undefined,
  updateFunc: (p: T) => void = undefined,
  deleteFunc: (p: T) => void = undefined
 )
```

- return value: it return an array of 3 array: array of item need to add, array of item need to update, array of item need to  delete
``` typescript
return [toAdd, toUpdate, toDelete]
```
- src: array of T; a array of items form source data source, e.g. json web api, e.g. database.
- target: array of T; a array of items  from your local database
- keyFields: the primary key, e.g. ID. Or one or several field can uniquely identify a record.
- valueFields: if you know which fields are subjected to change, e.g. price. you can specify these fields to make the comparing more efficient. otherwise you
can leave it undefined, then the function uses deep compare to test if a record is change.
- insertFunc, if you pass a callback function, the callback is called for each item in toAdd<br/>
in the callback function, you could update your local database
```typescript
 if (insertFunc) {
    for (const p of toAdd) {
      await insertFunc(p)
    }
  }
```
- updateFunc and deleteFunc, similar with add Func 


#example
```typescript
class Car {
    constructor (public id:number, 
        public name:string,
        public color:string ){
    }
}

const src = [
    new Car(1, 'Car1', 'red'),
    new Car(2, 'Car2', 'light yellow'),
    new Car(3, 'Car3', 'green'),
]

let target = [
    new Car(1, 'Car1', 'red'),
    new Car(2, 'Car2', 'yellow'),
    new Car(4, 'Car4', 'green'),
]

mergeRecord(src,target,'id',['name','color'],
    x => target.push(x), 
    x => {
        target = target.filter(t=>t.id !== x.id)
        target.push({...x})
   },
    x => {target = target.filter(t=>t.id !==x.id)}
    ).then(result => {
        console.log(result)
        console.log(target)
    })
```
