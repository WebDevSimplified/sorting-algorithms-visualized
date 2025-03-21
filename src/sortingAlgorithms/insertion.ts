export function insertionSort(array: number[]) {
  for (let i = 1; i < array.length; i++) {
    const value = array[i]
    let j = i - 1

    for (j; j >= 0; j--) {
      if (array[j] > value) {
        array[j + 1] = array[j]
      } else {
        break
      }
    }

    array[j + 1] = value
  }

  return array
}

export function* insertionSortGenerator(array: number[]) {
  const n = array.length

  for (let i = 1; i < n; i++) {
    const value = array[i]
    let j = i - 1

    // Move elements of array[0..i-1], that are greater than value,
    // to one position ahead of their current position
    while (j >= 0 && array[j] > value) {
      yield [[j + 1], []] as [number[], number[]]
      ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
      // array[j + 1] = array[j]
      j--
    }
    yield [[j + 1], []] as [number[], number[]]
    array[j + 1] = value
  }

  yield [[], Array.from({ length: array.length }, (_, i) => i)] as [
    number[],
    number[]
  ]

  return array
}
