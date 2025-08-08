const CountryFilter = ({ text, changeHandler }) => (
    <div>
        find countries{' '}
        <input value={text} onChange={changeHandler} />
    </div>
)

export default CountryFilter