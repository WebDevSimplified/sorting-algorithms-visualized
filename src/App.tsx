import { FormEvent, useEffect, useReducer } from "react"
import { Button } from "./components/ui/button"
import { cn } from "./lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select"
import { Label } from "./components/ui/label"
import { Slider } from "./components/ui/slider"
import { Input } from "./components/ui/input"
import { bubbleSortGenerator } from "./sortingAlgorithms/bubble"
import { insertionSortGenerator } from "./sortingAlgorithms/insertion"
import { selectionSortGenerator } from "./sortingAlgorithms/selection"
import { quickSortGenerator } from "./sortingAlgorithms/quick"
import { mergeSortGenerator } from "./sortingAlgorithms/merge"

const SORTING_ALGORITHMS = [
  "bubble",
  "insertion",
  "selection",
  "quick",
  "merge",
] as const
const OPERATIONS_PER_SECOND = 2

type Action =
  | { type: "RANDOMIZE" }
  | { type: "SORT" }
  | { type: "STOP" }
  | { type: "FINISH_SORTING" }
  | { type: "CHANGE_ALGORITHM"; payload: SortingAlgorithm }
  | { type: "CHANGE_SPEED"; payload: number }
  | { type: "CHANGE_ARRAY_LENGTH"; payload: number }
  | { type: "SET_INDICES"; payload: { active: number[]; sorted: number[] } }
type SortingAlgorithm = (typeof SORTING_ALGORITHMS)[number]
type State = {
  sortingAlgorithm: SortingAlgorithm
  sortingSpeed: number
  randomArray: number[]
  activeIndices: number[]
  sortedIndices: number[]
  activeSortingFunction?: Generator<[number[], number[]]>
  isSorting: boolean
}

const MAX_ARRAY_LENGTH = 300
const MIN_ARRAY_LENGTH = 10
const MAX_SPEED = 50
const MIN_SPEED = 1

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "RANDOMIZE":
      if (state.isSorting) return state
      return {
        ...state,
        activeIndices: [],
        sortedIndices: [],
        isSorting: false,
        activeSortingFunction: undefined,
        randomArray: getRandomElements(state.randomArray.length),
      }
    case "SORT":
      return {
        ...state,
        activeSortingFunction:
          state.activeSortingFunction ??
          getSortingFunction(state.sortingAlgorithm)(state.randomArray),
        isSorting: true,
      }
    case "STOP":
      return {
        ...state,
        isSorting: false,
      }
    case "FINISH_SORTING":
      return {
        ...state,
        isSorting: false,
        activeSortingFunction: undefined,
      }
    case "CHANGE_ALGORITHM":
      if (state.isSorting) return state
      return {
        ...state,
        sortingAlgorithm: action.payload,
        activeIndices: [],
        sortedIndices: [],
        activeSortingFunction: undefined,
      }
    case "CHANGE_SPEED":
      if (action.payload > MAX_SPEED || action.payload < MIN_SPEED) return state
      return {
        ...state,
        sortingSpeed: action.payload,
      }
    case "CHANGE_ARRAY_LENGTH":
      if (
        action.payload < MIN_ARRAY_LENGTH ||
        action.payload > MAX_ARRAY_LENGTH ||
        isNaN(action.payload)
      ) {
        return state
      }
      if (state.isSorting) return state
      return {
        ...state,
        activeIndices: [],
        sortedIndices: [],
        isSorting: false,
        activeSortingFunction: undefined,
        randomArray: getRandomElements(action.payload),
      }
    case "SET_INDICES":
      return {
        ...state,
        activeIndices: action.payload.active,
        sortedIndices: action.payload.sorted,
      }
    default:
      throw new Error(`Invalid action: ${action satisfies never}`)
  }
}

