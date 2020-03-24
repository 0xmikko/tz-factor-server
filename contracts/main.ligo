#include "./permissions.ligo"
#include "./bond.ligo"
#include "./admin.ligo"

// =============== USERS OPERATIONS =============
function transferMoney(const tParams: transferMoneyParameters; var store: storage) : return is block{
    checkSenderIsUser(store);
    checkIsUser(tParams.recepient, store);
    case store.balance[Tezos.sender] of 
        Some(value) -> block {
            if value < tParams.value then failwith ("Not enought money to transfer")
            else skip;
        }
        | None -> failwith ("Not enought money to transfer")
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