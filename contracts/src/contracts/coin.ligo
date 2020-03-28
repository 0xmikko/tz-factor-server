
type transferMoneyParameters is record [
    recepient: address;
    value: nat;
]

function mustGetBalance(const user : address; var store: storage) : nat is 
 case store.balance[user] of 
        Some(value) -> value
        | None -> (failwith ("Balance not found") : nat)
    end

function transferMoney(const tParams: transferMoneyParameters; var store: storage) : return is block{
    checkSenderIsUser(store);
    checkIsUser(tParams.recepient, store);
    const fromValue : nat = mustGetBalance(Tezos.sender, store);
    const toValue : nat = mustGetBalance(tParams.recepient, store);
  
    if fromValue < tParams.value then failwith ("Not enought money to transfer")
    else {
        
        store.balance[Tezos.sender] := abs(fromValue - tParams.value);
        store.balance[tParams.recepient] := toValue + tParams.value;

        const e : transferEvent = record [
            date      = Tezos.now;
            sender    = Tezos.sender;
            recepient = tParams.recepient;
            value     = tParams.value;
            isMoney   = True;
            bondIndex =  0n;
        ];
        store.events := e # store.events;

    }

} with ((nil : list (operation)), store)