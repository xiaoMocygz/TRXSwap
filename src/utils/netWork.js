/* eslint-disable @typescript-eslint/no-this-alias */
// Libraries
import isMobile from 'ismobilejs'

import { tronObj } from './blockchain'
const Config = {
  trongrid: {
    host: 'https://api.trongrid.io/', //https://api.trongrid.io
    key: ''
  },
  v2Contract: {
    poly: 'TFkCVEwDuu6HA61uUiwfyqt5HkGwtTQqFK',
    factory: 'TCxrpNBhybu5mKrRXLfQgwvzvENBZsdY8y',
    router: 'TYTEGJsKhkC5y7XY4w6eu2Najz9NnfaMZA'
  },
  remainTrx: 100,
  chain: {
    privateKey: '01',
    fullHost: 'https://api.trongrid.io/'
  }
}

export default class Network {
  tronWeb = false
  defaultAccount = null
  isConnected = false
  locationStr = ''
  language = ''
  loginType = 'TRONLINK'
  settingVisible = false
  settingVisibleV2 = false
  settingVisibleMigrate = false
  settingSlippage = '0.5'
  settingSlippageV2 = '0.5'
  settingSlippageMigrate = '1'
  settingDeadline = '1'
  settingDeadlineV2 = '1'
  settingDeadlineMigrate = '1'
  defaultSelectedKeys = '1'
  loginModalVisible = false
  loginModalStep = 1
  trxBalance = '--'
  registry = {} // all transactions
  mobileStatus = false
  noSupport = false

  constructor(rootStore) {
    this.rootStore = rootStore
    this.interval = null
  }

  saveTransactions = (record, needDelete) => {
    const { tx, status } = record
    const data = window.localStorage.getItem(window.defaultAccount) || '[]'
    const dataArr = JSON.parse(data)
    let pos = 'true'
    dataArr.map((item, index) => {
      if (item.tx === tx) {
        pos = index
      }
    })
    if (pos === 'true') {
      return
    }
    dataArr[pos] = record
    window.localStorage.setItem(window.defaultAccount, JSON.stringify(dataArr))
  }

  setVariablesInterval = () => {
    if (!this.interval) {
      this.interval = setInterval(async () => {
        try {
          // this.getTrxBalance()
          // this.checkPendingTransactions()
        } catch (err) {
          console.log('interval error:' + err)
        }
      }, 3000)
    }
  }

