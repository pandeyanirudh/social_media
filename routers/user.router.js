import { Router } from 'express'
import { registerController } from '../controllers/register.controller.js'
import { loginController } from '../controllers/login.controller.js'
import { logoutController } from '../controllers/logout.controller.js'
import { updateUserController } from '../controllers/update.controller.js'
import { getUserController } from '../controllers/getUser.controller.js'
import { deleteUser } from '../controllers/delete.controller.js'
import { followUser } from '../controllers/followUser.controller.js'
import { unfollowUser } from '../controllers/unfollow.controller.js'
import { checkFollowOrUnfollowStatus } from '../controllers/statusOfFollowOrUnfollow.controller.js'
import { createPost } from '../controllers/createPost.controller.js'
import { editPost } from '../controllers/editPost.controller.js'
import { deletePost } from '../controllers/deletePost.controller.js'
import { likeAndUnlikePost } from '../controllers/likeAndUnlikePost.controller.js'

const userRoute = Router()

userRoute.post('/register', registerController)
userRoute.post('/login', loginController)
userRoute.post('/logout', logoutController)
userRoute.post('/update', updateUserController)
userRoute.get('/getUser', getUserController)
userRoute.delete('/deleteUser', deleteUser)
userRoute.post('/followUser', followUser)
userRoute.post('/unfollowUser', unfollowUser)
userRoute.get('/checkFollowOrUnfollow', checkFollowOrUnfollowStatus)
userRoute.post('/createPost', createPost)
userRoute.put('/editPost', editPost)
userRoute.delete('/deletePost', deletePost)
userRoute.put('/likeUnlike', likeAndUnlikePost)

export default userRoute;