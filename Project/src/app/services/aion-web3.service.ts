import { Injectable } from '@angular/core';
var Web3 = require('aion-web3-v1.0')
//import * as JSONAionWallet from '../components/wallets/jsonwallet_aion';

@Injectable()
export class AionWeb3Service {
   public privatekey:any;
   public web3:any;
  constructor() { 
    this.web3 = new Web3(new Web3.providers.HttpProvider("http://18.191.165.67:8545"));
    console.log(this.web3);
  }
  getWeb3() {
    return this.web3;
  }
 


}
