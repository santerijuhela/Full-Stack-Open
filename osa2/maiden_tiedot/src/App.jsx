import { useState, useEffect } from 'react'
import countryService from './services/countries'
import CountryFilter from './components/CountryFilter'
import CountryDisplay from './components/CountryDisplay'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterTxt, setFilterTxt] = useState('')

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilterTxt(event.target.value)
  }

  return (
    <div>
      <CountryFilter
        text={filterTxt}
        changeHandler={handleFilterChange}
      />
      <CountryDisplay
        filterTxt={filterTxt}
        countries={countries}
      />
    </div>
  )
}

export default App
