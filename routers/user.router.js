import { Router } from 'express'
import { registerController } from '../controllers/register.controller.js'
import { loginController } from '../controllers/login.controller.js'
import { logoutController } from '../controllers/logout.controller.js'
import { updateUserController } from '../controllers/update.controller.js'
import { getUserController } from '../controllers/getUser.controller.js'
import { deleteUser } from '../controllers/delete.controller.js'

const userRoute = Router()

userRoute.post('/register', registerController)
userRoute.post('/login', loginController)
userRoute.post('/logout', logoutController)
userRoute.post('/update', updateUserController)
userRoute.get('/getUser', getUserController)
userRoute.delete('/deleteUser', deleteUser)

export default userRoute;