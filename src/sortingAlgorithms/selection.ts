export function selectionSort(array: number[]) {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i

    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j
      }
    }

    if (minIndex !== i) {
      // Swap elements
      ;[array[i], array[minIndex]] = [array[minIndex], array[i]]
    }
  }

  return array
}

export function* selectionSortGenerator(array: number[]) {
  const n = array.length

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i

    for (let j = i + 1; j < n; j++) {
      yield [[i, j, minIndex], Array.from({ length: i }, (_, i) => i)] as [
        number[],
        number[]
      ]
      if (array[j] < array[minIndex]) {
        minIndex = j
      }
    }

    // Swap the found minimum element with the first element
    if (minIndex !== i) {
      yield [[i, minIndex], Array.from({ length: i }, (_, i) => i)] as [
        number[],
        number[]
      ]
      ;[array[i], array[minIndex]] = [array[minIndex], array[i]]
    }
  }

  yield [[], Array.from({ length: array.length }, (_, i) => i)] as [
    number[],
    number[]
  ]

  return array
}
