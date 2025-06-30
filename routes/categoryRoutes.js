import express from 'express';
import { isAdmin, requireSignin } from '../middlewares/authMiddleware.js';
import { categoryController, updateCategoryController } from '../controllers/categoryController.js';

const router = express.Router();

router.post('/create-category', requireSignin, isAdmin, categoryController);
router.put('/update-category/:id', requireSignin, isAdmin, updateCategoryController);

export default router;