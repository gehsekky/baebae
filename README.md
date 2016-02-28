# BaeBae

An IRC bot written in node js meant to be extremely simple and modular. It's
mostly a wrapper around the npm irc library for now, but I'm still trying to
figure out what BaeBae can/will be.

## Requirements

* node - https://nodejs.org/en/

## Installation

* clone repo to local disk.
* copy *config/default.json* to *config/production.json* or whatever environment you want (eg. development.json, test.json, staging.json)
* edit *config/production.json* with server info and bot name.

open command prompt and navigate to repo directory and type:

    npm install


after everything has installed, type:

    NODE_ENV=production node bin/baebae.js

## Grunt Tasks

To run tests, type:

    grunt test

To generate coverage report:

    grunt coverage
