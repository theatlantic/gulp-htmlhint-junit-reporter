/* eslint-env node, mocha */
'use strict';

const proxyquire = require('proxyquire');
const htmlhint = require('gulp-htmlhint');
const gutil = require('gulp-util');
const sinon = require('sinon');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const vfs = require('vinyl-fs');

var mockGulpUtil = {
  log: sinon.spy(),
  colors: gutil.colors,
};

const junitReporter = proxyquire('..', {'gulp-util': mockGulpUtil});

const chai = require('chai');

chai.use(require('sinon-chai'));
chai.use(require('chai-fs'));

const expect = chai.expect;

describe('gulp-htmlhint-junit-reporter', function() {
  var logSpy;
  var tempDir;

  beforeEach((done) => {
    // Reset the spy on gulp-util's log before each test
    mockGulpUtil.log = logSpy = sinon.spy();
    tempDir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
    done();
  });

  afterEach((done) => {
    if (tempDir) {
      fs.emptyDirSync(tempDir);
      fs.rmdirSync(tempDir);
      tempDir = undefined;
    }
    done();
  });

  it('should run tests', function(done) {
    expect(2 + 2).to.equal(4);
    done();
  });

  it('should generate an output file', function(done) {
    const outfile = path.join(tempDir, 'output.xml');
    const stream = vfs.src('test/fixtures/invalid.html')
      .pipe(htmlhint())
      .pipe(htmlhint.reporter(junitReporter(outfile)))
      .pipe(vfs.dest(tempDir));

    stream.on('error', function(err) {
      done(err);
    });

    stream.once('end', () => {
      expect(outfile).to.be.a.file();
      done();
    });
  });

  it('should log output', function(done) {
    const outfile = path.join(tempDir, 'output.xml');
    const stream = vfs.src('test/fixtures/invalid.html')
      .pipe(htmlhint({
        'tag-self-close': true
      }))
      .pipe(htmlhint.reporter(junitReporter(outfile)))
      .pipe(vfs.dest(tempDir));

    stream.on('error', function(err) {
      done(err);
    });

    stream.once('end', () => {
      expect(logSpy).to.have.been.called;
      expect(gutil.colors.stripColor(logSpy.getCall(0).args[0])).to.equal(
        '[L5:C5] The empty tag : [ meta ] must be self closed. (tag-self-close)');
      expect(gutil.colors.stripColor(logSpy.getCall(2).args[0])).to.equal([
        '[L9:C1] Tag must be paired, missing: [ </h1> ], start tag match ',
        'failed [ <h1> ] on line 8. (tag-pair)'].join(''));
      done();
    });
  });

});
