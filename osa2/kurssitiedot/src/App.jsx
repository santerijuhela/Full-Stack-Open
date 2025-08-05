const Course = ({ course }) => (
  <>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total exercises={course.parts.map(part => part.exercises)} />
  </>
)

const Header = ({ name }) => {
  return (
    <>
      <h1>{name}</h1>
    </>
  )
}

const Content = ({ parts }) => {
  return (
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
}

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Total = ({ exercises }) => {
  let sum = 0
  for (const i of exercises) {
    sum += i
  }
  return (
      <p>total of {sum} exercises</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App
