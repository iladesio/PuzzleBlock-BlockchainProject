module.exports = Object.freeze({
    ADMIN_ACCOUNT: '0xAE4B2d7E9856398ab3EC48902415DAF19de2da6E',
    CONTRACTS : [
        { name: 'SimpleTransaction'},//by name you can access to the file json with concat the name
        { name: 'GameManager'},
        { name: 'HelloWorld'}
      ],
    CONTRACTS_JSON : './src/contracts/contracts.json',
    PORT: 3000
});

