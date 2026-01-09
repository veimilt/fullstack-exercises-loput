import { useSelector, useDispatch } from 'react-redux'
import { voteForAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

import Filter from './Filter'

const AnecdoteList = () => {

    const anecdotes = useSelector(state =>
        state.anecdotes
            .filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
            .toSorted((a, b) => b.votes - a.votes)
    )
    const dispatch = useDispatch()
    

    const vote = anecdote => {
        dispatch(voteForAnecdote(anecdote))
        dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
    }

    return (
        <>
            <Filter />
            {anecdotes.map(anecdote => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes} votes
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            ))}
        </>
    )
}

export default AnecdoteList