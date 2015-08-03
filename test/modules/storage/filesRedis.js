var assert = require('assert');
var tmp = require('tmp');
var fs = require('fs');
var redisClient = require('redis').createClient();
var filesRedis = require('../../../src/modules/storage/filesRedis.js')(redisClient);

describe('filesRedis', function() {
  var someTmpFile = null;
  var somefileContent = 'some file content';

  beforeEach(function(cb) {
    redisClient.select(2, function(err) {
      assert.ifError(err);
      redisClient.flushdb(function() {
        someTmpFile = tmp.fileSync();
        fs.writeSync(someTmpFile.fd, somefileContent);
        cb();
      });
    });
  });

  it('should save file and return id', function (done) {
    filesRedis.save(someTmpFile.name, function(err, fileId) {
      assert.ifError(err);
      assert(fileId);
      done();
    });
  });

  it('should get file stream for file', function(done) {
    filesRedis.save(someTmpFile.name, function(err, fileId) {
      filesRedis.exists(fileId, function(_err, exists) {
        assert.ifError(_err);
        assert.ok(exists);
        filesRedis.getFileStream(fileId, function(__err, fstream) {
          assert.ifError(__err);
          var result = '';
          fstream.on('data', function(chunk) {
            result += chunk;
          });
          fstream.on('end', function() {
            assert.equal(result, somefileContent);
            done();
          });
        });
      });
    });
  });
});
