import React, {
  createContext,
  useContext,
  useReducer,
  useState,
} from 'react'

import type { TaskStateModel } from '../models/TaskStateModel'

const initialState: TaskStateModel = {
  tasks: [],
  secondsRemaining: 0,
  formattedSecondsRemaining: '00:00',
  activeTask: null,
  currentCycle: 0,
  config: {
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
  },
}

export type TaskContextProps = {
  state: TaskStateModel
  setState: React.Dispatch<React.SetStateAction<TaskStateModel>>
}

const initialContextValue: TaskContextProps = {
  state: initialState,
  setState: () => {},
}

export const TaskContext =
  createContext<TaskContextProps>(initialContextValue)

type TaskContextProviderProps = {
  children: React.ReactNode
}

export function TaskContextProvider({
  children,
}: TaskContextProviderProps) {
  const [state, setState] = useState(initialState)

  const [numero, dispatch] = useReducer(
    (state: number, action: string) => {
      console.log(
        'Estado atual:',
        state,
        'Ação disparada:',
        action,
      )

      switch (action) {
        case 'INCREMENT':
          return state + 1

        case 'DECREMENT':
          return state - 1

        case 'INITIAL_STATE':
          return 0

        default:
          return state
      }
    },
    0,
  )

  return (
    <TaskContext.Provider value={{ state, setState }}>
      <h1>O número é: {numero}</h1>

      <button onClick={() => dispatch('INCREMENT')}>
        Incrementar
      </button>

      <button onClick={() => dispatch('DECREMENT')}>
        Decrementar
      </button>

      <button onClick={() => dispatch('INITIAL_STATE')}>
        ZERAR
      </button>
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  return useContext(TaskContext)
}