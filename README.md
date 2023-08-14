# Cards against Humanity

# [Play](https://cah.rowaniscool.cf)

An online Cards against Humanity clone

## How to start a game
TODO

## How it works
The games are almost completely P2P, with the server only being used to serve assets, and to provide a public game list.

Socket.io connects the host to the server to provide the mentioned public game list. Socket.io is used rather than a traditional REST api, as it prevents abandoned rooms by sending disconnect signals consistently, while also allowing independent games completely disconnected from the central server. Everything else uses a P2P connection to a central host (the room creator) to transfer data.
