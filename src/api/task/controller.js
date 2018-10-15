import { success, notFound } from '../../services/response/'
import { Task } from '.'
import { Project } from '../project'

export const create = ({ bodymen: { body } }, res, next) =>
{
  const year = new Date().getFullYear()
  const date = new Date(`${year}/${body.dueTime}`)
  if (!isNaN(date.getDate())) {
    body.dueTimeDate = date
  }
  Project.findById(body.projectId)
    .then((project) => {
      return project
    }, () => {
      return null
    })
    .then(notFound(res))
    .then((project) => {
      body.project = project._id
      return Task.create(body)
    })
    .then((task) => task ? task.view(true) : null)
    .then(success(res, 201))
    .catch(next)
}

export const index = ({ params }, res, next) => {
  var filter = null
  if (params.projectId) {
    filter = { project: params.projectId }
  }
  return Task.find(filter)
    .sort('-dueTimeDate')
    .then((task) => {
      return task
    }, () => {
      return null
    })
    .then(notFound(res))
    .then((tasks) => tasks.map((task) => task.view()))
    .then(success(res))
    .catch(next)
}

export const update = ({ bodymen: { body }, params }, res, next) =>
  Task.findById(params.id)
    .then((task) => {
      return task
    }, () => {
      return null
    })
    .then(notFound(res))
    .then((task) => task ? Object.assign(task, body).save() : null)
    .then((task) => task ? task.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Task.findById(params.id)
    .then((task) => {
      return task
    }, () => {
      return null
    })
    .then(notFound(res))
    .then((task) => task ? task.remove() : null)
    .then(success(res, 204))
    .catch(next)
