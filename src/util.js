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
      case 'Date':
        return new Date(value)
      case 'JSON.stringify':
        return JSON.stringify(value)
      case 'toString.base64':
        return value.toString('base64')
        case 'toString.hex':
          return value.toString('hex')
      case 'toMySqlTime': {
        if (value == null) return value
        if (typeof value.getUTCFullYear !== 'function') {
          value = new Date(value)
        }
        return value.getUTCFullYear() + '-' +
          ('00' + (value.getUTCMonth() + 1)).slice(-2) + '-' +
          ('00' + value.getUTCDate()).slice(-2) + ' ' +
          ('00' + value.getUTCHours()).slice(-2) + ':' +
          ('00' + value.getUTCMinutes()).slice(-2) + ':' +
          ('00' + value.getUTCSeconds()).slice(-2)
      }
      default:
        return value
    }
  }

  return converters.reduce(convert, value)
}

exports.handleOptions = res => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-credentials", "true");
  res.setHeader("access-control-allow-methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("access-control-allow-headers", "Authorization");
  res.setHeader("access-control-max-age", 86400);
  res.setHeader("Content-Type", "text/plain charset=UTF-8");
  res.setHeader("Content-Type", 0);
  res.writeHead(204); // no content
  res.end();
}