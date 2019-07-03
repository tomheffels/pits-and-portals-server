# Pits & Portals

# Introduction

This is the server side of a week-long team project we made during game week (week 7) of the Codaisseur Code Academy. The game is called Pits & Portals and it's a Snakes & Ladders type game, where you can either fall down a pit to a lower square, or get beamed up through a portal to a higher square. Pits & Portals can be played with 2-4 players, the first player to land on square 100 wins the game.


## Overview
For this project we used a back end built using an Express API with RESTful endpoints, it uses Sequelize to build the schema for our Postgres database and Socket.io to push game data to clients. Since our time was limited we opted to implement a simple user name "login" (stored in local storage) instead of full-fledged authorization. 


### API Endpoints
* POST (/games) => Creates a new game. 
* GET (/games) => Gets all the games to display in the lobby.
* GET (/games/:id) => Get game status.
* PUT (/games/:id/join) => Player joins a game.
* PUT (/games/:id/start) => Start the game.
* PUT (/games/:id/roll) => Rolls dice, updates position, checks for pits & portals and winner.
* POST (/players) => Create a new user.
* POST (/login) (Not used) => Login/authorization endpoint.


### Client
The client side of this app was built using React, with Redux for state management. It has a game lobby where users can create games and select a game they wish to participate in. You can find the repository for the front end [HERE](https://github.com/tomheffels/pits-and-portals-client/)
