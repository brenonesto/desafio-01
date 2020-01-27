const express = require('express')

const app = express()

app.listen(3000)

app.use(express.json())

const projects = []
let count = 0

app.use((req, res, next) => {
  count++
  console.log("Número de requisições: " + count)

  next()
})

function checkProjectId(req, res, next) {
  const { id } = req.params
  const project = projects.find(p => p.id === id)

  if(!project) {
    return res.status(400).json({ error: 'Project does not exist' })
  }

  return next()
}

app.get('/projects', (req, res) => {
  return res.json(projects)
})

app.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body

  const project = {
    id,
    title,
    tasks
  }

  projects.push(project)

  return res.json(projects)
})

app.post('/projects/:id/tasks', checkProjectId, (req, res) => {
  const { tasks } = req.body
  const { id } = req.params

  const project = projects.find(p => p.id === id)

  project.tasks.push(tasks)

  return res.json(projects)

})

app.put('/projects/:id', checkProjectId, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  const project = projects.find(p => p.id === id)

  project.title = title

  return res.json(projects)
})

app.delete('/projects/:id', checkProjectId, (req, res) => {
  const { id } = req.params

  const projectIndex = projects.findIndex(p => p.id === id)

  projects.splice(projectIndex, 1)

  return res.send()
})