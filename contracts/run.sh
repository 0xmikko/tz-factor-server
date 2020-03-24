# Create user
ligo dry-run main.ligo --syntax pascaligo main --sender=tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV \
"RegisterUser((\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address))" \
"record [ 
    owner = (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address);
    users  = (map [] : map(address, nat));
    issuers = (map [] : map(address, bool));
    bonds= (nil: list(bond));
     ]"

# Create Issuer
ligo dry-run main.ligo --syntax pascaligo main --sender=tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV \
"RegisterIssuer((\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address))" \
"record [ 
    owner = (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address);
    users  = (map [] : map(address, nat));
    issuers = (map [] : map(address, bool));
bonds=(nil: list(bond));
     ]"

# Issue new bond
ligo dry-run main.ligo --syntax pascaligo main --sender=tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV \
"RegisterIssuer((\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address))" \
"record [ 
    owner = (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address);
    users  = map [  
        (\"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx\" : address) -> (0n);
        (\"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV\" : address) -> (0n);
        ];
    issuers = map [
         (\"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV\" : address) -> (True);
    ];
    bonds=(nil: list(bond));
     ]"