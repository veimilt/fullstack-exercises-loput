import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return action.payload
        case 'CLEAR':
            return ""
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, "")

    return (
        <NotificationContext.Provider value={{ notification, notificationDispatch }}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => {
    const { notification } = useContext(NotificationContext)
    return notification
}

export const useNotificationDispatch = () => {
    const { notificationDispatch } = useContext(NotificationContext)
    return notificationDispatch
}

let timeoutId = null

export const useSetNotification = () => {
    const dispatch = useNotificationDispatch()

    return (message, seconds = 5) => {
        if (timeoutId) clearTimeout(timeoutId)

        dispatch({ type: 'SET', payload: message })

        timeoutId = setTimeout(() => {
            dispatch({ type: 'CLEAR' })
        }, seconds * 1000)
    }
}

export default NotificationContext