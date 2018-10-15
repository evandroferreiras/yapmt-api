import { success, notFound } from '../../services/response/'
import { Project } from '.'
import { Task } from '../task'

export const create = ({ bodymen: { body } }, res, next) =>
  Project.create(body)
    .then((project) => project.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Project.find(query, select, cursor)
    .then((projects) => projects.map((project) => project.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) => {
  return Project.findById(params.id)
    .then((project) => {
      return project
    }, () => {
      return null
    })
    .then(notFound(res))
    .then((project) => project ? project.view() : null)
    .then(success(res))
    .catch(next)
}

export const update = ({ bodymen: { body }, params }, res, next) =>
  Project.findById(params.id)
    .then(notFound(res))
    .then((project) => project ? Object.assign(project, body).save() : null)
    .then((project) => project ? project.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Project.findById(params.id)
    .then(notFound(res))
    .then((project) => project ? Project.deleteOne(project) : null)
    .then(() => Task.deleteMany({ project: params.id }))
    .then(success(res, 204))
    .catch(next)

export const summary = ({ params }, res, next) => {
  return Task.countDocuments({ project: params.id, checked: true })
    .then((el) => {
      return el
    }, () => {
      return null
    })
    .then((tasks) => {
      const obj = {
        completed: tasks
      }
      return obj
    })
    .then((obj) => {
      return Task.countDocuments({ project: params.id })
        .then((tasks) => {
          obj.total = tasks
          return obj
        })
    })
    .then((obj) => {
      const td = new Date()
      const yesterday = new Date(td.getFullYear(), td.getMonth(), td.getDate() - 1)
      return Task.countDocuments({ project: params.id, 'dueTimeDate': { '$lte': yesterday } })
        .then((tasks) => {
          obj.late = tasks
          return obj
        })
    })
    .then(
      success(res, 200)
    )
}
