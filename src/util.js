exports.ensureContract = (web3, contract) => web3.contract('system.alias')
  .methods.resolve(contract)
  .call()
  .then(c => web3.contract(c))

exports.convertValue = (value, converters) => {
  if (!converters || !converters.length) return value

  const convert = (value, converter) => {
    if (typeof converter === 'function') return converter(value)
    switch (converter) {
      case 'Number':
        return Number(value)
      case 'String':
        return String(value)
      case 'JSON.stringify':
        return JSON.stringify(value)
      case 'toString.base64':
        return value.toString('base64')
      case 'fromTimestamp': {
        const unix = Math.floor(Number(value) / 1000)
        return `FROM_UNIXTIME(${unix})`
      }
      default:
        return value
    }
  }

  return converters.reduce(convert, value)
}
