# file structure
- package.json                      - for publish npm package
- tsconfig.json                     - need to add     ```"skipLibCheck": true, ```, ```"exclude": ["dist","src/react-redux-fetch"]```
- src/index.ts                      - export everything need to expose to user
- src/app                           - a normal react app created by create react app
- src/app/src/core                  - source code for package
- src/app/.env                      - need to add ```SKIP_PREFLIGHT_CHECK=true```

# to test the package source code
```cd src/react-redux-fetch```
```yarn start```

# to build a npm package
go to root directory
```yarn build```

# why not use npm link
I was plan to create two separate project and use npm link, but it didn't work for me when I was use redux.

# why react test app should be put into src?
I want the package source code in a sub directory of index.ts

# can I put index.ts in test react app?
it seemed the test react app can not start