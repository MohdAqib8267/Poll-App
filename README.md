# Poll System
 
# Description of the project.

# API DOCUMENTATION
https://documenter.getpostman.com/view/21628908/2s9YkgEkmQ

# Database Script

### To View Database schema, Find File [PollScriptMySQL.sql] in repo


## Used Tech stack:
Node.js, Express, MySql, Postman, Prisma 

## To Run this project
> 1.Clone Repo <br/>
> 2.Run on terminal
> ### npm install on terminal
> 3.To start development run
> ### npm run start

## Database Schema

### Table: User

| Column    | Type       | Details                        |
|-----------|------------|--------------------------------|
| id        | Integer    | Primary Key, Autoincrement     |
| reward    | Integer    | Default: 0                     |
| email     | String     | Unique                         |

### Table: Poll

| Column    | Type       | Details                        |
|-----------|------------|--------------------------------|
| id        | Integer    | Primary Key, Autoincrement     |
| title     | String     |                                |
| category  | String     |                                |
| startDate | String     |                                |
| endDate   | String     |                                |
| minReward | Integer    |                                |
| maxReward | Integer    |                                |

**Relationships:**
- One-to-Many relationship with Question
- One-to-Many relationship with Vote

### Table: Question

| Column    | Type       | Details                        |
|-----------|------------|--------------------------------|
| id        | Integer    | Primary Key, Autoincrement     |
| type      | String     | ('single' or 'multiple')       |
| text      | String     |                                |
| pollId    | Integer    | Foreign Key referencing Poll   |
| options   | JSON       |                                |

**Relationships:**
- Many-to-One relationship with Poll
- One-to-Many relationship with Vote

### Table: Vote

| Column         | Type       | Details                            |
|----------------|------------|------------------------------------|
| id             | Integer    | Primary Key, Autoincrement         |
| questionId     | Integer    | Foreign Key referencing Question   |
| pollId         | Integer    | Foreign Key referencing Poll       |
| userId         | Integer    | Foreign Key referencing User       |
| selectedOption | Integer    |                                    |

**Relationships:**
- Many-to-One relationship with Question
- Many-to-One relationship with Poll
- Many-to-One relationship with User
