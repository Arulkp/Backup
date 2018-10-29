import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as EthWallet from 'ethereumjs-wallet-browser';
import {JSONEthWallet, EthWalletHelper} from '../components/wallets/jsonwallet_eth';
import {JSONNeoWallet, NeoWalletHelper} from '../components/wallets/jsonwallet_neo';
import {JSONWanWallet, WanWalletHelper} from '../components/wallets/jsonwallet_wan';
import {JSONAionWallet, AionWalletHelper} from '../components/wallets/jsonwallet_aion';
import * as ethUtil from 'ethereumjs-util';
import {AwsService} from './aws.service';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';

var nacl = require('tweetnacl');
var blake2b = require('blakejs');
var blake2bHex = blake2b.blake2bHex;
var blake2B = blake2b.blake2b;
var aion=require('aion-web3-v1.0');
// if (window['require']) {
//   const fs = window.require('fs');
//   const electron = window.require('electron');
//   var remote = window.require('electron').remote;
//   const app = remote.app;
// } else {
//   const fs = {}
//   const electron = {}
//   var remote = {}
//   const app = {}
// }
const {electron, shell} = window.require('electron');
var remote = window.require('electron').remote;
const app = remote.app;
const fs = window.require('fs-extra');
const path = window.require('path');
declare var window: any;

@Injectable()
export class SavedWalletsService {
  private privatekey:any;
  private publicbufkey:any;
  private privatebufkey:any;
  private aion:any;
  private ethWallets: Array<any> = [];
  private neoWallets: Array<any> = [];
  private wanWallets: Array<any> = [];
  private aionWallets: Array<any> = [];
  private baseCurrency: string = 'eth';
  private currentWallet: any;
  private _serviceStatus = new BehaviorSubject<any>('initializing');
  public serviceStatus$ = this._serviceStatus.asObservable();
  private neoWalletHelper: any;
  private ethWalletHelper: any;
  private wanWalletHelper: any;
  public aionWalletHelper: any;
  public web3;
  public keystore ={};
  private keyStorePath: string = path.join('library', 'wallet', 'keystore');

  constructor(private awsservice: AwsService) {
    this.saveEthToJson = this.saveEthToJson.bind(this);
    this.saveNeoToJson = this.saveNeoToJson.bind(this);
    this.getEthWallets = this.getEthWallets.bind(this);
    this.getNeoWallets = this.getNeoWallets.bind(this);
    this.addNewEthWallet = this.addNewEthWallet.bind(this);
    this.addNewNeoWallet = this.addNewNeoWallet.bind(this);
    this.setCurrentWallet = this.setCurrentWallet.bind(this);
    this.hasWalletWithName = this.hasWalletWithName.bind(this);
    this.hasWallets = this.hasWallets.bind(this);

    this.neoWalletHelper = new NeoWalletHelper();
    this.ethWalletHelper = new EthWalletHelper();
    this.wanWalletHelper = new WanWalletHelper();
    this.aionWalletHelper = new AionWalletHelper();
    this.web3=new aion(new aion.providers.HttpProvider('http://18.191.165.67'))
    this.getWallet();
  }

  getWallet() {
    this.ethWallets = [];
    this.neoWallets = [];
    this.wanWallets = [];
    this.aionWallets = [];
    var homePath = app.getPath('home');
    var folderPath = path.join(homePath, this.keyStorePath);
    fs.readdir(folderPath, (err, files) => {
      if (err)
        return;
      let length = files.length;
      files.forEach(file => {
        console.log(file.indexOf('utc'));
        if (file.toLowerCase().indexOf('utc') !== -1)
          try {
            var filePath = path.join(folderPath, file);
            var data = fs.readFileSync(filePath, 'utf-8');
            var a = JSON.parse(data);
            var j = null;
            if (a.exchange == 'neo')
              j = new JSONNeoWallet(a);
            else if (a.exchange == 'eth')
              j = new JSONEthWallet(a);
            else if (a.exchange == 'wan')
              j = new JSONWanWallet(a);
            else if (a.exchange = 'aion')
              j = new JSONAionWallet(a);
            // j.decrypt('password')
            if (a.exchange == 'eth')
              this.ethWallets.push(j);
            else if (a.exchange == 'neo')
              this.neoWallets.push(j);
            else if (a.exchange == 'wan')
              this.wanWallets.push(j);
            else if (a.exchange == 'aion')
            console.log("push data",j);
              this.aionWallets.push(j);
              console.log(this.addNewAionWallet);
          } catch (err) {
            console.log(err.message);
          }

      });
      this._serviceStatus.next('ready');
      if (!this.currentWallet) {
        var currentWallet = this.getEthWallets() && this.getEthWallets().length ? this.getEthWallets()[0] : null;
        setTimeout(() => {
          this.setCurrentWallet(currentWallet)
        })

      }
    });
  }

