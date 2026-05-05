import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { EventController } from '../controllers/EventController.js'

const router = Router()
const controller = new EventController()

const eventAdminAuth = [authenticate, authorize('event_admin', 'app_admin')]
const appAdminAuth = [authenticate, authorize('app_admin')]

router.get('/admin/my-events', eventAdminAuth, asyncHandler(controller.listMyEvents))
router.get('/admin/all', appAdminAuth, asyncHandler(controller.listAllAdmin))

router.route('/')
  .get(asyncHandler(controller.listPublic))
  .post(eventAdminAuth, asyncHandler(controller.create))

router.get('/:idOrSlug', asyncHandler(controller.getByIdOrSlug))

router.route('/:id')
  .put(eventAdminAuth, asyncHandler(controller.update))
  .delete(eventAdminAuth, asyncHandler(controller.remove))

router.route('/:id/discount')
  .post(eventAdminAuth, asyncHandler(controller.addDiscount))
  .delete(eventAdminAuth, asyncHandler(controller.removeDiscount))

export default router