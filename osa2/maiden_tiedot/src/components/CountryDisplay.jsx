import Country from "./Country"

const CountryDisplay = ({ filterTxt, countries }) => {
    const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(filterTxt.toLowerCase())
    )
    
    if (filteredCountries.length < 1) {
        return null
    }
    else if (filteredCountries.length === 1) {
        return (
            <Country country={filteredCountries[0]} />
        )
    }
    else if (filteredCountries.length <= 10) {
        return (
            <div>
                <ul>
                    {filteredCountries.map(country =>
                        <li key={country.ccn3}>
                            {country.name.common}
                        </li>
                    )}
                </ul>
            </div>
        )
    }
    else {
        return (
            <p>Too many matches, specify another filter</p>
        )
    }
}

export default CountryDisplay