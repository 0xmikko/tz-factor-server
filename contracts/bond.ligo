type bond is record [
    issuer: address;
    total: nat;
    matureDate: timestamp;
    balance: map(address, nat);
]

type bondIssueParameter is record [
    total: nat;
    matureDate: timestamp;
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

    store.bonds := newBond # store.bonds;
} with ((nil : list (operation)), store)
