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
    + channel (string, optional) - name of the channel.
    + before (string, optional) - select from which post to start
    + count (integer, optional) - number posts max 100

### GET
Returns the posts of a channel. If the channel does not exist,
an empty posts array is returned.
If no channel is given, a list of global posts (from all channels) is returned.

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
    + channel (string, optional) - name of the channel. 1 < Len < 26, only alphanumeric + underscore.

### POST
+ Request (application/json)
Send message and other values as json.
The image must be uploaded upfront!

  + Body

            {
                "message": "The message",
                "imageId": "A_VALID_IMAGE_ID"
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
              "imageId": "IMAGE_ID",
              "imageUrl": "url of image"
              "previewImageId": "STREAM_IMAGE_ID",
              "previewImageUrl": "url of smaller version"
            }

# Group Images

## Add image [/images/]
Upload an image and get url/id of the full size image and the url/id of the smaller sized image.

### POST
+ Request  (multipart/form-data)

+ Response 201

  + Body

            {
              "imageId": "IMAGE_ID",
              "imageUrl": "url of image",
              "streamImageId": "STREAM_IMAGE_ID",
              "streamImageUrl": "url of smaller version"
            }

## Get image [/images/{imageId}]

+ Parameters
    + imageId (string, required) - id of the image

### GET

+ Response 200 (image/jpeg)

  + Body


+ Response 404

  + Body
