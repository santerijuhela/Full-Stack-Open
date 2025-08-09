import { useState, useEffect } from 'react'
import countryService from './services/countries'
import CountryFilter from './components/CountryFilter'
import CountryDisplay from './components/CountryDisplay'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterTxt, setFilterTxt] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilterTxt(event.target.value)
    setSelectedCountry(null)
  }

  const handleShowButton = country => {
    setSelectedCountry(country)
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
        handleShowButton={handleShowButton}
        selectedCountry={selectedCountry}
      />
    </div>
  )
}

export default App
