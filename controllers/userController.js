import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

//4. Fetch User Polls and Serve Questions
export const fetchPoll = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    //This first check, question is already submitted by user, if submitted then skip that question
    const unansweredQues = await prisma.question.findMany({
      where: {
        NOT: {
          vote: {
            some: {
              userId: userId,
            },
          },
        },
      },
      
    });

    const sortedUnansweredQues = unansweredQues.sort(
      (a, b) => a.pollId - b.pollId
    );
    if (sortedUnansweredQues.length > 0) {
      return res.json(sortedUnansweredQues);
    }
    return res.json({ message: "no new polls exist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Task 5. Submit poll by user
export const submitPoll = asyncHandler(async (req, res) => {
  const { questionId, pollId, selectedOption } = req.body;
  const userId = parseInt(req.params.userId);

  try {
    // Check if the user exists or not. if does not exist then create a user
    const User = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!User) {
      const createUser = await prisma.user.create({
        data: {
          id: userId,
          email: "mohdaqib921@gmail.com", // right now ,I am taking this hardcore
          reward: 0,
        },
      });
    }

    // Check if the question exists and retrieve options
    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      
    });
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    
    

    //update the vote table that is related to user
    const updateVote = await prisma.vote.create({
      data: {
        selectedOption,
        question: {
          connect: {
            id: questionId,
          },
        },
        poll: {
          connect: {
            id: pollId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        }
        
      },
    });
    // Calculate reward amount
    //1.find reward range for poll
    const rewardRange = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      select: {
        minReward: true,
        maxReward: true,
      },
    });

    if (rewardRange) {
      const { maxReward, minReward } = rewardRange;
      const rewardAmount =
        Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          reward: {
            increment: rewardAmount,
          },
        },
      });
    }

    res.json(updateVote);
  } catch (error) {
    res.json(error.message);
  }
});



