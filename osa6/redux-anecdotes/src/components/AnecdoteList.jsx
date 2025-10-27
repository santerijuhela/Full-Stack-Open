import { useSelector, useDispatch } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, handleClick }) => (
  <div>
    <div>{anecdote.content}</div>
    <div>
      has {anecdote.votes}
      <button onClick={handleClick}>vote</button>
    </div>
  </div>
)

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)

  return (
    anecdotes
      .sort((a, b) => b.votes - a.votes)
      .map(anecdote => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => dispatch(voteFor(anecdote.id))}
        />
      ))
  )
}

export default AnecdoteList