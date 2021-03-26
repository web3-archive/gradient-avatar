const djb2 = (str: string) => {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i)
  }
  return hash
}

export const hashStringToConfig = (str: string) => {
  const hash = djb2(str)
  const o = (hash & 0xff0000) >> 16
  const l = (hash & 0x00ff00) >> 8
  const r = hash & 0x0000ff

  return {
    offset: (o * 100) / 0xff,
    lighten: l / 0xff,
    rotate: (r * 360) / 0xff
  }
}

export const getMatchingConfig = ({
  offset,
  lighten
}: {
  offset: number
  lighten: number
}) => {
  return {
    offset: 100 + offset,
    lighten: 1 - lighten
  }
}
