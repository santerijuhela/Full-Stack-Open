const Person = ({ person, deleteHandler }) => (
    <li>
        {person.name} {person.number}
        <button onClick={() => deleteHandler(person.id)}>delete</button>
    </li>
)

export default Person