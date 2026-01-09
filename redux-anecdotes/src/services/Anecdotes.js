const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await fetch(baseUrl)

    if (!response.ok) {
        throw new Error('Failed to fetch notes')
    }

    const data = await response.json()
    return data
}

const upVote = async (anecdote) => {
    const response = await fetch(`${baseUrl}/${anecdote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...anecdote, votes: anecdote.votes + 1 })
    })

    if (!response.ok) {
        throw new Error('Failed to upvote')
    }

    return await response.json()
}

const createNew = async (content) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, votes: 0 }),
    })

    if (!response.ok) {
        throw new Error('Failed to create note')
    }

    return await response.json()
}


export { getAll, upVote, createNew }