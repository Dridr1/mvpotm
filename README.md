# MVP of the Month

In early december 2024 some friends and I wanted to use our win-rate in League of Legends to decide who's the best. After some research i realised Riot has an easy to consume API. So, why don't I code that rank for us?
Here it is!


## Features

- Add players:
  - Add a player to the list using their gamename and tagline

- Generate ranking:
  - Drop the current ranking and fetch through the last 20 ranked games of each added player(it counts flex and solo/duo)

- Get ranking:
  - Get the current ranking

## API Reference

#### {{HOST_NAME}}/summoners

- **POST**: adds a new player to the list
```json
{
    "tagLine": <String>
    "gameName": <String>
}
```

- **GET**: Get all the players stored in the list

- **DELETE**: Removes a player from the list using the puuid
  - **query param**: /:id
    - The puuid

#### {{HOST_NAME}}/ranking

- **POST**: update the ranking

- **GET**: get the current ranking

## Running locally
> You need NodeJS installed (NodeJS v22.12.0 at least)
1. Create a .env file in the repo root and fill the Database url, your Riot Token and the desired PORT
2. run ```npm i``` to install dependencies
3. run ```npm run start``` or ```npm run start:dev``` if you want to change anything