'''
This file contains the events that the oracle can handle.
'''


from dataclasses import dataclass
from abc import abstractmethod, ABC
from typing import List
import json

public_key = "0xDeDeA4dB00a4062A0168494687B86683fbb2E00a"   # testnet account
private_key = "ae26f3e5e9285e0cdf8a91a228fccdb05a3265b943c04ff1a2eff90908051f11"  # testnet account


@dataclass
class Event(ABC):
    '''
    Basic class for events.
    '''
    event: str

    @abstractmethod
    def handle(self, contract, provider):
        '''
        Handle the event
        '''
        pass

    def log(self, logger):
        '''
        Log the event
        '''
        attributes = "\n".join([f"{k}: {v}" for k, v in self.__dict__.items()])
        msg = f"""
                ====================
                {attributes}
                """
        logger.info(f"{msg}")

@dataclass
class UserRegistered(Event):
    '''
    Handle the opening of a packet.
    '''
    userAddress: str
    ipfsCid: str
    
    def handle(self, contract, provider):
        """
                # call the contract function to notify the blockchain.
                call_func = contract.functions.promptMinted(**{
                                            "IPFSCid": cid_int,
                                            "promptId": prompt,
                                            "to": self.opener,
                                            })\
                                        .build_transaction({
                                            "from": public_key,
                                            "nonce": provider.eth.get_transaction_count(public_key),
                                        })
                # sign the transaction
                signed_tx = provider.eth.account.sign_transaction(call_func, private_key=private_key)

                # send the transaction
                send_tx = provider.eth.send_raw_transaction(signed_tx.rawTransaction)

                # wait for transaction receipt
                tx_receipt = provider.eth.wait_for_transaction_receipt(send_tx)
          """
        print("AO")
                
                


def get_event_class(event_name):
    '''
    Get the event class from the event name.
    '''
    event_class = globals()[event_name]
    return event_class