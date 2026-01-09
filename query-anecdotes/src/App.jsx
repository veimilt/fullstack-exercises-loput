import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, voteAnecdote } from './requests'

import { useContext } from "react"
// import NotificationContext from "./NotificationContext"
import { useSetNotification } from './NotificationContext.jsx'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'


const App = () => {
  // const { notificationDispatch } = useContext(NotificationContext)
  const setNotification = useSetNotification()

  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  const voteAnecdoteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (updated) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(a => a.id !== updated.id ? a : updated))
    }
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return <div>loading data...</div>
  }
  if (result.isError) {
    return <div>ERROR: anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate(anecdote)
    setNotification(`you voted '${anecdote.content}'`, 5)
  }

  // const anecdotes = [
  //   {
  //     content: 'If it hurts, do it more often',
  //     id: '47145',
  //     votes: 0,
  //   },
  // ]

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
