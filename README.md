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


### Names:

* `users_next_id` - int for user ids
* `user:USER_ID` - user details (hash)
* `user.emails` - users by mail (hash) with field_key = EMAIL, field_value = USER_ID

* `apiKeys` - hash with key: HASHED_API_KEY, value: userId
* `apiKey:HASHED_API_KEY` - hash with api key details: created, userId

* `channels` - sorted set with all channels. (The algorithm for the score is not clear yet)
* `channel:CHANNEL_ID.posts` - sorted set with value = POST_ID and score = post_id

* `post:POST_ID` - hash with post details
* `global.posts` - sort set with all posts, score is the "hottnes"
