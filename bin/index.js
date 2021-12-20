#!/usr/bin/env node
import chalk from 'chalk'
import figlet from 'figlet'
import prompts from 'prompts'
import MarketService from '../src/service.js'


(async () => {
  console.log(chalk.blueBright(figlet.textSync('crypto-signal')), `\n`)
  
  const service = new MarketService()

  await service.fetchMarketPairs()

  const input = await prompts([
    {
      type: 'autocomplete',
      name: 'symbol',
      message: 'Search Symbol / Pair',
      choices: service.marketPairs.map(curr => ({ title: curr, value: curr })),
      limit: 5
    },
    {
      type: 'select', 
      name: 'interval',
      message: 'Interval',
      choices: [
        { title: '15m',value: '15m' },
        { title: '1h',value: '1h' },
        { title: '4h',value: '4h' },
        { title: '1d',value: '1d' },
        { title: '1w', value: '1w' }
      ],
    },
  ])

  if (input.symbol && input.interval) {
    await service.fetchSpecificPair({
      symbol: input.symbol,
      interval: input.interval
    })

    service.getSignalsFromCachedPair()
  }
})()