import express from "express";
import dummmyController from "../controllers/dummyController";

const router = express.Router();


router.get('/dummy', dummmyController.dummy);


export default router;