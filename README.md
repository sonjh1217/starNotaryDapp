## STAR NOTARY DAPP
Decentralized app for star notary

- Token Name: Star token

- Token symbol: STT

- Truffle: v5.0.12

- OpenZeppline: 2.1.2

## To Run on Local Network
- Use truffle
```
truffle develop
```

## To Run on Rinkedby Network
1. Edit truffle-config.js file to connect to metamask and infura.
```
const infuraKey = "[YOUR_INFURA_KEY]";
const mnemonic = "[YOUR_METAMASK_SEED_PHRASE]";
```

2. Deployt the contract to Rinkedby network
```
truffle migrate --reset --network rinkeby
```

## To Run DApp
1. run the DApp with following commands on terminal.
```
cd app
npm run dev
```
2. Open http://localhost:8080/ on a web browser which is with metamask.