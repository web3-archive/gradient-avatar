import cryptoLib from 'crypto'
import Color from 'color'
import { v4 as uuid } from 'uuid'

import { hashStringToConfig, getMatchingConfig } from './helper'
import svg from './svg'

const generateGradient = (
  address: string,
  firstColor: string,
  secondColor: string,
  radius: number
) => {
  const hash = cryptoLib.createHash('md5').update(address).digest('hex')
  const { offset, lighten, rotate } = hashStringToConfig(hash)
  const matching = getMatchingConfig({ offset, lighten })

  const primaryColor = new Color(firstColor).lighten(lighten)
  const secondaryColor = new Color(secondColor).lighten(matching.lighten)

  let avatar = svg.replace('$FIRST', primaryColor.hex())
  avatar = avatar.replace('$SECOND', secondaryColor.hex())

  avatar = avatar.replace('$START', Math.round(offset).toString())
  avatar = avatar.replace('$END', Math.round(matching.offset).toString())
  avatar = avatar.replace('$ROTATE', Math.round(rotate).toString())

  avatar = avatar.replace(/(\$ID)/g, uuid())
  avatar = avatar.replace(/(\$SIZE)/g, (radius * 2).toString())
  avatar = avatar.replace(/(\$RADIUS)/g, radius.toString())

  return avatar
}

export const generateSVG = (
  address: string,
  first: string,
  second: string,
  radius: number
) => {
  return generateGradient(address, first, second, radius)
}
