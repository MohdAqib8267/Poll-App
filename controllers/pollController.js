
import asyncHandler from 'express-async-handler';

import {prisma} from "../config/prismaConfig.js";


//Task 1. Add poll
export const createPoll = asyncHandler(async (req, res) => {
  const { title, category, minReward, maxReward, startDate, endDate } = req.body;

  try {
      const createdPoll = await prisma.poll.create({
          data: {
              title,
              category,
              startDate,
              endDate,
              minReward,
              maxReward,
          },
      });

      res.status(200).json(createdPoll);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
//Task1.2 Add questionSet into poll
export const addQuestionSetToPoll = asyncHandler(async (req, res) => {
  const { pollId, questionSets } = req.body;

  try {
      const poll = await prisma.poll.findUnique({
          where: {
              id: pollId,
          },
      });

      if (!poll) {
          return res.status(404).json({ error: "Poll not found" });
      }

      const createdQuestionSets = await Promise.all(
          questionSets.map(async (questionSet) => {
              const { type, text, options } = questionSet;

              const createdQuestion = await prisma.question.create({
                  data: {
                      type,
                      text,
                      options,
                      poll: {
                          connect: {
                              id: pollId,
                          },
                      },
                      
                  },
              });

              return createdQuestion;
          })
      );

      res.status(200).json(createdQuestionSets);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



//Task 2: fetch All polles with required details
export const fetchedAllPoll = asyncHandler(async (req, res) => {
    try {
      const pollsWithDetails = await prisma.poll.findMany({
        select: {
          id: true, 
          title: true,
          category: true,
          startDate: true,
          endDate: true,
          questionSets: true,
          vote:true
        },
        
      });
  
      const pollsWithTotalVotes = pollsWithDetails.map((poll) => {
        let totalVotes = 0;
        let noOfQuestionSets = poll.questionSets.length;
  
        // Calculate total votes for each poll
        // poll.questionSets.forEach((questionSet) => {
        //   totalVotes += questionSet.votes || 0;
        // });
        totalVotes+=poll.vote.length;
      // const totalVotes = pollsWithDetails.vote.length;
  
        return {
          ...poll,
          totalVotes,
          noOfQuestionSets,
        };
      });
  
      res.status(200).json(pollsWithTotalVotes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  //Task3.1. Update a Perticular poll
  export const updatePerticularPoll= asyncHandler(async(req,res)=>{
    const pollId=parseInt(req.params.pollId);
    const { title, category, startDate, endDate, minReward, maxReward } = req.body;
    try {
      const update = await prisma.poll.update({
        where:{
          id:pollId,
        },
        data:{
          title, category, startDate, endDate, minReward, maxReward
        }
      })
      res.status(200).json(update);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })

  //Task3.2. Update a perticular question set of a poll
  
  export const updateQuestionSet = asyncHandler(async (req, res) => {
    const pollId = parseInt(req.params.pollId);
    const quesId = parseInt(req.params.quesId);
    const { text, options, type } = req.body;
  
    try {
      const op = await prisma.poll.findFirst({
        where: {
          id: pollId,
        },
        include: {
          questionSets: true
        },
      });
   //first check on this id poll is exist or not,if exist then find,after finding, update the perticular question based on the question id
      if (!op) {
        res.status(402).json({ message: 'poll not found' });
        return;
      }
  
      const findQue = op.questionSets.find((item) => item.id === quesId);
  
      if (!findQue) {
        res.status(403).json({ message: 'question not found' });
        return;
      }
  //if found then update question ans options
      const updatedQuestion = await prisma.question.update({
        where: {
          id: quesId,
        },
        data: {
          text,
          type,
          options
        },
        
      });
  
      res.json(updatedQuestion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  

//Task 6.1 Fetch Poll Analytics for a Particular Poll


// "How many games do you know?": {
//   "1": 0,
//   "2": 0, for this ques 2 submit 0 time
//   "3": 0
// },

export const fetchPollAnalytics = asyncHandler(async (req, res) => {
  const pollId = parseInt(req.params.pollId);
  // console.log(pollId);
  try {
    // Check if the poll exists
    const Poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        questionSets: {
         
        },
      },
    });

    if (!Poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    //calculate total votes for a perticular poll. i have vote table so easy kaam
    const totalVotes = await prisma.vote.count({
      where: {
        pollId: pollId,
      },
    });
    //  return res.json(totalVotes);

    //calculate each option count
    const resArr = {};
    await Promise.all(
      Poll.questionSets.map(async (que) => {
        const quesText = que.text;
        const questionId=que.id;
        const optionArr = {};
        await Promise.all(
          que.options.map(async (optionText, index) => {
            const optionId = index + 1;
          
            const countOption = await prisma.vote.count({
              where: {
                selectedOption: optionId,
                pollId: pollId,
                questionId:questionId
              },
            });
            optionArr[optionText] = countOption;
          })
        );
        resArr[quesText] = optionArr;
      })
    );

    const Ans = {
      totalVotes,
      resArr,
    
    };
    res.json(Ans);
  } catch (error) {
    res.json(error.message);
  }
});

//task 6.2 overall analytics
//Ans like this
// "Game": { //game is a catogry of poll
//   "How many games do you know?": {
//       "1": 0, // 1 option for this question submit 1 time
//       "2": 0,
//       "3": 0
//   },
//   "How often do you exercise?": {
//       "Cricket": 1,
//       "Football": 0,
//       "Badminton": 0,
//       "Sometimes": 0
//   },
// }
export const overallAnalytics = asyncHandler(async (req, res) => {
  try {
    // Calculate total votes
    const totalVotes = await prisma.vote.count();

    // Find all options
    const allPolls = await prisma.poll.findMany({
      include: {
        questionSets:true
      },
    });

    const resArr = {};

    for (const pl of allPolls) {
      const pollTitle = pl.category;
      const pollId = pl.id;
      const quesArr = {};

      for (const que of pl.questionSets) {
        const quesText = que.text;
        const questionId = que.id;
        const optionArr = {};

        for (const [index, op] of que.options.entries()) {
          const optionId = index + 1;
          const optionText = op;
          const countOption = await prisma.vote.count({
            where: {
              selectedOption: optionId,
              pollId: pollId,
              questionId: questionId,
            },
          });
          optionArr[optionText] = countOption;
        }

        quesArr[quesText] = optionArr;
      }

      resArr[pollTitle] = quesArr;
    }

    const allAnalytics = {
      totalVotes,
      resArr,
    };

    res.json(allAnalytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
