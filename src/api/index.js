import { Router } from 'express'
import project from './project'
import task from './task'

const router = new Router()

router.use('/projects', project)
router.use('/tasks', task)

export default router
