import axios from 'axios'
import { format, formatISO, parseISO } from 'date-fns'
import { Indicator } from 'stock-technical-indicators'
import { Supertrend } from 'stock-technical-indicators/study/Supertrend.js'
import { handleErrors } from './helper.js'
import spinner from './spinner.js'

const $axios = axios.create({
  baseURL: 'https://api.binance.com/api/v3'
})

export default class MarketService {
  marketPairs = []
  specificPairHistory = {}

  getSignalsFromCachedPair () {
    const historyData = this.specificPairHistory?.data?.map(curr => {
      const [date, open, high, low, close, volume] = curr
      return [
        formatISO(date),
        parseFloat(open),
        parseFloat(high),
        parseFloat(low),
        parseFloat(close),
        parseFloat(volume),
      ] 
    })

    const indicator = new Indicator(new Supertrend())

    const res = indicator.calculate(historyData, {
      period: 3,
      multiplier: 3
    })

    const output = res.map(curr => ({ 
      Pair: this.specificPairHistory.meta.symbol,
      Date: format(parseISO(curr[0]), 'yyyy-MM-dd HH:mm'),
      ...curr.Supertrend,
    }))

    console.table(
      output.filter((_, i) => {
        return output[i] && output[i - 1] && output[i].Direction !== output[i - 1].Direction
      })
    )
  }

  async fetchMarketPairs () {
    spinner.fetchMarketPairs.start()

    try {
      const res = await $axios.request({
        method: 'GET',
        url: '/ticker/price',
      })

      this.marketPairs = [...new Set([
        'BTCUSDT',
        'BTCBUSD',
        'ETHUSDT',
        'ETHBUSD',
        ...res.data.map(curr => curr.symbol)
      ])]
    } catch (err) {
      handleErrors(err)
    }

    spinner.fetchMarketPairs.stop()
  }

  async fetchSpecificPair (payload) {
    spinner.fetchSpecificPair.start()

    try {
      const res = await $axios.request({
        method: 'GET',
        url: '/klines',
        params: {
          symbol: payload.symbol,
          interval: payload.interval,
          limit: payload.limit || 500
        }
      })

      this.specificPairHistory = {
        meta: payload,
        data: res.data
      }
    } catch (err) {
      handleErrors(err)
    }

    spinner.fetchSpecificPair.stop()
  }
}