import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Task } from '.'
import Project from '../project/model'
import { dateMmDd } from '../../services/dateDdMm'

const app = () => express(apiRoot, routes)

let task
let project
let project2

beforeEach(async () => {
  project = await Project.create({ title: 'test' })
  project2 = await Project.create({ title: 'test2' })
  task = await Task.create({project: project.id, description: 'test', username: '@test', dueTime: '01/01'})
})

test('POST /tasks 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ 'projectId': project.id, description: 'test', username: '@test', dueTime: '02/10', checked: true })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.description).toEqual('test')
  expect(body.username).toEqual('@test')
  expect(body.dueTime).toEqual('02/10')
  expect(body.checked).toEqual(true)
})

test('POST /tasks 201 dueTimeStatus today', async () => {
  const dueTime = dateMmDd(new Date())
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ 'projectId': project.id, description: 'test', username: '@test', dueTime: dueTime, checked: false })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.description).toEqual('test')
  expect(body.username).toEqual('@test')
  expect(body.dueTime).toEqual(dueTime)
  expect(body.dueTimeStatus).toEqual('today')
  expect(body.statusTask).toEqual('in-time')
  expect(body.checked).toEqual(false)
})

test('POST /tasks 201 dueTimeStatus tomorrow', async () => {
  const td = new Date()
  const tomorrow = new Date(td.getFullYear(), td.getMonth() + 1, td.getDate() + 1)
  const dueTime = dateMmDd(tomorrow)
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ 'projectId': project.id, description: 'test', username: '@test', dueTime: dueTime, checked: false })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.description).toEqual('test')
  expect(body.username).toEqual('@test')
  expect(body.dueTime).toEqual(dueTime)
  expect(body.dueTimeStatus).toEqual('tomorrow')
  expect(body.statusTask).toEqual('in-time')
  expect(body.checked).toEqual(false)
})

test('POST /tasks 201 dueTimeStatus yesterday', async () => {
  const td = new Date()
  const tomorrow = new Date(td.getFullYear(), td.getMonth(), td.getDate() - 1)
  const dueTime = dateMmDd(tomorrow)
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ 'projectId': project.id, description: 'test', username: '@test', dueTime: dueTime, checked: false })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.description).toEqual('test')
  expect(body.username).toEqual('@test')
  expect(body.dueTime).toEqual(dueTime)
  expect(body.dueTimeStatus).toEqual('yesterday')
  expect(body.statusTask).toEqual('late')
  expect(body.checked).toEqual(false)
})

test('POST /tasks 404 - Invalid project id', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ description: 'test', username: '@test', dueTime: '02/10', checked: true })
  expect(status).toBe(404)
})

test('POST /tasks 400 - Required description', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ username: '@test', dueTime: 'teste', checked: true })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
  expect(body.param).toEqual('description')
  expect(body.valid).toEqual(false)
})

test('POST /tasks 400 - Empty description', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ description: '', username: '@test', dueTime: '10/10', checked: true })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
  expect(body.param).toEqual('description')
  expect(body.valid).toEqual(false)
})

test('POST /tasks 400 - username description', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ description: 'test', dueTime: '02/10', checked: true })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
  expect(body.param).toEqual('username')
  expect(body.valid).toEqual(false)
})

test('POST /tasks 400 - Empty username', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ description: 'test', username: '', dueTime: '10/10', checked: true })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
  expect(body.param).toEqual('username')
  expect(body.valid).toEqual(false)
})

test('POST /tasks 400 - username must start with @', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ 'projectId': project.id, description: 'test', username: 'test', dueTime: '10/10', checked: true })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
  expect(body.param).toEqual('username')
  expect(body.valid).toEqual(false)
})

test('POST /tasks 400 - Required due time', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ 'projectId': project.id, description: 'test', username: '@test', checked: true })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
  expect(body.param).toEqual('dueTime')
  expect(body.valid).toEqual(false)
})

test('POST /tasks 400 - Invalid due time', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ 'projectId': project.id, description: 'test', username: '@test', dueTime: 'teste', checked: true })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
  expect(body.param).toEqual('dueTime')
  expect(body.valid).toEqual(false)
})

test('POST /tasks 400 - Invalid due time (date)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ 'projectId': project.id, description: 'test', username: '@test', dueTime: '10/99', checked: true })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
  expect(body.param).toEqual('dueTime')
  expect(body.valid).toEqual(false)
})

test('GET /tasks 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /tasks 200 from Project2', async () => {
  await request(app())
    .post(`${apiRoot}`)
    .send({ 'projectId': project2.id, description: 'test', username: '@test', dueTime: '02/10', checked: true })
  const { status, body } = await request(app())
    .get(`${apiRoot}/projectId=${project2.id}`)
  expect(status).toBe(200)
  expect(body.length).toBe(1)
  expect(Array.isArray(body)).toBe(true)
})

test('PUT /tasks/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${task.id}`)
    .send({ description: 'test', username: '@test', dueTime: '01/10', checked: false })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(task.id)
  expect(body.description).toEqual('test')
  expect(body.username).toEqual('@test')
  expect(body.dueTime).toEqual('01/10')
  expect(body.checked).toEqual(false)
})



test('PUT /tasks/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ description: 'test', username: '@test', dueTime: '01/01', checked: false })
  expect(status).toBe(404)
})

test('DELETE /tasks/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${task.id}`)
  expect(status).toBe(204)
})

test('DELETE /tasks/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
