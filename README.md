# imgd-backend
Redis and react based image board + api. Mainly a project to improve redis, node and react skills :-)

## Run develop
To start a hot reload dev server use `grunt serve`

## Run tests
To run tests use `npm test` or `npm run test:watch` if you want to run the test after saving.

## Redis structure

* `users_next_id` - int for user ids
* `user:USER_ID` - user details (hash)
* `user.emails` - users by mail (hash) with field_key = EMAIL, field_value = USER_ID

* `apiKeys` - hash with key: HASHED_API_KEY, value: userId
* `apiKey:HASHED_API_KEY` - hash with api key details: created, userId

* `channels` - sorted set with all channels. (The algorithm for the score is not clear yet)
* `channels.sorted_last_post` - sorted set of all channels. Score == creation time
* `channels.sorted_number_of_post` - sorted set of all channels. Score == number of posts
* `channel:CHANNEL_ID.posts` - sorted set with value = POST_ID and score = post_id

* `post:POST_ID` - hash with post details
* `global.posts` - sorted set with all (last 1000) posts. score == post id
* `global.posts.hot` - sorted set with all (last 1000) posts. Score == hottnes (creation + log(likes))
