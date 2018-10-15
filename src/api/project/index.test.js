import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Project } from '.'
import Task from '../task/model'
import { dateMmDd } from '../../services/dateDdMm'

const app = () => express(apiRoot, routes)

let project

beforeEach(async () => {
  project = await Project.create({'title': 'test'})
})

test('POST /projects 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ title: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
})

test('POST /projects 400 - required title', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
  expect(body.param).toEqual('title')
  expect(body.valid).toEqual(false)
})

test('GET /projects 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /projects/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${project.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(project.id)
})

test('GET /projects/:id/summary 200', async () => {
  const td = new Date()
  const today = new Date(td.getFullYear(), td.getMonth(), td.getDate())
  const dueTimeToday = dateMmDd(today)
  const tomorrow = new Date(td.getFullYear(), td.getMonth(), td.getDate() + 1)
  const dueTimeTomorrow = dateMmDd(tomorrow)
  const yesterday = new Date(td.getFullYear(), td.getMonth(), td.getDate() - 1)
  const dueTimeYesterday = dateMmDd(yesterday)

  const newProject = await Project.create({'title': 'test'})
  await Task.create({project: newProject.id, description: 'test', username: '@test', dueTimeDate: today, checked: true, dueTime: dueTimeToday})
  await Task.create({project: newProject.id, description: 'test', username: '@test', dueTimeDate: tomorrow, dueTime: dueTimeTomorrow})
  await Task.create({project: newProject.id, description: 'test', username: '@test', dueTimeDate: yesterday, dueTime: dueTimeYesterday})

  const { status, body } = await request(app())
    .get(`${apiRoot}/${newProject.id}/summary`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.completed).toEqual(1)
  expect(body.total).toEqual(3)
  expect(body.late).toEqual(1)
})

test('GET /projects/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /projects/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${project.id}`)
    .send({ title: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(project.id)
  expect(body.title).toEqual('test')
})

test('PUT /projects/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ title: 'test' })
  expect(status).toBe(404)
})

test('DELETE /projects/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${project.id}`)
  expect(status).toBe(204)
})

test('DELETE /projects/:id with tasks 204', async () => {
  const newProject = await Project.create({'title': 'test'})
  await Task.create({project: newProject.id, description: 'test', username: '@test', dueTime: '01/01'})
  const { status } = await request(app())
    .delete(`${apiRoot}/${newProject.id}`)
  expect(status).toBe(204)
  const tasks = await Task.find({ project: newProject.id }).exec()
  expect(tasks.length).toBe(0)
  const projects = await Project.find({ id: newProject.id }).exec()
  expect(projects.length).toBe(0)
})

test('DELETE /projects/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