  saveEthToJson(walletName, password, wallet) {
    let a = wallet.toV3(password, {
      kdf: 'scrypt',
      n: 8192
    });
    a['walletName'] = walletName;
    a['exchange'] = 'eth';
    // console.log('app', app.getPath('home'));
    var homePath = app.getPath('home');
    var filePath = path.join(homePath, this.keyStorePath, `utc-${(new Date()).getTime()}_eth_${a.address}.json`);
    fs.ensureFileSync(filePath);
    try {
      let data = {
        type: 'ETH',
        address: a.address
      };
      this.awsservice.addItemNewWallet(data);
      console.log('eth', a);
      fs.writeFileSync(filePath, JSON.stringify(a));
    } catch (err) {
      return {error: err};
    }
    return a;
  }
  saveWanToJson(walletName, password, wallet) {
    let a = wallet.toV3(password, {
      kdf: 'scrypt',
      n: 8192
    });
    a['walletName'] = walletName;
    a['exchange'] = 'wan';
    // console.log('app', app.getPath('home'));
    var homePath = app.getPath('home');
    var filePath = path.join(homePath, this.keyStorePath, `utc-${(new Date()).getTime()}_wan_${a.address}.json`);
    fs.ensureFileSync(filePath);
    try {
      let data = {
        type: 'WAN',
        address: a.address
      };
      //this.awsservice.addItemNewWallet(data);
      console.log('eth', a);
      fs.writeFileSync(filePath, JSON.stringify(a));
    } catch (err) {
      return {error: err};
    }
    return a;
  }

  saveAionToJson(walletName, password, wallet) {
      
       let address;
       let a={}
       if(typeof(wallet)=='string'){
        console.log("wallet",wallet)
        console.log("WALLET1",wallet[0],"WALLET2",wallet[1])
        wallet = this.web3.eth.accounts.privateKeyToAccount(wallet);
        console.log("privateKey",wallet._privateKey)
        let enc_data=this.aionWalletHelper.password(password,wallet.publicKey,wallet._privateKey)
         address =new Buffer(wallet.publicKey,'hex').toString('hex');
         this.keystore['walletName'] = walletName;
         this.keystore['exchange'] = 'aion';
         this.keystore['address']=wallet.address;
         this.keystore['wallet'] = enc_data;
      console.log(JSON.stringify(this.keystore));
      }else if(wallet.encode!=null && wallet.encode !=undefined){
        console.log("WALLET1",wallet.encode,"WALLET2",wallet.key)
        let web3=this.web3.eth.accounts.privateKeyToAccount(wallet.key)
        address = new Buffer(web3.publicKey,'hex').toString('hex');
        this.keystore['walletName'] = walletName;
        this.keystore['exchange'] = 'aion';
        this.keystore['address']=web3.address;
        this.keystore['wallet'] = wallet.encode;
      console.log(JSON.stringify(this.keystore));
      }
      else{
       let enc_data=this.aionWalletHelper.password(password,wallet[0],wallet[1])
       address =new Buffer(wallet[0],'hex').toString('hex');
       this.keystore['walletName'] = walletName;
       this.keystore['exchange'] = 'aion';
       this.keystore['address']=wallet[2];
       this.keystore['wallet'] = enc_data;
        console.log(JSON.stringify(this.keystore));
      }
    var homePath = app.getPath('home');
    var filePath = path.join(homePath, this.keyStorePath,`utc-${(new Date()).getTime()}_aion_${address}.json`); 

    fs.ensureFileSync(filePath);
     try {
       var  data = {
         type: 'AION',
         //address:address1
       };
       //this.awsservice.addItemNewWallet(data);
       console.log('Aion', this.keystore);
       fs.writeFileSync(filePath,JSON.stringify(this.keystore));
     } catch (err) {
       return {error: err};
     }
    
     return this.keystore;
   }
  saveNeoToJson(walletName, password, wallet) {
    let a = {
      walletName,
      exchange: 'neo',
      address: wallet._address,
      key: this.neoWalletHelper.getKeyForAccount(wallet, password)
    };
    var homePath = app.getPath('home');
    var filePath = path.join(homePath, this.keyStorePath, `utc-${(new Date()).getTime()}_neo_${a.address}.json`);
    fs.ensureFileSync(filePath);
    try {
      console.log('eth', a);
      let data = {
        type: 'NEO',
        address: a.address
      };
      this.awsservice.addItemNewWallet(data);
      fs.writeFileSync(filePath, JSON.stringify(a));
    } catch (err) {
      return {error: err};
    }
    return a;
  }

