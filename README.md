[![Slack Status](https://uc-slack.herokuapp.com/badge.svg)](https://uc-slack.herokuapp.com)
[![Visit Unrestricted Coding](https://img.shields.io/badge/Visit-Unrestricted%20Coding-blue.svg)](http://unrestrictedcoding.com)
[![Documentation](https://img.shields.io/badge/View-Documentation-orange.svg)](http://unrestricted-coding.github.io/realtime-chat-RethinkDB/)
![License](https://img.shields.io/badge/LICENSE-MIT-ff69b4.svg)
![Status](https://img.shields.io/badge/Status-Complete-brightgreen.svg)
![jsHint](https://img.shields.io/badge/jsHint-Great-green.svg)
![build](https://img.shields.io/badge/Build-passing-brightgreen.svg)

[![Gitter](https://badges.gitter.im/Unrestricted-Coding/realtime-chat-RethinkDB.svg)](https://gitter.im/Unrestricted-Coding/realtime-chat-RethinkDB?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# Realtime Chat with RethinkDB

[![Join the chat at https://gitter.im/Unrestricted-Coding/realtime-chat-RethinkDB](https://badges.gitter.im/Unrestricted-Coding/realtime-chat-RethinkDB.svg)](https://gitter.im/Unrestricted-Coding/realtime-chat-RethinkDB?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
This is an example of using NodeJS and RethinkDB along with Express and SocketIO to create a realtime chatroom. It should be a fairly simple example to follow, and if not you can jump in the Slack and ask questions.

To install, clone or download this repository to your local machine and follow the steps outlined in the sections below.

Full Documentation Available [Documentation Link](http://unrestricted-coding.github.io/realtime-chat-RethinkDB/)

To View Repository [Goto Github](https://github.com/Unrestricted-Coding/realtime-chat-RethinkDB)

## Live Demo

I've setup a live demo at: [http://realtime-chat.unrestrictedcoding.com](http://realtime-chat.unrestrictedcoding.com)

## Need to know info:

RethinkDB - Node Installation Info: [https://www.rethinkdb.com/docs/install-drivers/javascript/](https://www.rethinkdb.com/docs/install-drivers/javascript/)

RethinkDB - Server Installation Info: [https://www.rethinkdb.com/docs/install/](https://www.rethinkdb.com/docs/install/)


## Install RethinkDB on Ubuntu

I do all of my development for opensource projects on Cloud9 (http://c9.io). And because of that, ubuntu is their choice flavor of linux.

To install RethinkDB paste the following into your terminal and run them:


```Shell
source /etc/lsb-release && echo "deb http://download.rethinkdb.com/apt $DISTRIB_CODENAME main" | sudo tee /etc/apt/sources.list.d/rethinkdb.list
wget -qO- https://download.rethinkdb.com/apt/pubkey.gpg | sudo apt-key add -
sudo apt-get update
sudo apt-get install rethinkdb
```

## Run RethinkDB on Cloud9

We don't want to use port 8080 on Cloud9 for the rethinkdb admin console. This port is used by c9 to display your web project, so we don't want to block that port for use. So instead use the following to run rethinkdb:

```rethinkdb --bind all --http-port 8081```

## Install Dependencies

To install the dependencies run the following commands

```shell
$ npm install -g bower # globablly install Bower package manager
$ npm install          # install local npm build / test dependencies
$ bower install        # install local javascript and css dependencies
```

## Run the app

You can run the app with the following command `node app.js`. You can then go to your browser and view the application. 

Type text in the box and hit send, it should start working!


## Run Tests

To run test you should run the following commands:

```shell
$ node app.js       # starts server
$ grunt test        # tests against server
```

## Generate Documentation

To generate documentation then you just have to run the following command:

```shell
$ grunt doc
```