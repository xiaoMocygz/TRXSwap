import { Currency, ETHER, Token } from '@eotcswap/swap-sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'TRX'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
