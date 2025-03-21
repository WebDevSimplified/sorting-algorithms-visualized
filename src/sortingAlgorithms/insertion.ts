export function insertionSort(array: number[]) {
  const n = array.length

  for (let i = 1; i < n; i++) {
    const value = array[i]
    let j = i - 1

    // Move elements of array[0..i-1], that are greater than value,
    // to one position ahead of their current position
    while (j >= 0 && array[j] > value) {
      array[j + 1] = array[j]
      j--
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
    yield [[i], []] as [number[], number[]]
    while (j >= 0 && array[j] > value) {
      yield [[j], []] as [number[], number[]]
      ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
      // array[j + 1] = array[j]
      j--
    }
    array[j + 1] = value
  }

  yield [[], Array.from({ length: array.length }, (_, i) => i)] as [
    number[],
    number[]
  ]

  return array
}
