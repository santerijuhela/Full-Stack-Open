const PersonForm = ({ addFunction, name, nameChangeHandler, number, numberChangeHandler }) => (
    <form onSubmit={addFunction}>
        <div>
            name: <input value={name} onChange={nameChangeHandler} />
        </div>
        <div>
            number: <input value={number} onChange={numberChangeHandler} />
        </div>
        <div>
            <button type='submit'>add</button>
        </div>
    </form>
)

export default PersonForm