import ora from 'ora'

const spinner = Object.freeze({
  fetchMarketPairs: ora('Market pairs fetching...'),
  fetchSpecificPair: ora('Pair history fetching...')
})

export default spinner