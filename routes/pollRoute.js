import express from "express";
import { addQuestionSetToPoll, createPoll, fetchPollAnalytics, fetchedAllPoll, overallAnalytics, updatePerticularPoll, updateQuestionSet } from "../controllers/pollController.js";

const router= express.Router();

//FOr Task1
router.post('/createPoll',createPoll);
router.post('/addQuestionSet',addQuestionSetToPoll);

//For Task2
router.get('/fetchAllPoll',fetchedAllPoll);
router.put('/:pollId',updatePerticularPoll)
router.post('/:pollId/:quesId',updateQuestionSet);


//task 6.a fetch poll analytics for a poll
router.get('/pollAnalytics/:pollId',fetchPollAnalytics)
//Task 6.b
router.get('/pollAnalytics',overallAnalytics);

export { router as pollRoute};