  setData = (obj = {}) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    Object.keys(obj).map(key => {
      self[key] = obj[key]
    })
  }

  checkLogin = () => {
    if (!this.tronWeb || !this.tronWeb.defaultAddress.base58 || !this.defaultAccount) {
      return false
    }
    return true
  }

  initTronWeb = (tronWeb, cb) => {
    tronWeb.setFullNode(Config.chain.fullHost)
    tronWeb.setSolidityNode(Config.chain.fullHost)

    const { trongrid } = Config
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    if (trongrid && tronWeb.setHeader && tronWeb.fullNode.host === trongrid.host) {
      tronWeb.setHeader({ 'TRON-PRO-API-KEY': trongrid.key })
    }
    tronObj.tronWeb = this.tronWeb = tronWeb
    this.defaultAccount = this.tronWeb.defaultAddress.base58
    window.defaultAccount = this.defaultAccount
    this.isConnected = true
    cb && cb()
    this.setVariablesInterval()
  }

  closeConnect = () => {
    this.tronWeb = false
    window.defaultAccount = this.defaultAccount = false
  }

  handleTronWallet = async (tron, cb, pop, cbn = false) => {
    if (!tron) {
      this.closeConnect()
      cbn && cbn()
      return
    }
    if (tron && tron.defaultAddress && tron.defaultAddress.base58) {
      this.initTronWeb(tron, cb)
      return
    }
    const tronLink = tron
    if (tronLink.ready) {
      const tronWeb = tronLink.tronWeb
      tronWeb && this.initTronWeb(tronWeb, cb)
      this.loginModalVisible = false
    } else {
      if (pop) {
        const res = await tronLink.request({ method: 'tron_requestAccounts' })
        if (res.code === 200) {
          const tronWeb = tronLink.tronWeb
          tronWeb && this.initTronWeb(tronWeb, cb)
          this.loginModalVisible = false
          return
        }
        if (res.code === 4001) {
          this.rootStore.network.setData({ loginModalStep: 1 })
        }
        this.closeConnect()
      }
    }
  }

  initTronLinkWallet = (cb = false, cbn = false, pop = true) => {
    try {
      const self = this

      const tronlinkPromise = new Promise(reslove => {
        window.addEventListener(
          'tronLink#initialized',
          async () => {
            // console.log('listener win');
            return reslove(window.tronLink)
          },
          {
            once: true
          }
        )

        setTimeout(() => {
          if (window.tronLink) {
            return reslove(window.tronLink)
          }
        }, 3000)
      })

      const appPromise = new Promise(resolve => {
        let timeCount = 0
        // const self = this;
        const tmpTimer1 = setInterval(() => {
          timeCount++
          if (timeCount > 8) {
            // self.isConnected = false;
            cbn && cbn()
            clearInterval(tmpTimer1)
            return resolve(false)
          }
          if (window.tronLink) {
            clearInterval(tmpTimer1)
            if (window.tronLink.ready) {
              return resolve(window.tronLink)
            }
          } else if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
            clearInterval(tmpTimer1)
            return resolve(window.tronWeb)
          }
        }, 1000)
      })

      Promise.race([tronlinkPromise, appPromise]).then(tron => {
        // console.log(tron, tron.ready, window.tronLink.ready, window.tronWeb.ready);
        self.handleTronWallet(tron, cb, pop, cbn)
      })
    } catch (e) {
      console.log(e)
    }
  }

  connectWallet = async () => {
    if (!window.tronWeb && !window.tronlink && isMobile(window.navigator).any) {
      // 没有钱包支持
      this.setData({ noSupport: true })
    } else {
      this.setData({
        loginModalVisible: true,
        loginModalStep: 1
      })
    }
  }
  // 监听listenTronLink
  listenTronLink = () => {
    window.addEventListener('message', res => {
      if (res.data.message && res.data.message.action == 'accountsChanged') {
        return window.location.reload()
      }
      if (res.data.message && res.data.message.action == 'setAccount') {
        if (window.tronWeb && !window.tronLink && res.data.message.data.address !== this.defaultAccount) {
          return window.location.reload()
        }
      }
      if (res.data.message && res.data.message.action == 'setNode') {
        window.location.reload()
        return
      }
      // disconnectWebsite
      if (res.data.message && res.data.message.action == 'disconnectWeb') {
        window.location.reload()
        return
      }
      // connectWebsite
      if (res.data.message && res.data.message.action == 'connectWeb') {
        window.location.reload()
      }
    })
  }

  getTransactionsData = () => {
    const data = window.localStorage.getItem(window.defaultAccount) || '[]'
    const transactions = JSON.parse(data)
    return transactions
  }

  saveSettings = (slippage, deadline) => {
    this.settingSlippage = slippage
    this.settingDeadline = deadline
    const settings = { slippage, deadline }
    window.localStorage.setItem('settings', JSON.stringify(settings))
  }

  saveSettingsForV2 = (slippage, deadline) => {
    this.settingSlippageV2 = slippage
    this.settingDeadlineV2 = deadline
    const settings = { slippage, deadline }
    window.localStorage.setItem('settingsV2', JSON.stringify(settings))
  }

  saveSettingsForMigrate = (slippage, deadline) => {
    this.settingSlippageMigrate = slippage
    this.settingDeadlineMigrate = deadline
    const settings = { slippage, deadline }
    window.localStorage.setItem('settingsMigrate', JSON.stringify(settings))
  }

  getSettingsData = () => {
    const settings = JSON.parse(window.localStorage.getItem('settings'))
    if (settings) {
      this.settingSlippage = settings.slippage ? settings.slippage : this.settingSlippage
      this.settingDeadline = settings.deadline ? settings.deadline : this.settingDeadline
    }
  }

  getSettingsDataForV2 = () => {
    const settings = JSON.parse(window.localStorage.getItem('settingsV2'))
    if (settings) {
      this.settingSlippageV2 = settings.slippage ? settings.slippage : this.settingSlippageV2
      this.settingDeadlineV2 = settings.deadline ? settings.deadline : this.settingDeadlineV2
    }
  }

  getSettingsDataForMigrate = () => {
    const settings = JSON.parse(window.localStorage.getItem('settingMigrate'))
    if (settings) {
      this.settingSlippageMigrate = settings.slippage ? settings.slippage : this.settingSlippageMigrate
      this.settingDeadlineMigrate = settings.deadline ? settings.deadline : this.settingDeadlineMigrate
    }
  }
}
