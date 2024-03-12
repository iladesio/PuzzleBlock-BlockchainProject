# PuzzleBlock

PuzzleBlock is a decentralized gaming application (DApp) designed to demystify the fundamental aspects of blockchain technology through engaging gameplay. In this journey, users will progress through various levels, have the opportunity to purchase NFTs, and discover the vast potential of the blockchain universe. Players from around the globe can compete, enhancing the learning experience by integrating the competitive spirit with educational value.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them.

- [Node.js and npm](https://nodejs.org/en/download/) (npm comes with Node.js)
- [Ganache](https://www.trufflesuite.com/ganache) for a personal Ethereum blockchain
- [Metamask](https://metamask.io/) extension for your browser
- [Unity](https://unity.com/) for development and playing the game

### Launching the Server

Follow these steps to set up your local development server:

1. **Start Ganache:**
   - Launch Ganache and configure an environment to listen on `HTTP://127.0.0.1:7545`.

2. **Configure Admin Account:**
   - Open `constants.js` in your project directory.
   - Locate the `'ADMIN ACCOUNT'` field and insert an address from one of your Ganache accounts.

3. **Set Up Metamask:**
   - Install the Metamask extension for your browser.
   - Configure Metamask with the accounts and server details from Ganache.

4. **Start the Server:**
   - Open a terminal in your project directory.
   - Run the command `npm start` to launch the server.

### Playing the Game on Unity

To play the game developed with Unity, follow these steps:

1. **Import the Project:**
   - Open Unity Hub and import the project into Unity version `2022.3.15f1`.

2. **Configure Build Settings:**
   - Navigate to `File` > `Build Settings`.
   - Set the platform to `WebGL`.

3. **Build and Run:**
   - Click `Build And Run`.
   - Wait for the build to complete and the game to launch.
   - Enjoy playing the game!

## Authors

List of [contributors](https://github.com/iladesio/PuzzleBlock-BlockchainProject-Server/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LINK_TO_LICENSE) file for details
