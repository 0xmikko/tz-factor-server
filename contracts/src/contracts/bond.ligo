

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

}  with ((nil : list (operation)), store)