# How to use
start
```
npm install
npm start
```
start in watch Mode
npm start:dev

# to test
## add some dummy test data
http://localhost:3000/test/init

## see all users
http://localhost:3000/test/read/admin/user/

## which uses user2 can see
http://localhost:3000/test/read/user2/user/

## add a post as user2
http://localhost:3000/test/create/user2/post/1/2/user2Post'

## see the post
http://localhost:3000/test/read/user2/post

## delete a post create by user2 as user3
http://localhost:3000/test/delete/user3/post/1

## delete a post create by user2 as user2
http://localhost:3000/test/delete/user2/post/1

## update post 
http://localhost:3000/test/update/user2/post/9/subject/user2Postupdate'
