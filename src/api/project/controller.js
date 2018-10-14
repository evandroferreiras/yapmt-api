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
