'use strict'

let gulp = require('gulp')
let jshint = require('gulp-jshint')
let mocha = require('gulp-mocha')
let istanbul = require('gulp-istanbul')
let jsonlint = require('gulp-jsonlint')
let jsdoc = require('gulp-jsdoc3')
let processEnv = require('gulp-process-env')

let jsFiles = [
  'gulpfile.js',
  'lib/**/*.js',
  'bin/**/*.js',
  'test/**/*.js'
]

gulp.task('default', function() {
  // place code for your default task here
})

gulp.task('jshint', () => {
  return gulp.src(jsFiles)
  .pipe(jshint({
    asi: true,
    esversion: 6,
    node: true,
    undef: true,
    unused: false,
    devel: true,
    mocha: true
  }))
  .pipe(jshint.reporter('default'))
})

gulp.task('jsonlint', () => {
  return gulp.src('config/**/*.json')
  .pipe(jsonlint())
  .pipe(jsonlint.reporter())
})

gulp.task('pre-test', function () {
  return gulp.src([
    'test/**/*.js'
  ])
  // Covering files
  .pipe(istanbul())
  // Force `require` to return covered files
  .pipe(istanbul.hookRequire())
})

gulp.task('test', ['pre-test'], () => {
  let env = processEnv({
    NODE_ENV: 'test'
  })

  return gulp.src([
    'test/**/*.js'
  ])
  .pipe(env)
  .pipe(mocha({
    reporter: 'spec'
  }))
  .pipe(istanbul.writeReports({
    dir: './coverage',
    reporters: [ 'html' ]
  }))
  .pipe(istanbul.writeReports())
  .pipe(env.restore())
})

gulp.task('jsdoc', () => {
  return gulp.src([
    'lib/**/*.js'
  ])
  .pipe(jsdoc({
    opts: {
      destination: './docs'
    }
  }))
})