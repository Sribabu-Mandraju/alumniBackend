import express from 'express';
import { createAdmin, loginAdmin, getAdminDetails } from '../controllers/admin.controllers.js';
import { adminTokenCheck, isHod } from '../middlewares/admin.middleware.js';
import { getAdminDetailsByToken } from '../controllers/admin.controllers.js';
import { requestAlumniVerification } from '../controllers/admin.controllers.js'
import { verifyAlumni } from '../controllers/admin.controllers.js'

const router = express.Router();

router.post('/create', adminTokenCheck, isHod, createAdmin);
router.post('/login', loginAdmin);
router.get('/', adminTokenCheck,getAdminDetailsByToken);

// Alumni verification routes
router.post('/alumni/request-verification', adminTokenCheck, requestAlumniVerification);
router.patch('/alumni/verify/:id', adminTokenCheck, isHod, verifyAlumni);

export default router;
