'use strict';

//users
module.exports.USRS_ID_KEY = 'users_next_id';
module.exports.USERS_HASH_PREFIX = 'user:'; //e.g. users:1
module.exports.EMAIL_TO_USER_ID_HASH = 'mail_to_user_id'; //e.g. jondoe@internet.com 1
//apiKeys
module.exports.API_KEYS_TO_USER_ID_HASH = 'apiKeys';
module.exports.API_KEYS_HASH_PREFIX = 'apiKey:'; //apiKey:sdfajoiawroeiaajoigjg

//channels
module.exports.CHANNELS_SET = 'channels';
module.exports.CHANNELS_SORT_BY_CREATION = 'channels.sorted_time';
module.exports.CHANNEL_PREFIX = 'postids:'; //channel:channel_name
module.exports.CHANNEL_POSTS_POSTFIX = ':posts';

//posts
module.exports.POSTS_PREFIX = 'post:'; //posts:uniqueid
module.exports.POSTS_ID_KEY = 'posts_next_id';
