/* eslint-disable @typescript-eslint/camelcase */
import TronWeb from 'tronweb'
const Config = {
  trongrid: {
    host: 'https://api.trongrid.io/', //https://api.trongrid.io
    key: '6b3e915b-6166-44eb-87c7-ae2ee3058d8b'
  },
  v2Contract: {
    poly: 'TFkCVEwDuu6HA61uUiwfyqt5HkGwtTQqFK',
    factory: 'TCxrpNBhybu5mKrRXLfQgwvzvENBZsdY8y',
    router: 'TYTEGJsKhkC5y7XY4w6eu2Najz9NnfaMZA'
  },
  remainTrx: 100
}

const chain = {
  privateKey: '01',
  fullHost: 'https://api.trongrid.io/'
}

const DATA_LEN = 64
export const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
const privateKey = chain.privateKey

const mainchain = new TronWeb({
  fullHost: chain.fullHost,
  privateKey
})

const { trongrid, v2Contract } = Config

if (trongrid && mainchain.setHeader && mainchain.fullNode.host === trongrid.host) {
  mainchain.setHeader({ 'TRON-PRO-API-KEY': trongrid.key })
}
export const getContract = () => {
  const swapContract = v2Contract
  return swapContract
}

export const tronObj = {
  tronWeb: null
}
// export const userAddress = window.tronWeb.defaultAddress.base58

export const trigger = async (address, functionSelector, parameters = [], options = {}) => {
  try {
    const tronweb = tronObj.tronWeb
    const transaction = await tronweb.transactionBuilder.triggerSmartContract(
      address,
      functionSelector,
      Object.assign({ feeLimit: Config.remainTrx * 1e6 }, options),
      parameters
    )
    if (!transaction.result || !transaction.result.result) {
      throw new Error('Unknown trigger error: ' + JSON.stringify(transaction.transaction))
    }

    const signedTransaction = await tronweb.trx.sign(transaction.transaction)
    const result = await tronweb.trx.sendRawTransaction(signedTransaction)
    if (result && result.result) {
      console.log(result)
    }
    return result
  } catch (error) {
    if (error == 'Confirmation declined by user') {
      class RejectError extends Error {
        constructor(message) {
          super(message)
          this.code = 4001
        }
      }
      console.log(`trigger error ${address} - ${functionSelector}`, error.message ? error.message : error)
      throw new RejectError('Confirmation declined by user')
    }
    return {}
  }
}
