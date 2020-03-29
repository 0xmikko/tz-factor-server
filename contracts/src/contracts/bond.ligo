

type bondIssueParameter is record [
    total: nat;
    matureDate: timestamp;
]

type transferBondParameters is record [
    bondIndex: nat;
    value: nat;
    recepient: address;
]

type executeBondParameters is record [
    bondIndex: nat;
    value: nat;
]


type sellBondParameters is record [
    bondIndex: nat;
    valueBonds: nat;
    valueMoney: nat;
    seller: address;
    buyer: address;
]



// ============ BOND ISSUERS OPERATIONS

function issueBond(const newBondParam: bondIssueParameter; var store: storage) : return is block{
    checkSenderIsIssuer(store);
    const newBond : bond = record[
        issuer =Tezos.sender;
        total = newBondParam.total;
        matureDate = newBondParam.matureDate;
        balance = map[
            Tezos.sender -> newBondParam.total
        ];
    ];

    const bondSize : nat = Map.size(store.bonds);
    store.bonds[bondSize] := newBond;
} with ((nil : list (operation)), store)

function getBondByIndex(const index: nat; const bonds: map(nat, bond)) : bond is 
    case bonds[index] of 
        Some(b) -> b
        | None -> (failwith ("Bonw with this index does not exist") : bond)
    end

function getBondsAmount(const b: bond; const user: address) : nat is 
    case b.balance[user] of
        Some(value) -> value
        | None -> 0n
    end

// Transger bonds from one user to another
function transferBonds(const tParams: transferBondParameters; var store : storage) : return is block{
    checkSenderIsUser(store);
    checkIsUser(tParams.recepient, store);
    const b : bond = getBondByIndex(tParams.bondIndex, store.bonds);
    const ownerBondBalance : nat = getBondsAmount(b, Tezos.sender);
    if ownerBondBalance < tParams.value then failwith ("Not enough bonds on account"); else skip;
    const recepientBalance : nat = getBondsAmount(b, tParams.recepient);
    b.balance[Tezos.sender] := abs(ownerBondBalance - tParams.value);
    b.balance[tParams.recepient] := recepientBalance + tParams.value;
    store.bonds[tParams.bondIndex] := b;

    const e : transferEvent = record [
        date      = Tezos.now;
        sender    = Tezos.sender;
        recepient = tParams.recepient;
        value     = tParams.value;
        isMoney   = False;
        bondIndex = tParams.bondIndex;
    ];
    
    store.events := e # store.events;


}  with ((nil : list (operation)), store)

// ExecuteBond
function executeBond(const tParams: executeBondParameters; var store : storage) : return is block{
    checkSenderIsUser(store);

    const b : bond = getBondByIndex(tParams.bondIndex, store.bonds);
    if b.matureDate > Tezos.now then failwith ("You cant execute bond before mature date"); else skip;

    const ownerBondBalance : nat = getBondsAmount(b, Tezos.sender);
    const issuerBondBalance : nat = getBondsAmount(b, b.issuer);
    if ownerBondBalance < tParams.value then failwith ("Not enough bonds on account"); else skip;

    const ownerCoinBalance : nat = mustGetBalance(Tezos.sender, store);
    const issuerCoinBalance : nat = mustGetBalance(b.issuer, store);
    if issuerCoinBalance < tParams.value then failwith ("Not enought money on issuer account. Technical default!"); else skip;

    store.balance[b.issuer] := abs(issuerCoinBalance - tParams.value);
    store.balance[Tezos.sender] := ownerCoinBalance + tParams.value;

    b.balance[Tezos.sender] := abs(ownerBondBalance - tParams.value);
    b.balance[b.issuer] := issuerBondBalance + tParams.value;
    store.bonds[tParams.bondIndex] := b;

    const e : transferEvent = record [
        date      = Tezos.now;
        sender    = Tezos.sender;
        recepient = b.issuer;
        value     = tParams.value;
        isMoney   = False;
        bondIndex = tParams.bondIndex;
    ];
    
    store.events := e # store.events;

    const e : transferEvent = record [
        date      = Tezos.now;
        sender    = b.issuer;
        recepient = Tezos.sender;
        value     = tParams.value;
        isMoney   = True;
        bondIndex = 0n;
    ];

    store.events := e # store.events;

}  with ((nil : list (operation)), store)

function sellBonds(const params: sellBondParameters; var store: storage) : return is block{
    checkSenderIsOwner(store);

    const sellerMoneyBalance : nat = mustGetBalance(params.seller, store);
    const buyerMoneyBalance : nat = mustGetBalance(params.buyer, store);

    if buyerMoneyBalance  < params.valueMoney then failwith ("Not enough money on buyer account"); else skip;

    const b : bond = getBondByIndex(params.bondIndex, store.bonds);
    const sellerBondsBalance : nat = getBondsAmount(b, params.seller);
    const buyerBondsBalance : nat = getBondsAmount(b, params.buyer);
    if sellerBondsBalance < params.valueBonds then failwith ("Not enough bonds on seller account"); else skip;

    store.balance[params.buyer] := abs(buyerMoneyBalance  - params.valueMoney);
    store.balance[params.seller] := sellerBondsBalance + params.valueMoney;

    b.balance[params.seller] := abs(sellerBondsBalance - params.valueBonds);
    b.balance[params.buyer] := buyerBondsBalance + params.valueBonds;
    store.bonds[params.bondIndex] := b;

    const e : transferEvent = record [
        date      = Tezos.now;
        sender    = params.seller;
        recepient = params.buyer;
        value     = params.valueBonds;
        isMoney   = False;
        bondIndex = params.bondIndex;
    ];
    
    store.events := e # store.events;

    const e : transferEvent = record [
        date      = Tezos.now;
        sender    = params.buyer;
        recepient = params.seller;
        value     = params.valueMoney;
        isMoney   = True;
        bondIndex = 0n;
    ];

    store.events := e # store.events;

}with ((nil : list (operation)), store)