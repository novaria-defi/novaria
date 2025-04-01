export function parseToBigInt(value: string, decimals = 18) {
  const [intPart = "0", decPart = ""] = value.split(".")
  const paddedDec = (decPart + "0".repeat(decimals)).slice(0, decimals)
  const fullString = intPart + paddedDec
  return BigInt(fullString)
}

export function separateByDot(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
