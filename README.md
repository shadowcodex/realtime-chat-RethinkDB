[![Slack Status](https://uc-slack.herokuapp.com/badge.svg)](https://uc-slack.herokuapp.com)

# realtime-chat-RethinkDB
A foray into realtime communications. A base for our realtime editor. This version uses RethinkDB instead of GunDB

## Need to know info:

RethinkDB - Node Installation Info: https://www.rethinkdb.com/docs/install-drivers/javascript/

RethinkDB - Server Installation Info: https://www.rethinkdb.com/docs/install/


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
