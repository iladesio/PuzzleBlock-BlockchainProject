from events import *

def initOracleFilters(contract):
    """
    Init the oracle event filters
    """
    filters = [
        contract.events.UserRegistered.create_filter(fromBlock="latest")
    ]

    return filters

def handle_event(event, provider, contract, logger):
    '''
    Handle an event.
    
    We used reflection to get the event class from the event name.
    '''
    event_name = event.event
    event_args = event.args
    print(event_name)
    print(event_args)

    event_class = get_event_class(event_name)
    kwargs = dict(event_args)
    print(kwargs)
    kwargs['event'] = event_name
    event_object = event_class(**kwargs)
    event_object.handle(contract, provider)
    event_object.log(logger)
