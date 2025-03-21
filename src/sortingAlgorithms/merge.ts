export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr
  }

  const middle = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, middle))
  const right = mergeSort(arr.slice(middle))

  const result: number[] = []
  let i = 0,
    j = 0

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i])
      i++
    } else {
      result.push(right[j])
      j++
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j))
}

export function* mergeSortGenerator(array: number[]) {
  if (array.length <= 1) return array

  const stack: { start: number; end: number }[] = []
  for (let i = 0; i < array.length; i++) {
    stack.push({ start: i, end: i })
  }

  while (stack.length > 1) {
    const left = stack.shift()!
    const right = stack.shift()!

    if (left.start >= right.start) {
      stack.push(left)
      stack.unshift(right)
      continue
    }

    let startOffset = 0

    let i = left.start,
      j = right.start

    while (i <= left.end + startOffset && j <= right.end) {
      yield [[i, j], []] as [number[], number[]]
      if (array[i] < array[j]) {
        i++
      } else {
        const value = array[j]
        array.splice(j, 1)
        array.splice(i, 0, value)
        j++
        startOffset++
      }
    }

    stack.push({ start: left.start, end: right.end })
  }

  yield [[], Array.from({ length: array.length }, (_, i) => i)] as [
    number[],
    number[]
  ]

  return array
}
