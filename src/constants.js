module.exports = Object.freeze({
    ADMIN_ACCOUNT : '0x2545A48D416fAb37a1e23a687Ea04be511537Ed9',
    CONTRACTS : [
        { name: 'SimpleTransaction'},//by name you can access to the file json with concat the name
        { name: 'GameManager'},
        { name: 'HelloWorld'}
      ],
    CONTRACTS_JSON : './src/contracts/contracts.json',
    PORT: 3000
});

