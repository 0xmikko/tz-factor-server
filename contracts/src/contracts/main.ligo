type bond is record [
    issuer: address;
    total: nat;
    matureDate: timestamp;
    balance: map(address, nat);
]

type transferEvent is record [
  date: timestamp;
  sender: address;
  recepient: address;
  value: nat;
  isMoney: bool;
  bondIndex: nat;
]

type storage is record [
    owner: address;
    balance: map(address, nat);
    issuers: map(address, bool);
    bonds: map(nat, bond);
    events: list(transferEvent);
]

type return is list (operation) * storage

#include "./permissions.ligo"
#include "./coin.ligo"
#include "./bond.ligo"
#include "./admin.ligo"


// ============ MAIN FUNCTION

type parameter is 
  RegisterUser of address 
| RegisterIssuer of address
| IssueCoins of nat
| TransferMoney of transferMoneyParameters
| IssueBond of bondIssueParameter
| TransferBonds of transferBondParameters
| ExecuteBond of executeBondParameters
| SellBonds of sellBondParameters;

function main (const action: parameter; var store: storage) : return is 
  case action of
  
    RegisterUser (account) -> registerNewUserAccount (account, store)
  | RegisterIssuer (account) -> registerNewIssuerAccount (account, store)
  | IssueCoins (amountToAdd) -> addStableCoins(amountToAdd, store)
  | TransferMoney (tParams) -> transferMoney (tParams, store)
  | IssueBond (bondParams) -> issueBond (bondParams, store)
  | TransferBonds (transferBondsParams) -> transferBonds (transferBondsParams, store)
  | ExecuteBond (executeBondParameters) -> executeBond (executeBondParameters, store)
  | SellBonds (sellBondsParams) -> sellBonds (sellBondsParams, store)

  end