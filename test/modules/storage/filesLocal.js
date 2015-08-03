var assert = require('assert');
var tmp = require('tmp');
var fs = require('fs');

describe('filesLocal', function() {
  var filesLocal = null;
  var someTmpFile = null;
  var somefileContent = 'some file content';
  beforeEach(function() {
    var tmpobj = tmp.dirSync();
    filesLocal = require('../../../src/modules/storage/filesLocal.js')(tmpobj.name);
    someTmpFile = tmp.fileSync();
    fs.writeSync(someTmpFile.fd, somefileContent);
  });

  it('should save file and return id', function (done) {
    filesLocal.save(someTmpFile.name, function(err, fileId) {
      assert.ifError(err);
      assert(fileId);
      done();
    });
  });

  it('should get file stream for file', function(done) {
    filesLocal.save(someTmpFile.name, function(err, fileId) {
      filesLocal.exists(fileId, function(exists) {
        assert.ok(exists);
        filesLocal.getFileStream(fileId, function(_err, fstream) {
          assert.ifError(_err);
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