  getEthWallets() {
    console.log(this.ethWallets.slice());
    return this.ethWallets.slice();
  }

  getNeoWallets() {
    return this.neoWallets.slice();
  }
  getWanWallets() {
    return this.wanWallets.slice();
  }
  getAionWallets() {
    console.log("aionwallet without slice",this.aionWallets);
    return this.aionWallets.slice();
  }

  newNeoWalletSetUp(data, wallet) {
    var walletData, deCryptedNewWallet;
    if (data.type == 'private' || data.type == 'json') {
      var a = this.saveNeoToJson(data.walletName, data.password, wallet);
      walletData = new JSONNeoWallet(a);
      deCryptedNewWallet = new JSONNeoWallet(a);
      deCryptedNewWallet.decrypt(data.password);
    }

    return {walletData, deCryptedNewWallet};
  }

  newEthWalletSetUp(data, wallet) {
    var walletData, deCryptedNewWallet;
    if (data.type == 'private' || data.type == 'json') {
      var a = this.saveEthToJson(data.walletName, data.password, wallet);
      walletData = new JSONEthWallet(a);
      deCryptedNewWallet = new JSONEthWallet(a);
      deCryptedNewWallet.decrypt(data.password);
    }

    return {walletData, deCryptedNewWallet};
  }

  newWanWalletSetUp(data, wallet) {
    var walletData, deCryptedNewWallet;
    if (data.type == 'private' || data.type == 'json') {
      var a = this.saveWanToJson(data.walletName, data.password, wallet);
      walletData = new JSONWanWallet(a);
      deCryptedNewWallet = new JSONWanWallet(a);
      deCryptedNewWallet.decrypt(data.password);
    }

    return {walletData, deCryptedNewWallet};
  }

  newAionWalletSetUp(data, wallet) {
    console.log(data,wallet);
    var walletData, deCryptedNewWallet;
    if (data.type == 'private' || data.type == 'json') {
      var a = this.saveAionToJson(data.walletName, data.password, wallet);
      console.log(a);
      walletData = new JSONAionWallet(a);
      deCryptedNewWallet = new JSONAionWallet(a);
      console.log(deCryptedNewWallet);
      deCryptedNewWallet.decrypt(data.password);
    }

    return {walletData, deCryptedNewWallet};
  }
 

  addNewEthWallet(data, wallet) {
    data['exchange'] = 'eth';
    var address = wallet._address;
    var ethWallets = this.getEthWallets();
    for (let w of ethWallets) {
      if (w.address == wallet.getAddressString()) {
        return {error: 'Duplicate!! Wallet already added', wallet: null};
      }
    }
    var {walletData, deCryptedNewWallet} = this.newEthWalletSetUp(data, wallet);
    this.ethWallets.push(walletData);
    this._serviceStatus.next('newWalletAdded');
    return {error: '', wallet: deCryptedNewWallet};

  }

  addNewWanWallet(data, wallet) {
    console.log("addNewWanWallet");
    
    console.log(data);
    console.log(wallet);

    data['exchange'] = 'wan';
    var address = wallet._address;
    var ethWallets = this.getWanWallets();
    for (let w of ethWallets) {
      if (w.address == wallet.getAddressString()) {
        return {error: 'Duplicate!! Wallet already added', wallet: null};
      }
    }
    var {walletData, deCryptedNewWallet} = this.newWanWalletSetUp(data, wallet);
    this.wanWallets.push(walletData);
    this._serviceStatus.next('newWalletAdded');
    return {error: '', wallet: deCryptedNewWallet};

  }

