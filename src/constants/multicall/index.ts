import { ChainId } from '@eotcswap/swap-sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  // TODO: TRON: mainnet multicall contract address
  [ChainId.MAINNET]: '0xD3573a8728A49512A1485D63180Ed5b095e11D5C',
  [ChainId.NILE]: '0x96b93b2a59ca420a804a312e7a9e644750284511',
  [ChainId.SHASTA]: '0x6AF98D1B75DC6B771CF7959F233C34C38048BEF5'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
