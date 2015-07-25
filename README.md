# imgd-backend
Redis and react based image board + api. Mainly a project to improve redis, node and react skills :-)

## Run develop
To start a hot reload dev server use `grunt serve`

## Run tests
To run tests use `npm test` or `npm run test:watch` if you want to run the test after saving.

## Redis structure

### Channels and posts

* Channel names are saved in a **set**.
* Post details are saved in a **hash**.
* Post id are saved in a **sorted set** to support easy paging

### Users

* User details are saved in a **hash**.
* To find an user by email a **hash** with USERMAIL USERID is used.

### API Keys

API keys are always stored as sha1 hash!

* API keys are saved in a **hash**. Key: apiKey, value:userId.
* API key details are saved in a **hash**: created, apiKey, userId
