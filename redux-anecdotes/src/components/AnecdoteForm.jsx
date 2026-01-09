import { useDispatch } from "react-redux"
import { appendAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {

    const dispatch = useDispatch()

    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdoteInput.value
        event.target.anecdoteInput.value = ''
        dispatch(appendAnecdote(content))
        dispatch(setNotification(`you created '${content}'`, 5))
    }
    return (
        <>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <input type="text" name='anecdoteInput' />
                <button type='submit'>Add</button>
            </form>
        </>
    )
}

export default AnecdoteForm