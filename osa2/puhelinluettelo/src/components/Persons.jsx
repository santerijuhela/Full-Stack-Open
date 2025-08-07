import Person from "./Person"

const Persons = ({ persons, filterStr, deleteHandler }) => (
    <ul>
        {persons
            .filter(person =>
                person.name.toLowerCase().includes(filterStr.toLowerCase()))
            .map(person =>
                <Person
                    key={person.id}
                    person={person}
                    deleteHandler={deleteHandler}
                />)
        }
    </ul>
)

export default Persons