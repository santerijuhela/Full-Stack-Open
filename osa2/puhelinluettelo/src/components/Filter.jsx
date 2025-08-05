const Filter = ({ filterStr, changeHandler }) => (
    <div>
        filter shown with <input value={filterStr} onChange={changeHandler} />
    </div>
)

export default Filter