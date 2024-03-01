'''
Main of the oracle.

run from the root directory with:
python -m oracle
'''

import web3
import time
import logging
import time
import json
from event_handler import handle_event, initOracleFilters

import os
import traceback

logger = logging.getLogger(__name__)


def instantiateProvider():
    '''
    Instantiates the web3 provider from the config file.
    '''
    provider: web3.Web3 = web3.Web3(web3.Web3.HTTPProvider("http://127.0.0.1:7545"))
    provider.eth.default_account = provider.eth.accounts[0]

    logger.info("Provider instantiated.")
    is_connected = provider.is_connected()
    if is_connected:
        logger.info(f"Connection test: {provider.is_connected()}")
    else:
        logger.error(f"Connection test: {provider.is_connected()}")
        raise ConnectionError("Connection to provider failed.")
    return provider


def getABI():
    '''
    Returns the ABI of the contract.
    '''
    with open("../src/contracts/PuzzleContract.json") as f:
        contract_json = json.load(f)
    return contract_json

def initContract(provider):
    '''
    Initializes the contract.
    '''

    contract_address = ""
    with open("../src/contracts/contracts.json") as f:
        contract_json = json.load(f)
        contract_address = contract_json["PuzzleContract"]
    ABI = getABI()
    address = provider.to_checksum_address(contract_address)
    contract = provider.eth.contract(
        address = address,
        abi = ABI
    )
    return contract

def loop(provider, contract, filters):
    '''
    Main loop of the oracle.
    '''
    while True:
        for filter in filters:
            for idx, event in enumerate(filter.get_new_entries()):
                try:
                    handle_event(event, provider, contract, logger)
                except Exception as e:
                    logger.warning(f"Error handling event {idx}: {e}\nWhile handling event: {event}")
                    traceback.print_exc()
        time.sleep(0.1)
        

def main():
        
    # set the public and private keys of the oracle
    public_key = "0xDeDeA4dB00a4062A0168494687B86683fbb2E00a"
    private_key = "ae26f3e5e9285e0cdf8a91a228fccdb05a3265b943c04ff1a2eff90908051f11"   

    # Create web3 connection
    provider = instantiateProvider()

    # Instantiate the contract
    contract = initContract(provider)
    
    
    # Initialize the filters
    filters = initOracleFilters(contract)

    # Start the loop
    loop(provider, contract, filters)

if __name__ == "__main__":
    main()
