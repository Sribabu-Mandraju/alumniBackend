import express from 'express';
import { createAdmin, loginAdmin, getAdminDetails } from '../controllers/admin.controllers.js';
import { adminTokenCheck, isHod } from '../middlewares/admin.middleware.js';
import { getAdminDetailsByToken } from '../controllers/admin.controllers.js';


const router = express.Router();

router.post('/create', adminTokenCheck, isHod, createAdmin);
router.post('/login', loginAdmin);
router.get('/', adminTokenCheck,getAdminDetailsByToken);

export default router;
