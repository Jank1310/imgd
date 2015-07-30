FORMAT: 1A

# imgd API
imgd is a image board with nice layout and unlimited channels.

This api documentation is written in [blueprint](https://apiblueprint.org/).
You can view it as a local server with [aglio](https://github.com/danielgtaylor/aglio) using the following command:

    aglio -i ApiDocumentation.md -s

## Authentication
The API uses an token based authentication. Later version might use an official standard like OAUTH.

# API Root [/]
Returns the version of the api.

## GET

+ Response 200 (application/json)

        {
          "version": "1"
        }

# Group Registration

## Registration [/register]

### POST

+ Request (application/json)

        {
          "username": "Jon Doe",
          "email": "jondoe@internet.com",
          "password": "some secret password"
        }

+ Response 201 (application/json)

            {
              "id": "userID",
              "name": "Jon Doe",
              "email": "jondoe@zirkel.io"
            }

+ Response 400
Response if email address is not correctly formed, password is to short N < 4
or username is to short or to long 3 <= N <= 15

  + Body

            {
              "error":ERROR_DESCRIPTION,
              "errorCode": 1/2/3
            }


+ Response 409
Response if given email is already registered.

      + Body

## Login [/login]

### POST

+ Request (application/json)

        {
          "email": "jondoe@internt.com",
          "password": "some secret password"
        }

+ Response 200 (application/json)
Response if the credentials are valid

  + Body

            {
              "userId": "134324532",
              "email": "jondoe@internet.com",
              "username": "Jon Doe",
              "apiKey": "someSecretAPIKey"
            }

+ Response 401
Response if the credentials are invalid

  + Body


# Group Channels and posts

## Recent channels [/recent/channels{?count}]

+ Parameters
    + count (integer, optional) - number of channels to return. Max value = 100

### GET
Returns the recent channels sort by creation time

+ Response 200 (application/json)

  + Body

            {
              'recentChannels': [
                "channel1",
                "channel2",
                "channel3"
              ]
            }

## Channels [/c/{channel}{?before}{?count}]

+ Parameters
    + channel (string, optional) - name of the channel
    + before (string, optional) - select from which post to start
    + count (integer, optional) - number posts max 100

### GET
Returns the posts of a channel. If the channel does not exist,
an empty posts array is returned.

+ Response 200 (application/json)

  + Body

            {
              "posts": [
                {
                  "user": {
                    "id": 134345
                    "username": "Jon Doe"
                  },
                  "message": "Some message",
                  "image": "link to the image"
                }
              ]
            }

## Add Post [/c/{channel}]
Adding a post to an non existent channel will "create" the channel.

+ Parameters
    + channel (string, optional) - name of the channel

### POST
+ Request (multipart/form-data)
Send message and other values as json.
Send image another part

  + Body

            {
                "message": "The message"
            }

+ Response 201 (application/json)
Response if the post is successfully added to the channel.

  + Body

            {
              "user": {
                "id": 134345
                "username": "Jon Doe"
              },
              "channel": "channelname",
              "message": "Some message",
              "image": "link to the image"
            }
