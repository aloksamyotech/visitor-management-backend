import { Router } from 'express'
const router = Router()

import userRouter from './user.js'
import visitorRouter from './visitor.js'
import visitsRouter from './visits.js'
import appointmentRouter from './appointment.js'
import passRouter from './pass.js'
import subscriptionRouter from './subscription.js'
import paymentRouter from './payment.js'

router.use('/user', userRouter)
router.use('/visitor', visitorRouter)
router.use('/visits', visitsRouter)
router.use('/appointment', appointmentRouter)
router.use('/pass', passRouter)
router.use('/subscription', subscriptionRouter)
router.use('/payment', paymentRouter)

export default router
