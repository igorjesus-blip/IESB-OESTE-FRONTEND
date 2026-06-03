import { useEffect, useReducer, useRef } from 'react'

import { initialTaskState } from './initialTaskState'
import { taskReducer } from './taskReducer'
import { TaskContext } from './TaskContext'
import { TimerWorkerManager } from '../../workers/TimerWorkerManager'
import { TaskActionTypes } from './TaskActions'
import { loadBeep } from '../../utils/loadBeep'

type TaskContextProviderProps = {
  children: React.ReactNode
}

export function TaskContextProvider({
  children,
}: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(
    taskReducer,
    initialTaskState,
  )

  const playBeepRef = useRef<
    ReturnType<typeof loadBeep> | null
  >(null)

  useEffect(() => {
    if (!state.activeTask) {
      TimerWorkerManager.getInstance().terminate()
      playBeepRef.current = null
      return
    }

    const worker = TimerWorkerManager.getInstance()

    worker.onmessage(event => {
      const countDownSeconds = event.data

      if (countDownSeconds <= 0) {
        if (playBeepRef.current) {
          playBeepRef.current()
          playBeepRef.current = null
        }

        dispatch({
          type: TaskActionTypes.COMPLETE_TASK,
        })

        worker.terminate()
        return
      }

      dispatch({
        type: TaskActionTypes.COUNT_DOWN,
        payload: {
          secondsRemaining: countDownSeconds,
        },
      })
    })

    worker.postMessage(state)
  }, [state.activeTask])

  useEffect(() => {
    if (!state.activeTask) {
      playBeepRef.current = null
      return
    }

    if (playBeepRef.current === null) {
      const play = loadBeep()
      playBeepRef.current = play
      play()
    }
  }, [state.activeTask])

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  )
}