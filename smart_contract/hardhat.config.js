// https://eth-sepolia.g.alchemy.com/v2/p6Nk66KX5If6jkv0PfcHK5yf6V9tMIiP

require ('@nomiclabs/hardhat-waffle')

module.exports={
  solidity: '0.8.0',
  networks:{
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/p6Nk66KX5If6jkv0PfcHK5yf6V9tMIiP',
      accounts:[ 'c923591adfe4251f7b41822f16bf2def2c75384be2787f68a7c4eb1a9a814fcd' ]
    }
  }
}