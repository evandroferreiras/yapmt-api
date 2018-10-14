import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, update, destroy } from './controller'
import { schema } from './model'
export Task, { schema } from './model'

const router = new Router()
const { description, username, dueTime, checked, projectId } = schema.tree

router.post('/',
  body({ description, username, dueTime, checked, projectId }),
  create)

router.get('/',
  query(),
  index)

router.get('/projectId=:projectId',
  query(),
  index)

router.put('/:id',
  body({ description, username, dueTime, checked, projectId }),
  update)

router.delete('/:id',
  destroy)

export default router
