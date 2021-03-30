type Point = number[]

// Render the svg <path> element
// I:  - points (array): points coordinates
//     - command (function)
//       I:  - point (array) [x,y]: current point coordinates
//           - i (integer): index of 'point' in the array 'a'
//           - a (array): complete array of points coordinates
//       O:  - (string) a svg path command
// O:  - (string): a Svg <path> element
const svgPath = (
  points: Point[],
  command: (point: Point, i: number, a: Point[]) => void
) => {
  // build the d attributes by looping over the points
  const d = points.reduce(
    (acc, point, i, a) =>
      i === 0
        ? // if first point
          `M ${point[0]},${point[1]}`
        : // else
          `${acc} ${command(point, i, a)}`,
    ''
  )
  return `<path d="${d}" fill="url(#$ID)" clip-path="url(#$CLIP)"/>`
}

// Properties of a line
// I:  - pointA (array) [x,y]: coordinates
//     - pointB (array) [x,y]: coordinates
// O:  - (object) { length: l, angle: a }: properties of the line
const line = (pointA: Point, pointB: Point) => {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  }
}

// Position of a control point
// I:  - current (array) [x, y]: current point coordinates
//     - previous (array) [x, y]: previous point coordinates
//     - next (array) [x, y]: next point coordinates
//     - reverse (boolean, optional): sets the direction
// O:  - (array) [x,y]: a tuple of coordinates
const controlPoint = (
  current: Point,
  previous: Point,
  next: Point,
  reverse = false
) => {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current
  const n = next || current
  // The smoothing ratio
  const smoothing = 0.2
  // Properties of the opposed-line
  const o = line(p, n)
  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing
  // The control point position is relative to the current point
  const x = current[0] + Math.cos(angle) * length
  const y = current[1] + Math.sin(angle) * length
  return [x, y]
}

// Create the bezier curve command
// I:  - point (array) [x,y]: current point coordinates
//     - i (integer): index of 'point' in the array 'a'
//     - a (array): complete array of points coordinates
// O:  - (string) 'C x2,y2 x1,y1 x,y': SVG cubic bezier C command
const bezierCommand = (point: Point, i: number, a: Point[]) => {
  // start control point
  const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point)
  // end control point
  const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true)
  return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`
}

export const drawBeizerLine = (points: Point[]) => {
  return svgPath(points, bezierCommand)
}

const getDistance = (a: Point, b: Point) => {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2
}

const getCloseCorner = (p: Point, size: number) => {
  const corners = [
    [0, 0],
    [0, size],
    [size, size],
    [size, 0]
  ]
  let minIdex = 0
  let minVal

  for (let i = 0; i < 4; i++) {
    const distance = getDistance(corners[i], p)
    if (minVal === undefined || minVal > distance) {
      minVal = distance
      minIdex = i
    }
  }
  return corners[minIdex]
}

export const getFullPoints = (points: Point[], size: number) => {
  const start: Point = getCloseCorner(points[0], size)
  const end: Point = getCloseCorner(points[2], size)
  const temp = [start, ...points, end]

  const mid: Point = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
  const last: Point = [mid[0] * 2 - points[1][0], mid[1] * 2 - points[1][1]]

  return [
    ...temp,
    start[0] === end[0] || start[1] === end[1]
      ? last
      : getCloseCorner(last, size)
  ]
}
