const Course = ({ course }) => {

    const Header = ({ name }) => (
        <h2>{name}</h2>
    )

    const Content = ({ parts }) => (
        <>
            {parts.map(part => 
                <Part
                key={part.id}
                name={part.name}
                exercises={part.exercises}
                />
            )}
        </>
    )

    const Part = ({ name, exercises }) => (
        <p>
            {name} {exercises}
        </p>
    )

    const Total = ({ parts }) => {
        const total = parts.reduce((sum, part) => sum + part.exercises, 0)
        
        return (
            <p>total of {total} exercises</p>
        )
    }

    return(
        <>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    )
}

export default Course