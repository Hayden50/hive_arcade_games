## Hive Arcade Decentralized Gaming Suite

This project is a decentralized game suite developed for CS4675/6675 (Advanced Internet Computing) at Georgia Tech. It operates over a Local Area Network (LAN) without relying on any centralized networking scheme, using UDP broadcast and PeerJS on WebRTC for communication. The suite currently offers two games (Tic-Tac-Toe and WordHunt) and features a system where players can post games to the server, allowing other players to accept and play them. Additionally, the suite includes cached user data including usernames and a trophy system to represent players' skill levels in the games.

### Features:

    Decentralized Gameplay: The game suite operates over LAN without relying on any centralized networking infrastructure.
    UDP Broadcast: Communication between players is facilitated through UDP broadcast, ensuring efficient and low-latency communication.
    Multiple Games: The suite currently offers two games for players to choose from, with more to come in the future.
    Game Posting and Acceptance: Players can post games to the server, and others can accept and play them, fostering a dynamic gaming experience.
    Trophy System: The suite includes a trophy system to represent players' skill levels in the games, adding a competitive element to the gameplay experience.

### Games:

    Tic-Tac-Toe: Classic Tic-Tac-Toe experience, where each player competes in a turn based environment to try to get three in a row.
    Word Hunt: Both players compete to find as many words as possible in 30 minutes

### Getting Started:

    1. Install NodeJS at https://nodejs.org/en/download/
    2. Install local packages with `npm install`
    3. Launch Hive Arcade with `./start.sh`

### Usage:

    Creating a hosted game: Choose which game you want to host by clicking either "CREATE A WORD HUNT GAME" or "CREATE A TIC-TAC-TOE GAME"
    Browsing Open Games: Players can browse the list of available games by clicking "CLICK TO JOIN A GAME" and accept those they wish to play.
    Accepting a Game: Games will be automatically accepted when clicked on from the game join modal.
    User Creation: Create a username to represent yourself by clicking on the top right button title "Click here to login!".
    User Deletion: If logged in, remove your user by clicking the username in the top left and then clicking "Logout".
    Trophy System: Compete against other players and earn trophies to showcase your skill level. The trophies associated with the account are visible in the top right.
