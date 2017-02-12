'use strict'

let gulp       = require('gulp')
let gulpMocha  = require('gulp-mocha')
let istanbul   = require('gulp-istanbul')
let jsonlint   = require('gulp-jsonlint')
let eslint     = require('gulp-eslint')
let jsdoc      = require('gulp-jsdoc3')
let processEnv = require('gulp-process-env')

gulp.task('default', function() {
  // place code for your default task here
})

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**', '!docs/**', '!coverage/**', '!logs/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
})

gulp.task('jsonlint', () => {
  return gulp.src('config/**/*.json')
  .pipe(jsonlint())
  .pipe(jsonlint.reporter())
})

gulp.task('pre-test', function () {
  return gulp.src([
    'lib/**/*.js'
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
  .pipe(gulpMocha({
    reporter: 'spec'
  }))
  .pipe(istanbul.writeReports({
    dir: './coverage',
    reporters: [ 'html' ]
  }))
  .pipe(istanbul.writeReports())
  .pipe(env.restore())
  .once('end', function () {
    process.exit()
  })
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