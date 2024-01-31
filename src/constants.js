module.exports = Object.freeze({
    ADMIN_ACCOUNT : '0x7Bb7f0684A3fEb06Da70B7A847b7B6aFa31E04fF',
    CONTRACTS : [
        { name: 'SimpleTransaction'},//by name you can access to the file json with concat the name
        { name: 'GameManager'},
        { name: 'HelloWorld'}
      ],
    CONTRACTS_JSON : './src/contracts/contracts.json',
    PORT: 3000
});

