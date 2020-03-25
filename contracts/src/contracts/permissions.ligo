
// =========== PERMISSONS ===================================

// CheckOwnerAccerss checks that sender is contract owner
// If not throw exception
function checkSenderIsOwner (const store: storage) : unit is 
  if Tezos.sender =/= store.owner
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
