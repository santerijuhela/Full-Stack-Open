const Country = ({ country }) => (
    <div>
        <h1>{country.name.common}</h1>
        <p>
            Capital {country.capital} <br />
            Area {country.area}
        </p>
        <h2>Languages</h2>
        <ul>
            {Object
                .entries(country.languages)
                .map(([code, language]) => 
                    <li key={code}>
                        {language}
                    </li>
            )}
        </ul>
        <img
            src={country.flags.png}
            alt={country.flags.alt}
        />
    </div>
)

export default Country