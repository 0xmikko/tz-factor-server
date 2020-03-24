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

type transferMoneyParameters is record [
    recepient: address;
    value: nat;
]

type storage is record [
    owner: address;
    balance: map(address, nat);
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
function checkIsUser (const user: address; const store: storage) : unit is 
  case store.balance[user] of
    Some(nat) -> Unit
    | None -> failwith ("Sorry, only registered users're allowed to use this contract")
    end

function checkSenderIsUser (const store: storage) : unit is 
  checkIsUser(Tezos.sender, store)

// Check that users with address exists
// If not throw exception
function checkSenderIsIssuer (const store: storage) : unit is 
  case store.issuers[Tezos.sender] of
    Some(bool) -> Unit
    | None -> (failwith ("Sorry, only contract owner could invoke this method") : unit)
    end
