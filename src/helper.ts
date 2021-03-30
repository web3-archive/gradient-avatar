const djb2 = (str: string) => {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i)
  }
  return hash
}

export const hashStringToConfig = (str: string) => {
  const hash = djb2(str)

  const x1 = ((hash & 0xfff000) >> 12) / 0xfff
  const x2 = (hash & 0x00ff0f) / 0xff0f
  const x3 = (hash & 0x0f0f0f) / 0xf0f0f

  const y1 = ((hash & 0x0ff000) >> 12) / 0xff
  const y2 = ((hash & 0x0f0f00) >> 8) / 0xf0f
  const y3 = (hash & 0x000f0f) / 0xf0f

  const l = (hash & 0x00ff00) >> 8
  const r = hash & 0x0000ff
  const c = hash & 0x00000f % 2

  return {
    points: [
      [x1, y1],
      [x2, y2],
      [x3, y3]
    ],
    lighten: l / 0xff,
    rotate: (r * 360) / 0xff,
    choice: c
  }
}

export const getMatchingConfig = ({ lighten }: { lighten: number }) => {
  return {
    lighten: 1 - lighten ** 2
  }
}
