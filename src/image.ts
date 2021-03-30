import cryptoLib from 'crypto'
import Color from 'color'
import { v4 as uuid } from 'uuid'

import { hashStringToConfig, getMatchingConfig } from './helper'
import svg from './svg'
import { drawBeizerLine, getFullPoints } from './path'

const generateGradient = (
  address: string,
  firstColor: string,
  secondColor: string,
  radius: number
) => {
  const hash = cryptoLib.createHash('md5').update(address).digest('hex')
  const { points, lighten, rotate, choice } = hashStringToConfig(hash)

  const size = radius * 2
  const gradientColor = !choice ? firstColor : secondColor
  const backgroundColor = choice ? firstColor : secondColor
  const linePoints = getFullPoints(points, size).map((point) => [
    Math.round(size * point[0]),
    Math.round(size * point[1])
  ])

  const matching = getMatchingConfig({ lighten })

  const primaryColor = new Color(gradientColor).lighten(lighten)
  const secondaryColor = new Color(gradientColor).lighten(matching.lighten)

  let avatar = svg.replace('$FIRST', primaryColor.hex())
  avatar = avatar.replace('$SECOND', secondaryColor.hex())
  avatar = avatar.replace('$PATH', drawBeizerLine(linePoints))

  avatar = avatar.replace('$BACK', backgroundColor)
  avatar = avatar.replace('$ROTATE', Math.round(rotate).toString())

  avatar = avatar.replace(/(\$ID)/g, uuid())
  avatar = avatar.replace(/(\$CLIP)/g, uuid())
  avatar = avatar.replace(/(\$SIZE)/g, size.toString())
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
