type bond is record [
    issuer: address;
    total: nat;
    matureDate: timestamp;
    balance: map(address, nat);
]

type storage is record [
    owner: address;
    balance: map(address, nat);
    issuers: map(address, bool);
    bonds: map(nat, bond);
]

type return is list (operation) * storage

#include "./permissions.ligo"
#include "./bond.ligo"
#include "./coin.ligo"
#include "./admin.ligo"


// ============ MAIN FUNCTION

type parameter is 
  RegisterUser of address 
| RegisterIssuer of address
| IssueCoins of nat
| TransferMoney of transferMoneyParameters
| IssueBond of bondIssueParameter
| TransferBonds of transferBondParameters;

function main (const action: parameter; var store: storage) : return is 
  case action of
    RegisterUser (account) -> registerNewUserAccount (account, store)
  | RegisterIssuer (account) -> registerNewIssuerAccount (account, store)
  | IssueCoins (amountToAdd) -> addStableCoins(amountToAdd, store)
  | TransferMoney (tParams) -> transferMoney (tParams, store)
  | IssueBond (bondParams) -> issueBond (bondParams, store)
  | TransferBonds (transferBondsParams) -> transferBonds (transferBondsParams, store)
  end