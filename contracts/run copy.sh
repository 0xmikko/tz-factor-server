# Create user
ligo dry-run main.ligo --syntax pascaligo main --sender=tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV \
"RegisterUser((\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address))" \
"record [ 
    owner = (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address);
    balance  = (map [] : map(address, nat));
    issuers = (map [] : map(address, bool));
    bonds= (map[] : map(nat, bonds));
     ]"

# Create Issuer
ligo dry-run main.ligo --syntax pascaligo main --sender=tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV \
"RegisterIssuer((\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address))" \
"record [ 
    owner = (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address);
    balance  = (map [] : map(address, nat));
    issuers = (map [] : map(address, bool));
    bonds= (map[] : map(nat, bonds));
     ]"

# Issue new bond
ligo dry-run main.ligo --syntax pascaligo main --sender=tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV \
"IssueBond(record[
    total=1000n;
    matureDate=Tezos.now;
])" \
"record [ 
    owner = (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address);
    balance  = map [  
        (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address) -> (0n);
        (\"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV\" : address) -> (0n);
        ];
    issuers = map [
         (\"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV\" : address) -> (True);
    ];
    bonds= (map[] : map(nat, bonds));
     ]"


# Add owner balance
ligo dry-run main.ligo --syntax pascaligo main --sender=tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV \
"IssueCoins(1599n)" \
"record [ 
    owner = (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address);
    balance  = map [  
        (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address) -> (0n);
        (\"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV\" : address) -> (0n);
        ];
    issuers = map [
         (\"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV\" : address) -> (True);
    ];
    bonds= (map[] : map(nat, bonds));
     ]"

# Transfer Money
ligo dry-run main.ligo --syntax pascaligo main --sender=tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx \
"TransferMoney(record[
    value = 50n;
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
    bonds= (map[] : map(nat, bonds));
     ]"