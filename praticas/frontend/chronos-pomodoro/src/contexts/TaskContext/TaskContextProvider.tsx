import { useEffect, useReducer, useRef } from 'react'

import { initialTaskState } from './initialTaskState'
import { taskReducer } from './taskReducer'
import { TaskContext } from './TaskContext'
import { TimerWorkerManager } from '../../workers/TimerWorkerManager'
import { TaskActionTypes } from './TaskActions'
import { loadBeep } from '../../utils/loadBeep'
import type { TaskStateModel } from '../../models/TaskStateModel'

type TaskContextProviderProps = {
  children: React.ReactNode
}

export function TaskContextProvider({
  children,
}: TaskContextProviderProps) {
  const [state, baseDispatch] = useReducer(
    taskReducer,
    initialTaskState,
    () => {
      const storageState = localStorage.getItem('state')

      if (!storageState) {
        return initialTaskState
      }

      try {
        const parsedStorageState =
          JSON.parse(storageState) as TaskStateModel

        return {
          ...parsedStorageState,
          activeTask: null,
          secondsRemaining: 0,
          formattedSecondsRemaining: '00:00',
        }
      } catch {
        return initialTaskState
      }
    },
  )

  // Wrap dispatch to sync with backend API
  const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3333'

  const dispatch: typeof baseDispatch = (action) => {
    try {
      switch (action.type) {
        case TaskActionTypes.START_TASK: {
          // create task in backend
          const task = action.payload
          fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: task.id,
              name: task.name,
              duration: task.duration,
              type: task.type,
              startDate: String(task.startDate),
              completeDate: task.completeDate,
              interruptDate: task.interruptDate,
            }),
          }).catch(err => console.warn('Failed to create task on server', err))

          break
        }

        case TaskActionTypes.INTERRUPT_TASK: {
          if (state.activeTask) {
            const id = state.activeTask.id
            const interruptDate = Date.now()
            fetch(`${API_URL}/tasks/${id}/interrupt`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ interruptDate }),
            }).catch(err => console.warn('Failed to set interruptDate on server', err))
          }

          break
        }

        case TaskActionTypes.COMPLETE_TASK: {
          if (state.activeTask) {
            const id = state.activeTask.id
            const completeDate = Date.now()
            fetch(`${API_URL}/tasks/${id}/complete`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ completeDate }),
            }).catch(err => console.warn('Failed to set completeDate on server', err))
          }

          break
        }

        case TaskActionTypes.CHANGE_SETTINGS: {
          const cfg = action.payload
          fetch(`${API_URL}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cfg),
          }).catch(err => console.warn('Failed to update settings on server', err))

          break
        }

        default:
          break
      }
    } catch (err) {
      console.warn('Error syncing with API', err)
    }

    baseDispatch(action as any)
  }

  const playBeepRef = useRef<
    ReturnType<typeof loadBeep> | null
  >(null)

  // Load settings from backend on mount
  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.workTime === 'number') {
          baseDispatch({
            type: TaskActionTypes.CHANGE_SETTINGS,
            payload: {
              workTime: data.workTime,
              shortBreakTime: data.shortBreakTime,
              longBreakTime: data.longBreakTime,
            },
          })
        }
      })
      .catch(err => console.warn('Failed to load settings from server', err))
  }, [])

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state))
  }, [state])

  useEffect(() => {
    document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`
  }, [state.formattedSecondsRemaining])

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