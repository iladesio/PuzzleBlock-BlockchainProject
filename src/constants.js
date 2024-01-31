module.exports = Object.freeze({
    ADMIN_ACCOUNT : '0x1b1A420D4566829813672822996d4DFC295194aA',
    CONTRACTS : [
        { name: 'SimpleTransaction'},//by name you can access to the file json with concat the name
        { name: 'GameManager'},
        { name: 'HelloWorld'}
      ],
    CONTRACTS_JSON : './src/contracts/contracts.json',
    PORT: 3000
});

