export function bubbleSort(array: number[]) {
  for (let n = array.length; n >= 0; n--) {
    for (let i = 0; i < n - 1; i++) {
      if (array[i] > array[i + 1]) {
        // Swap elements
        ;[array[i], array[i + 1]] = [array[i + 1], array[i]]
      }
    }
  }

  return array
}

export function* bubbleSortGenerator(array: number[]) {
  let n = array.length
  let swapped = true

  while (swapped) {
    swapped = false
    for (let i = 0; i < n - 1; i++) {
      yield [
        [i],
        Array.from(
          { length: array.length - n },
          (_, i) => array.length - i - 1
        ),
      ] as [number[], number[]]
      if (array[i] > array[i + 1]) {
        // Swap the elements
        ;[array[i], array[i + 1]] = [array[i + 1], array[i]]
        swapped = true
      }
    }
    // Reduce the range of elements to check since the largest element is bubbled to the end
    n--
  }

  yield [[], Array.from({ length: array.length }, (_, i) => i)] as [
    number[],
    number[]
  ]

  return array
}
