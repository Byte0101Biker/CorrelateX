export function correlation(x, y) {
  if (!x || !y || x.length !== y.length || x.length === 0) return 0

  const n = x.length
  const meanX = x.reduce((a, b) => a + b, 0) / n
  const meanY = y.reduce((a, b) => a + b, 0) / n

  const numerator = x.map((xi, i) => (xi - meanX) * (y[i] - meanY)).reduce((a, b) => a + b, 0)
  const denominatorX = Math.sqrt(x.map(xi => (xi - meanX) ** 2).reduce((a, b) => a + b, 0))
  const denominatorY = Math.sqrt(y.map(yi => (yi - meanY) ** 2).reduce((a, b) => a + b, 0))

  if (denominatorX === 0 || denominatorY === 0) return 0

  const corr = numerator / (denominatorX * denominatorY)
  return isNaN(corr) ? 0 : corr
}