import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy, summary } from './controller'
import { schema } from './model'
export Project, { schema } from './model'

const router = new Router()
const { title } = schema.tree

router.post('/',
  body({ title }),
  create)

router.get('/',
  query(),
  index)

router.get('/:id',
  show)

router.get('/:id/summary',
  summary)

router.put('/:id',
  body({ title }),
  update)

router.delete('/:id',
  destroy)

export default router
