import React, { useContext, useEffect, useState } from 'react'
import Web3 from 'web3'
import BigNumber from 'bn.js'
// import { getContractAddress } from './addresses'
import DAIABI from '../abi/dai.json'
import { DAI_MAINNET, OHMYDAI_MAINNET } from "../constants/addresses.js"

const toBigNumber = (value) => new BigNumber(value)

export const ALLOW_MAX = toBigNumber(2).pow(toBigNumber(256)).sub(toBigNumber(1)).toString()

export const Web3Context = React.createContext(undefined)

export function useWeb3Provider() {
  const [web3, setWeb3] = useState()

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        const { ethereum } = window
        await ethereum.enable()

        const _web3 = new Web3(ethereum)
        setWeb3(_web3)
      }
    }

    initializeWeb3()
  }, [])

  return { web3 }
}

export function useWeb3() {
    return useContext(Web3Context);
}

// export function formatEthBalance(web3: any, value: any) {
//   return web3 && value && web3.utils.fromWei(value)
// }

export function useDefaultAccount() {
  const web3 = useWeb3()
  const [account, setAccount] = useState()

  useEffect(() => {
    if (web3) {
      web3.eth.getAccounts().then(accounts => setAccount(accounts[0]))

      window.ethereum.on('accountsChanged', accounts =>
        setAccount(accounts[0]),
      )
    }
  }, [web3])

  return account
}

export function useIsAllowed() {
  const web3 = useWeb3()
  const myAddress = useDefaultAccount()
  const [isAllow, setIsAllow] = useState(null)

  useEffect(() => {
    if (web3 && myAddress) {
      const daiContract = new web3.eth.Contract(DAIABI, DAI_MAINNET)
      daiContract.methods
          .allowance(myAddress, OHMYDAI_MAINNET)
          .call()
          .then(allowValue => {
            const isNotEqualToZero = !toBigNumber(allowValue).eq(toBigNumber(0))
            setIsAllow(isNotEqualToZero)
          })
          .catch(err => console.log(err))
    }
  }, [web3, myAddress])

  return isAllow
}

export function getNetworkVersion() {
    return window.ethereum.networkVersion;
}
