# imgd-backend
Simple combination between instagram and reddit. Project to refresh redis, node and react skills

# Run develop
To start a hot reload dev server use `grunt serve`

# Run tests
To run tests use `npm test` or `npm run test:watch` if you want to run the test after saving.



# Redis structure

## Channels and posts

* Channel names are saved in a **set**. 
* Post details are saved in a **hash**.
* Post id are saved in a **sorted set** to support easy paging
