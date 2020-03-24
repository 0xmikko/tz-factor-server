

type bondIssueParameter is record [
    total: nat;
    matureDate: timestamp;
]

type transferBondParameters is record [
    bondIndex: nat;
    value: nat;
    recepient: address;
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
    const ownerBalance : nat = getBondsAmount(b, Tezos.sender);
    if ownerBalance < tParams.value then failwith ("Not enough bonds on account"); else skip;
    const recepientBalance : nat = getBondsAmount(b, tParams.recepient);
    b.balance[Tezos.sender] := abs(ownerBalance - tParams.value);
    b.balance[tParams.recepient] := recepientBalance + tParams.value;
    store.bonds[tParams.bondIndex] := b;
}  with ((nil : list (operation)), store)


