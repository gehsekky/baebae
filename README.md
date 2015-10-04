# BaeBae

An IRC bot written in node js meant to be extremely simple and modular. It's
mostly a wrapper around the npm irc library for now, but I'm still trying to
figure out what BaeBae can/will be.

## Requirements

* node - https://nodejs.org/en/

## Installation

* Windows
  * clone repo to local disk.
  * edit *config/default.json* with server info and bot name.
  * open command prompt and navigate to repo directory and type:



    node install


after everything has installed, type:


    node bin/baebae.js

## Tests
To run tests, type:

    grunt test

To generate coverage report:

    grunt coverage
