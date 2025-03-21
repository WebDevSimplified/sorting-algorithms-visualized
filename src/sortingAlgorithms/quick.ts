export function quickSort(array: number[]): number[] {
  if (array.length <= 1) {
    return array
  }

  const pivot = array[array.length - 1]
  const left: number[] = []
  const right: number[] = []

  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] < pivot) {
      left.push(array[i])
    } else {
      right.push(array[i])
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)]
}

export function* quickSortGenerator(array: number[]) {
  if (array.length <= 1) {
    return array
  }

  const stack: { start: number; end: number }[] = [
    { start: 0, end: array.length - 1 },
  ]

  const sortedIndices: number[] = []

  while (stack.length) {
    const { start, end } = stack.pop()!
    if (start >= end) {
      sortedIndices.push(start, end)
      continue
    }

    const pivot = array[end]
    let pivotIndex = end

    for (let i = start; i < pivotIndex; i++) {
      yield [[i, pivotIndex], sortedIndices] as [number[], number[]]
      if (array[i] > pivot) {
        const value = array[i]
        array.splice(i, 1)
        array.splice(end, 0, value)
        i--
        pivotIndex--
      }
    }

    stack.push({ start: pivotIndex + 1, end })
    stack.push({ start, end: pivotIndex - 1 })
    sortedIndices.push(pivotIndex)
  }

  yield [[], sortedIndices] as [number[], number[]]

  return array
}
