import React from 'react'
import Svg from 'react-inlinesvg'

import { PRIMARY_COLOR, SECONDARY_COLOR } from './constant'
import { generateSVG } from './image'

interface Props {
  address: string
  primary?: string
  secondary?: string
  size?: number
}

const GradientAvatar: React.FC<Props> = ({
  address,
  primary = PRIMARY_COLOR,
  secondary = SECONDARY_COLOR,
  size = 30
}) => {
  const svg = generateSVG(address, primary, secondary, size)

  return <Svg src={svg} />
}

export default GradientAvatar
