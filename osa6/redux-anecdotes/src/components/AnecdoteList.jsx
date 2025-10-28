import { useSelector, useDispatch } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
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

const selectAnecdotes = state => state.anecdotes
const selectFilter = state => state.filter

const selectFilteredAnecdotes = createSelector(
  [selectAnecdotes, selectFilter],
  (anecdotes, filter) => {
    return anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  }
)

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(selectFilteredAnecdotes)

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