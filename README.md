# blm-ig-bot-node

## Usage

Fetches all recenty #BLM posts under a certain darkness threshold (targeting black-box posts) & comments a message telling them to use another hashtag. These posts could mask important information on the #BLM hashtag which could in turn save/help many lives.

## Features

Proxy support

Multiple login's support

Duplicate caching

## Installation

npm i

node index ***feel free to sub with pm2 start for stability***

## Instruction

configuration can be found in the config.json file...

cachTTL --> seconds

threshold --> the lower the darker

delay --> seconds

***proxies.txt should be left blank if you would to go proxyless.***

## Issues

Instagram rate-limits kinda suck. Due to this, its probably best to keep comments down to about 1/min/account
