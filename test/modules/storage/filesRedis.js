var assert = require('assert');
var tmp = require('tmp');
var fs = require('fs');
var redisClient = require('redis').createClient();

var fileDirectory = tmp.dirSync();
var filesRedis = require('../../../src/modules/storage/filesRedis.js')(redisClient, fileDirectory.name);

describe('filesRedis', function() {
  var someTmpFile;
  beforeEach(function(cb) {
    someTmpFile = tmp.tmpNameSync();
    var stream = fs.createReadStream('./test/fixtures/test_image_1.jpg').pipe(fs.createWriteStream(someTmpFile));
    stream.on('finish', function() {
      redisClient.select(2, function(_err) {
        assert.ifError(_err);
        redisClient.flushdb(cb);
      });
    });
  });

  it('should save file and return id', function (done) {
    filesRedis.save(someTmpFile, function(err, fileId) {
      assert.ifError(err);
      assert(fileId);
      done();
    });
  });

  it('should get file stream for file', function(done) {
    filesRedis.save(someTmpFile, function(err, fileId) {
      assert.ifError(err);
      filesRedis.exists(fileId, function(_err, exists) {
        assert.ifError(_err);
        assert.ok(exists);
        filesRedis.getFileStream(fileId, function(__err, fstream) {
          assert.ifError(__err);
          var result = '';
          fstream.on('data', function(chunk) {
            result += chunk.toString();
          });
          fstream.on('end', function() {
            content = fs.readFileSync('./test/fixtures/test_image_1.jpg');
            assert.deepEqual(result, content.toString());
            done();
          });
        });
      });
    });
  });
});
