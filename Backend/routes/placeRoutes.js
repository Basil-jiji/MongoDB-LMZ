import express from 'express';
const router = express.Router();
import {
  createPlace,
  deletePlace,
  getPlaceById,
  getPlaceByUserId,
  getPlaces,
  updatePlace,
} from '../controllers/placeController.js';
import { check } from 'express-validator';

router.route('/user/:uid').get(getPlaceByUserId);

router
  .route('/')
  .get(getPlaces)
  .post(
    [
      check('title').not().isEmpty(),
      check('description').isLength({ min: 5 }),
      check('address').not().isEmpty(),
    ],
    createPlace
  );

router
  .route('/:pid')
  .get(getPlaceById)
  .patch(
    [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
    updatePlace
  )
  .delete(deletePlace);

export default router;
