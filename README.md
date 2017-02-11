# BaeBae

An IRC bot written in node js meant to be extremely simple and modular. It's
mostly a wrapper around the npm irc library for now, but I'm still trying to
figure out what BaeBae can/will be.

## Requirements

* node - https://nodejs.org/en/ (developed/tested with 6.1.0)

## Installation

* clone repo to local disk.
* copy *config/default.json* to *config/production.json* or whatever environment you want (eg. development.json, test.json, staging.json)
* edit *config/production.json* with server info and bot name.

open command prompt and navigate to repo directory and type:

    npm install


after everything has installed, type:

    NODE_ENV=production node bin/baebae.js

## Usage

Some commands that are currently supported:

* `uptime` - displays how long it's been since the bot has been started
* `quote` - displays random quote
  * `add <text>` - adds quote
  * `show <id>` - show quote
  * `remove <id>` - removes quote from db
  * `search <text>` - search for quote ('*' is wildcard)

## Development

* https://trello.com/b/RCFBzOkC - development kanban board