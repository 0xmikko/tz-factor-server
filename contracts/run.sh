

# Transfer Bonds
ligo dry-run main.ligo --syntax pascaligo main --sender=tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx \
"TransferBonds(record[
    bondIndex = 0n;
    value = 10n;
    recepient = (\"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV\" : address);
    ])" \
"record [ 
    owner = (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address);
    balance  = map [  
        (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address) -> (100n);
        (\"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV\" : address) -> (0n);
        ];
    issuers = map [
         (\"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV\" : address) -> (True);
    ];
    bonds= map[
        0n -> record[
            issuer = (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address);
            total = 100n;
            matureDate = Tezos.now;
            balance= map[
                (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address) -> 100n;
                ]
        ];
    ] 
     ]"