# Intro

The skeleton of a node web server fashioned for Raspberry Pi.  It eschews the usual modules (Express, Jade) in favor of ones that are lite and fast (node-simple-router, ECT).

Instructions for getting and running included below.

Also features a development page (`/dev`) where you can check for repo updates, update the server's code from your repo, and restart the server all from the comfort of your browser -- no SSHing required!

For fast UI creation, note that node-simple-router comes with a set of icons: `/icons.png`.  There's an example in `/index.ect`.

As a bonus, a lightweight spinner (CSS based) is included.  Use:

```HTML
<div class="loading-spinner"></div>
```

# Development Setup

## First, get your repo ready

1. Fork this repo using the usual method
2. Rename your fork to something more appropriate for your effort
3. SSH into your Pi

> After SHH'ing into the Pi, all commands below are run on the Raspberry Pi.
> Note: these require that the target Pi has Internet access

## SSH in

> These are the Raspberry Pi defaults

host: raspberrypi

user/pw: pi/raspberry

## Get node.js

```bash
$ wget http://nodejs.org/dist/latest/node-v5.6.0-linux-armv6l.tar.gz
$ tar -xvf node-v5.6.0-linux-armv6l.tar.gz
$ cd node-v5.6.0-linux-armv6l/
$ sudo cp -R * /usr/local
```

## Get your repo

```bash
$ cd ~
$ git clone https://[your repo].git
```

## If your repo host requires a password (BitBucket does), set Git to keep the password

> This enables you to update your server's code directly from your repo using the Web `/dev` page (no need to SSH in)

```bash
$ git config credential.helper store
$ git pull  # force prompting for the password
Already up-to-date.
```

## Get the server's node dependencies
```bash
$ cd [your repo dir]
$ sudo npm install
```

## Run it

```bash
$ node ~/[your repo dir]/server.js
```

### Background and foreground it

```bash
# start it in the background
$ node ~/[your repo dir]/server.js &
```

```bash
# bring it to the foreground
$ jobs
[1]+  Running                 node /home/pi/[your repo dir]/server.js &
$ fg %1

# <CTRL>-c will kill it
```

# Hit the server from a browser

(Obviously not on the Raspberry but on some machine that can "see" it)

http://[the ip address from SSH'ing]:8080

  or

http://raspberrypi.local:8080

## A page for developers

> NOTE: The magic on this page will only work if...
>
>a) The pi in question can communicate with your repo host (GitHub, BitBucket, etc.)
>
>b) Git has recorded your repo host password (if needed by your repo host.  See above)

The page [http://raspberrypi.local:8080/dev](http://raspberrypi.local:8080/dev) allows you to do the following:

1. Check if your server's code is up-to-date (or not)
1. Update it from your host repo
1. Restart the server (needed for an update to take affect)

# The web server's config system

The node server gets its settings from three possible sources.

1. Hardcoded values (in the code)
2. From platform-dependent config files within the server's source files

  * Linux (Raspberry Pi): `~/[your repo dir]/config/linux.json`
  * Mac : `~/[your repo dir]/config/darwin.json`
  * Windows : `~/[your repo dir]/config/win32.json`
  * [other] : `~/[your repo dir]/config/[node's process.platform value].json`

3. From an optional local file

  * `~/.pinodeserver/webconfig.json`

The current defined settings are:

```json
{
    "port"    : 8080,
    "serverConfigDir" : "[note: while it can be overridden do so with care]",
    "localConfig" : "[note: can be overidden to place local config elsewhere]"
}
```

Each subsequent source overwrites values from all the previous, so we have a hierarchy of values.

The local file allows you to override settings when you're running on your development machine vs. your Pi.
