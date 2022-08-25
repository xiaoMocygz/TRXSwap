import { Token } from '@eotcswap/swap-sdk'
import { transparentize } from 'polished'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens } from '../../hooks/Tokens'
import { ExternalLink, TYPE } from '../../theme'
import { getEtherscanLink, shortenAddress } from '../../utils'
import CurrencyLogo from '../CurrencyLogo'
import Modal from '../Modal'
import { AutoRow, RowBetween } from '../Row'
import { AutoColumn } from '../Column'
import { AlertTriangle } from 'react-feather'
import { ButtonError } from '../Button'

const Wrapper = styled.div<{ error: boolean }>`
  background: ${({ theme }) => transparentize(0.6, theme.bg3)};
  padding: 0.75rem;
  border-radius: 20px;
`

const WarningContainer = styled.div`
  max-width: 420px;
  width: 100%;
  padding: 1rem;
  background: rgba(242, 150, 2, 0.05);
  border: 1px solid #f3841e;
  border-radius: 20px;
  overflow: auto;
`

const StyledWarningIcon = styled(AlertTriangle)`
  stroke: ${({ theme }) => theme.red2};
`

interface TokenWarningCardProps {
  token?: Token
}

function TokenWarningCard({ token }: TokenWarningCardProps) {
  const { chainId } = useActiveWeb3React()

  const tokenSymbol = token?.symbol?.toLowerCase() ?? ''
  const tokenName = token?.name?.toLowerCase() ?? ''

  const allTokens = useAllTokens()

  const duplicateNameOrSymbol = useMemo(() => {
    if (!token || !chainId) return false

    return Object.keys(allTokens).some(tokenAddress => {
      const userToken = allTokens[tokenAddress]
      if (userToken.equals(token)) {
        return false
      }
      return userToken.symbol?.toLowerCase() === tokenSymbol || userToken.name?.toLowerCase() === tokenName
    })
  }, [token, chainId, allTokens, tokenSymbol, tokenName])

  if (!token) return null

  return (
    <Wrapper error={duplicateNameOrSymbol}>
      <AutoRow gap="6px">
        <AutoColumn gap="24px">
          <CurrencyLogo currency={token} size={'16px'} />
          <div> </div>
        </AutoColumn>
        <AutoColumn gap="10px" justify="flex-start">
          <TYPE.main>
            {token && token.name && token.symbol && token.name !== token.symbol
              ? `${token.name} (${token.symbol})`
              : token.name || token.symbol}{' '}
          </TYPE.main>
          {chainId && (
            <ExternalLink style={{ fontWeight: 400 }} href={getEtherscanLink(chainId, token.address, 'token')}>
              <TYPE.blue title={token.address}>{shortenAddress(token.address)} (在Tronscan上查看)</TYPE.blue>
            </ExternalLink>
          )}
        </AutoColumn>
      </AutoRow>
    </Wrapper>
  )
}

export default function TokenWarningModal({
  isOpen,
  tokens,
  onConfirm
}: {
  isOpen: boolean
  tokens: Token[]
  onConfirm: () => void
}) {
  const [understandChecked, setUnderstandChecked] = useState(false)
  const toggleUnderstand = useCallback(() => setUnderstandChecked(uc => !uc), [])

  const handleDismiss = useCallback(() => null, [])
  return (
    <Modal isOpen={isOpen} onDismiss={handleDismiss} maxHeight={90}>
      <WarningContainer className="token-warning-container">
        <AutoColumn gap="lg">
          <AutoRow gap="6px">
            <StyledWarningIcon />
            <TYPE.main color={'red2'}>导入的令牌</TYPE.main>
          </AutoRow>
          <TYPE.body color={'red2'}>
          任何人都可以在以太坊上创建 ERC20 代币 <em>任何</em> 名称，包括创建虚假版本
             现有代币和声称代表没有代币的项目的代币。
          </TYPE.body>
          <TYPE.body color={'red2'}>
          该接口可以通过令牌地址加载任意令牌。 请格外小心并进行研究
             与任意 ERC20 代币交互时。
          </TYPE.body>
          <TYPE.body color={'red2'}>
          如果您购买任意令牌， <strong>您可能无法将其卖回。</strong>
          </TYPE.body>
          {tokens.map(token => {
            return <TokenWarningCard key={token.address} token={token} />
          })}
          <RowBetween>
            <div>
              <label style={{ cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  className="understand-checkbox"
                  checked={understandChecked}
                  onChange={toggleUnderstand}
                />{' '}
                我明白
              </label>
            </div>
            <ButtonError
              disabled={!understandChecked}
              error={true}
              width={'140px'}
              padding="0.5rem 1rem"
              className="token-dismiss-button"
              style={{
                borderRadius: '10px'
              }}
              onClick={() => {
                onConfirm()
              }}
            >
              <TYPE.body color="white">继续</TYPE.body>
            </ButtonError>
          </RowBetween>
        </AutoColumn>
      </WarningContainer>
    </Modal>
  )
}
