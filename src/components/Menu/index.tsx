import React, { useRef } from 'react'
// import { Info, BookOpen, Code, PieChart, MessageCircle } from 'react-feather'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu2.svg'
// import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import useToggle from '../../hooks/useToggle'
import eotcLogo from '../../assets/images/eotclogo.png'
import { ExternalLink } from '../../theme'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
    fill: ${({ theme }) => theme.text1};
  }
`
// background-color: ${({ theme }) => theme.bg3};
const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;  

  padding: 0.15rem 0.3rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: absolute;
    left: 15px;
    top: 25px;
  `};
`
// min-width: 8.125rem;
//   background-color: ${({ theme }) => theme.bg3};
//   box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
//     0px 24px 32px rgba(0, 0, 0, 0.01);
//   border-radius: 0.5rem;
//   padding: 0.5rem;
//   display: flex;
//   flex-direction: column;
//   font-size: 1rem;
//   position: absolute;
//   top: 3rem;
//   right: 0rem;
//   z-index: 100;#101B39
const MenuFlyout = styled.span`
  position: fixed;
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  left: 0;
  top: 0;
  background-color:${({ theme }) => theme.bg6};
  flex-direction: column;
`

const MenuTitle = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  line-height: 20px;
`

const MenuClose = styled.div`
  font-size:34px;
  cursor:pointer;
  color:${({ theme }) => theme.text1};
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text1};
  display: flex;
  margin: 10px;
  font-size: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.bg7};
  padding-bottom: 10px;
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`

// const CODE_LINK = 'https://github.com/Uniswap/uniswap-interface'

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const [open, toggle] = useToggle(false)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <MenuTitle>
            <div> <img src={eotcLogo} alt="" style={{width:'30px',height:'30px'}}/></div>
            <MenuClose onClick={toggle}>×</MenuClose>
          </MenuTitle>
          <div>
            <MenuItem id="link" href="https://eotc.im/">
              {/* <Info size={14} /> */}
              EOTC官网
            </MenuItem>
            <MenuItem id="link" href="https://fi.eotc.im/">
              {/* <BookOpen size={14} /> */}
              链上理财赚币
            </MenuItem>
            <MenuItem id="link" href="https://bsc.eotc.im/">
              {/* <MessageCircle size={14} /> */}
              去中心化OTC交易所
            </MenuItem>
            <MenuItem id="link" target='_blank' href="#!">
              {/* <Code size={14} /> */}
              去中心化借贷交易所
            </MenuItem>
            <MenuItem id="link" href="#!">
              {/* <MessageCircle size={14} /> */}
              去中心化合约交易所
            </MenuItem>
            <MenuItem id="link" href="#!">
              {/* <PieChart size={14} /> */}
              DID去中心化身份系统
            </MenuItem>
            <MenuItem id="link" href="#!">
              {/* <PieChart size={14} /> */}
            去中心化应用系统
            </MenuItem>
            <MenuItem id="link" href="https://nft.eotc.im/#/index/nft_home">
              {/* <PieChart size={14} /> */}
              EOTC NFT
            </MenuItem>
            <MenuItem id="link" href="#!">
              {/* <PieChart size={14} /> */}
              EOTC 元宇宙
            </MenuItem>
            <MenuItem id="link" href="#!">
              {/* <PieChart size={14} /> */}
              EOTC DAO
            </MenuItem>
          </div>
          {/* <MenuItem id="link" href="https://uniswap.org/">
            <Info size={14} />
            About
          </MenuItem>
          <MenuItem id="link" href="https://uniswap.org/docs/v2">
            <BookOpen size={14} />
            Docs
          </MenuItem>
          <MenuItem id="link" href={CODE_LINK}>
            <Code size={14} />
            Code
          </MenuItem>
          <MenuItem id="link" href="https://discord.gg/EwFs3Pp">
            <MessageCircle size={14} />
            Discord
          </MenuItem>
          <MenuItem id="link" href="https://uniswap.info/">
            <PieChart size={14} />
            Analytics
          </MenuItem> */}
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