export default function App() {
  const [
    {
      sortingAlgorithm,
      sortingSpeed,
      randomArray,
      activeIndices,
      sortedIndices,
      activeSortingFunction,
      isSorting,
    },
    dispatch,
  ] = useReducer(reducer, {
    sortingAlgorithm: "bubble",
    sortingSpeed: 1,
    randomArray: getRandomElements(100),
    activeIndices: [],
    sortedIndices: [],
    isSorting: false,
  })

  useEffect(() => {
    let cancel = false
    let timeout: NodeJS.Timeout
    async function inner() {
      while (activeSortingFunction != null && isSorting && !cancel) {
        const {
          done,
          value: [active, sorted],
        } = activeSortingFunction.next()

        if (done) {
          dispatch({ type: "FINISH_SORTING" })
          return
        }

        dispatch({ type: "SET_INDICES", payload: { active, sorted } })
        await new Promise<void>(resolve => {
          timeout = setTimeout(
            resolve,
            1000 / OPERATIONS_PER_SECOND / sortingSpeed
          )
        })
      }
    }

    inner()

    return () => {
      clearTimeout(timeout)
      cancel = true
    }
  }, [activeSortingFunction, sortingSpeed, isSorting])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (isSorting) {
      dispatch({ type: "STOP" })
    } else {
      dispatch({ type: "SORT" })
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="container pt-4 flex items-center flex-col gap-8 pb-4 lg:gap-24 lg:pb-8 lg:flex-row">
        <h1 className="font-bold text-2xl grow-1">Sort Visualizer</h1>
        <form
          className="grid gap-4 items-end grid-cols-2 md:grid-cols-4 md:gap-8"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1 min-w-32 md:gap-2">
            <Label htmlFor="algorithm">Algorithm</Label>
            <Select
              disabled={isSorting}
              value={sortingAlgorithm}
              onValueChange={e =>
                dispatch({
                  type: "CHANGE_ALGORITHM",
                  payload: e as SortingAlgorithm,
                })
              }
            >
              <SelectTrigger id="algorithm" className="capitalize w-full">
                <SelectValue placeholder="Sorting Algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SORTING_ALGORITHMS.map(algorithm => (
                    <SelectItem
                      key={algorithm}
                      value={algorithm}
                      className="capitalize"
                    >
                      {algorithm}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1 min-w-32 md:gap-2">
            <Label htmlFor="amountOfItems">Amount</Label>
            <Input
              disabled={isSorting}
              id="amountOfItems"
              type="number"
              defaultValue={randomArray.length}
              onChange={e =>
                dispatch({
                  type: "CHANGE_ARRAY_LENGTH",
                  payload: e.target.valueAsNumber,
                })
              }
              max={MAX_ARRAY_LENGTH}
              min={MIN_ARRAY_LENGTH}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-32 md:gap-2">
            <Label htmlFor="speed">
              Speed <small>({sortingSpeed}x)</small>
            </Label>
            <div className="h-9 flex items-center">
              <Slider
                id="speed"
                value={[sortingSpeed]}
                onValueChange={e =>
                  dispatch({ type: "CHANGE_SPEED", payload: e[0] })
                }
                max={MAX_SPEED}
                min={MIN_SPEED}
                step={1}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant={isSorting ? "accent" : "default"}>
              {isSorting ? "Stop" : "Sort"}
            </Button>
            <Button
              onClick={() => dispatch({ type: "RANDOMIZE" })}
              disabled={isSorting}
              type="button"
              variant="outline"
            >
              Randomize
            </Button>
          </div>
        </form>
        <div className="grow-1" />
      </header>
      <main className="flex items-end w-full grow  overflow-hidden">
        {randomArray.map((value, index) => (
          <div
            key={index}
            className={cn(
              "grow flex items-end justify-center pb-2 bg-muted",
              sortedIndices.includes(index) && "bg-secondary",
              activeIndices.includes(index) && "bg-accent"
            )}
            style={{ height: `${value}%` }}
          />
        ))}
      </main>
    </div>
  )
}

function getRandomElements(arraySize: number) {
  return Array.from(
    { length: arraySize },
    () => Math.floor(Math.random() * 100) + 1
  )
}

function getSortingFunction(algorithm: SortingAlgorithm) {
  switch (algorithm) {
    case "bubble":
      return bubbleSortGenerator
    case "insertion":
      return insertionSortGenerator
    case "selection":
      return selectionSortGenerator
    case "quick":
      return quickSortGenerator
    case "merge":
      return mergeSortGenerator
    default:
      throw new Error(`Invalid algorithm: ${algorithm satisfies never}`)
  }
}
