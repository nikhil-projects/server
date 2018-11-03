import express from 'express';

const router = express.Router();

import { UserCtrl } from '../controllers';

router.get('/', UserCtrl.findAll);
router.get('/contacts', UserCtrl.getContacts);
router.get('/:username', UserCtrl.findOneByUsername);

router.put('/', UserCtrl.updateUserInfo);

router.post('/contacts', UserCtrl.addContacts);
router.post('/fakeContacts', UserCtrl.fakeContacts);

export default router;
