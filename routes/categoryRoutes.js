import express from 'express';
import { isAdmin, requireSignin } from '../middlewares/authMiddleware.js';
import { categoryController, deleteCategoryController, getAllCategoryController, getSingleCategoryController, updateCategoryController } from '../controllers/categoryController.js';

const router = express.Router();

router.post('/create-category', requireSignin, isAdmin, categoryController);
router.put('/update-category/:id', requireSignin, isAdmin, updateCategoryController);
router.get('/all-category',getAllCategoryController);
router.get('/single-category/:slug',getSingleCategoryController)
router.delete('/delete-category/:id', requireSignin, isAdmin, deleteCategoryController )

export default router;