import Person from "./Person"

const Persons = ({ persons, filterStr }) => (
    <ul>
        {persons
            .filter(person =>
                person.name.toLowerCase().includes(filterStr.toLowerCase()))
            .map(person =>
                <Person key={person.id} person={person} />)
        }
    </ul>
)

export default Persons