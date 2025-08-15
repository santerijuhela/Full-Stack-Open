import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterStr, setFilterStr] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterStr(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
        name: newName,
        number: newNumber
      }
    
    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        personService
        .update(existingPerson.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
          setNotification(`Number of ${returnedPerson.name} was updated`)
          setTimeout(() => {
            setNotification(null)
          }, 5000);
        })
        .catch(e => {
          setErrorMsg(`Information of ${existingPerson.name} has already been removed from server`)
          setTimeout(() => {
            setErrorMsg(null)
          }, 5000);
          setPersons(persons.filter(person => person.id !== existingPerson.id))
        })
      }
    }
    else if (persons.find(person => person.number === newNumber)) {
      window.alert(`${newNumber} is already added to phonebook`)
    }
    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotification(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000);
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const deletePerson = id => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService.remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setNotification(`Deleted ${personToDelete.name}`)
        setTimeout(() => {
          setNotification(null)
        }, 5000);
      })
      .catch(e => {
        setErrorMsg(`Information of ${personToDelete.name} has already been removed from server`)
        setTimeout(() => {
          setErrorMsg(null)
        }, 5000);
        setPersons(persons.filter(person => person.id !== personToDelete.id))
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notif={notification} errorMsg={errorMsg} />
      <Filter filterStr={filterStr} changeHandler={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        addFunction={addPerson}
        name={newName}
        nameChangeHandler={handleNameChange}
        number={newNumber}
        numberChangeHandler={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        filterStr={filterStr}
        deleteHandler={deletePerson}
      />
    </div>
  )

}

export default App