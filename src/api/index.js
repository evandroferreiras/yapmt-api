import { Router } from 'express'
import project from './project'

const router = new Router()

router.use('/projects', project)

export default router
