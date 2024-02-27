module.exports = Object.freeze({
    ADMIN_ACCOUNT: '0x315882EAfFCD39D76b937Fa4Cf11a41067b2e63d',
    GANACHE_URL: 'http://127.0.0.1:7545',
    CONTRACTS : [
        { name: 'PuzzleContract'},
        { name: 'GameAsset' }
      ],
    CONTRACTS_JSON : './src/contracts/contracts.json',
    PORT: 3000,
    PINATA_GATEWAY: 'https://coral-tremendous-wasp-739.mypinata.cloud',
    PINATA_GATEWAY_2: 'https://bronze-personal-meadowlark-873.mypinata.cloud',
    MIN_SCORE: 50, MAX_SCORE:200
});