  addNewAionWallet(data,wallet){
    console.log("add",data,wallet);
    if(wallet.encode!=null && wallet.encode !=undefined){
      data['exchange'] = 'aion';
      let web3=this.web3.eth.accounts.privateKeyToAccount(wallet.key)
      var address =web3.address;
      var ethWallets = this.getAionWallets();
    }else if((typeof(wallet)=='string')){
      data['exchange'] = 'aion';
      var a = this.web3.eth.accounts.privateKeyToAccount(wallet);
      var address:any = a.address;
      var ethWallets = this.getAionWallets();
    }
    else{
      data['exchange'] = 'aion';
      var address = wallet[2];
      var ethWallets = this.getAionWallets();
    }
     for (let w of ethWallets) {
      if (w.address == address) {
        return {error: 'Duplicate!! Wallet already added', wallet: null};
      }
    }
    var {walletData, deCryptedNewWallet} = this.newAionWalletSetUp(data, wallet);
    console.log("walletData",walletData)
    this.aionWallets.push(walletData);
    this._serviceStatus.next('newWalletAdded');
    return {error: '', wallet: deCryptedNewWallet};
  }
  
  addNewNeoWallet(data, wallet) {
    data['exchange'] = 'neo';
    // check for duplicates
    var address = wallet._address;
    var neoWallets = this.getNeoWallets();
    for (let w of neoWallets) {
      if (w.address == wallet._address) {
        return {error: 'Duplicate!! Wallet already added', wallet: null};
      }
    }
    var {walletData, deCryptedNewWallet} = this.newNeoWalletSetUp(data, wallet);
    this.neoWallets.push(walletData);
    this._serviceStatus.next('newWalletAdded');
    return {error: '', wallet: deCryptedNewWallet};
  }

  setCurrentWallet(wallet) {
    if (!wallet) {
      this.currentWallet = wallet;
      this._serviceStatus.next('ready');
      // this._serviceStatus.next('currentWalletChanged');
      return;
    }
    var oldWallet = this.currentWallet;
    this.currentWallet = wallet;

    if (wallet) {
      this._serviceStatus.next('currentWalletChanged');
    }
  }

  getCurrentWallet() {
    return this.currentWallet;
  }

  generateWallet(exchange) {
    if (exchange == 'eth') {
      return EthWallet.generate();
    } else if (exchange == 'neo') {
      return this.neoWalletHelper.generateWallet();
    } else if (exchange == 'wan') {
      return EthWallet.generate();
    } else if (exchange == 'aion') {
      return this.aionWalletHelper.generateWallet();
    }

  }

  createWalletWithPrivate(privateKey, exchange) {
    let w = {
      error: '',
      wallet: ''
    };
    if (exchange == 'eth') {
      privateKey = ethUtil.stripHexPrefix(privateKey);
      let pk = new Buffer(Buffer.from(privateKey, 'hex'));
      w.wallet = EthWallet.fromPrivateKey(pk);

    } else if (exchange == 'neo') {
      w = this.neoWalletHelper.createWalletWithPrivate(privateKey);
    } else if (exchange == 'wan') {
      privateKey = ethUtil.stripHexPrefix(privateKey);
      let pk = new Buffer(Buffer.from(privateKey, 'hex'));
      w.wallet = EthWallet.fromPrivateKey(pk);
    } else if (exchange == 'aion') {
      w.wallet = privateKey
    }
    return w;
  }

  createWalletWithJSON(jsonData, password, exchange) {
    console.log(jsonData)
    if (exchange == 'eth') {
      var {error, wallet} = this.ethWalletHelper.createWalletWithJSON(jsonData, password);
    } else if (exchange == 'neo') {
      var {error, wallet} = this.neoWalletHelper.createWalletWithJSON(jsonData, password);
    } else if (exchange == 'wan') {
      var {error, wallet} = this.wanWalletHelper.createWalletWithJSON(jsonData, password);
    } else if (exchange == 'aion') {
      //var {error, wallet} = this.aionWalletHelper.createWalletWithJSON(jsonData, password);
    }
    return {error, wallet};
  }

  downloadFile() {
    var path = app.getPath('home');
    path += '/Library/wallet/keystore/';
    shell.showItemInFolder(path);
  }

  hasWalletWithName(name, exchange) {
    var walletList = exchange == 'eth' ? this.ethWallets : (exchange == 'neo' ? this.neoWallets : []);
    var found = false;
    if (!name)
      return false;
    for (let w of walletList) {
      if (w.name === name) {
        found = true;
        break;
      }
    }
    return found;
  }

  hasWallets() {
    return this.ethWallets.length || this.neoWallets.length;
  }

  decrypt(encode,password,nonstrict){
    var keystore= this.aionWalletHelper.getDecode(encode,password,nonstrict)

    return keystore;
  }

  keystoreconvert(encode,password,nonstrict){
      var key= this.aionWalletHelper.decrypted(encode,password,nonstrict)
      return key
  }

}

