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

type storage is record [
    owner: address;
    users: map(address, nat);
    issuers: map(address, bool);
    bonds: list(bond);
]


type return is list (operation) * storage


const ownerAddress : address =
  ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" : address)

// =========== PERMISSONS ===================================

// CheckOwnerAccerss checks that sender is contract owner
// If not throw exception
function checkSenderIsOwner (const p: unit) : unit is 
  if Tezos.sender =/= ownerAddress 
    then (failwith ("Sorry, only contract owner could invoke this method") : unit);
    else Unit;

// Check that users with address exists
// If not throw exception
function checkSenderIsUser (const store: storage) : unit is 
  case store.users[Tezos.sender] of
    Some(nat) -> Unit
    | None -> failwith ("Sorry, only contract owner could invoke this method")
    end

// Check that users with address exists
// If not throw exception
function checkSenderIsIssuer (const store: storage) : unit is 
  case store.issuers[Tezos.sender] of
    Some(bool) -> Unit
    | None -> (failwith ("Sorry, only contract owner could invoke this method") : unit)
    end



// ============ BOND ISSUERS OPERATIONS

function issueBond(const newBondParam: bondIssueParameter; var store: storage) : return is block{
    checkSenderIsIssuer(store);
    const newBond : bond = record[
        issuer =Tezos.sender;
        total = newBondParam.total;
        matureDate = newBondParam.matureDate;
        balance = (map[] : map(address, nat));
    ];

    store.bonds := newBond # store.bonds;
} with ((nil : list (operation)), store)




// ============ CONTRACT OWNER OPERATIONS

// Register new user account
function registerNewUserAccount (const newAccount: address; var store: storage) : return is block {

   checkSenderIsOwner(Unit);
   store.users[newAccount] := 0n;

} with ((nil : list (operation)), store)

// Register new issuer account
function registerNewIssuerAccount(const newAccount: address; var store: storage) : return is block{

    checkSenderIsOwner(Unit);
    store.users[newAccount] := 0n;
    store.issuers[newAccount] := True;

} with ((nil : list (operation)), store)

// Add stable coins to owner account
function addStableCoins(const amountToAdd: nat; var store: storage) : return is block{

    checkSenderIsOwner(Unit);
    case store.users[ownerAddress] of
        Some(value) -> { store.users[ownerAddress] := value + amountToAdd; }
        | None -> failwith ("Sorry, only contract owner could invoke this method")
    end
    
} with ((nil : list (operation)), store)


// ============ MAIN FUNCTION

type parameter is 
  RegisterUser of address 
| RegisterIssuer of address
| AddStableCoints of nat
| IssueBond of bondIssueParameter;

function main (const action: parameter; var store: storage) : return is 
  case action of
    RegisterUser (account) -> registerNewUserAccount (account, store)
  | RegisterIssuer (account) -> registerNewIssuerAccount (account, store)
  | AddStableCoints (amountToAdd) -> addStableCoins(amountToAdd, store)
  | IssueBond (bondParams) -> issueBond (bondParams, store)
  end