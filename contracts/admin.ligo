// ============ CONTRACT OWNER OPERATIONS

// Register new user account
function registerNewUserAccount (const newAccount: address; var store: storage) : return is block {

   checkSenderIsOwner(Unit);
   store.balance[newAccount] := 0n;

} with ((nil : list (operation)), store)

// Register new issuer account
function registerNewIssuerAccount(const newAccount: address; var store: storage) : return is block{

    checkSenderIsOwner(Unit);
    store.balance[newAccount] := 0n;
    store.issuers[newAccount] := True;

} with ((nil : list (operation)), store)

// Add stable coins to owner account
function addStableCoins(const amountToAdd: nat; var store: storage) : return is block{

    checkSenderIsOwner(Unit);
    case store.balance[ownerAddress] of
        Some(value) -> { store.balance[ownerAddress] := value + amountToAdd; }
        | None -> failwith ("Sorry, only contract owner could invoke this method")
    end
    
} with ((nil : list (operation)), store)