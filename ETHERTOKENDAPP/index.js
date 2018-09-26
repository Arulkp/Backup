
const Web3 = require("aion-web3")
const web3 = new Web3(new Web3.providers.HttpProvider("http://18.191.165.67:8545/"));
let abi=require("./EtherTokenm.json")
let contractAddr='0xa06cb1f7a80a10d4e65b77113c000988e416d897d2fb9acc2998a57b850b284e'; 
let contractInstance=web3.eth.contract(abi).at(contractAddr);
let acc = web3.personal.listAccounts;
let a0 = web3.eth.accounts[0];
let pw0 = "Aion123$"
let add;
const unlock = function(w3, addr, pw){
  return new Promise((resolve, reject)=>{
    w3.personal.unlockAccount(addr, pw, 999999, (err, unlock)=>{
      if(err)
        reject(err)
      else if(unlock && unlock === true)
      console.log("unlocl account is",unlock);
        resolve(addr)    
    })
  })
}
const acc_balance= function(add){
    return new Promise((resolve,reject)=>
{
    var c=contractInstance.balanceOf(add,{from:a0,gas:469999},function(err,res){
        if(!err){
        resolve(res);
        console.log(res.shiftedBy(-18).toNumber());
            }
        else{  
        reject(err);
            }
  })
})
}
const buy_token=function(address_owenr){
    return new Promise((resolve,reject)=>
{
    var d=contractInstance.deposit(address_owenr,{from:address_owenr,gas:469999,value:1000000000000000000},function(err,res){
        if(!err){
            resolve(res);
            console.log(res);
        }
        else reject(err);
    })
})
}
const approve_=function(spender,value){
    return new Promise((resolve,reject)=>
{
    var e=contractInstance.approve(spender,value,{from:a0,gas:469999},function(err,res){
        if(!err){
            resolve(res);
            console.log(res)
        } else reject(err);
    })
})
}
const totallist=function(a){
    return new Promise((resolve,reject)=>
{
    var e=contractInstance.TotalAssets(a,{from:a0,gas:469999},function(err,res){
        if(!err){
            resolve(res);
            console.log(res)
        } else reject(err);
    })
})
}
const allowance=function(owner,spender){
    return new Promise((resolve,reject)=>{
        var f=contractInstance.allowance(owner,spender,{from:a0,gas:469999},function(err,res){
            if(!err){ resolve(res);
                      console.log(res);}
                      else reject(err);
        })
    })
}
Promise.all([
  unlock(web3, a0, pw0),
  console.log("\n[log] 1. unlocking account:", a0),
]).then((res) => {
  let a0 = res[0];
  console.log("[log] unlock & compile successful! \n");
  console.log(web3.eth.getBalance(web3.eth.accounts[0]).toNumber())
totallist(0);
totallist(1);
//acc_balance(web3.eth.accounts[0]);
//console.log(web3.eth.getTransactionReceipt('0x8160d0564a6b0ca3f0806d487786e0b82250ddc18743b43d850e5b09c47bf5d7'))
//console.log(web3.personal.unlockAccount(web3.eth.accounts[0],"Aion123$"))
//buy_token(web3.eth.accounts[0]);
//console.log("approve",+approve_("0xa0b3776db3213000fb4b59419f66b2daa4eec055740065fa8f58ddd0b0f89f52",100));
//console.log("allowance is",allowance(web3.eth.accounts[0],"0xa0b3776db3213000fb4b59419f66b2daa4eec055740065fa8f58ddd0b0f89f52"))
})







