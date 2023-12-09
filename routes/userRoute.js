import express from "express";
import { fetchPoll, submitPoll } from "../controllers/userController.js";


const router= express.Router();

// Endpoint for fetching user polls and serving questions
router.get('/:userId',fetchPoll);
router.post('/:userId',submitPoll)




export { router as userRoute};