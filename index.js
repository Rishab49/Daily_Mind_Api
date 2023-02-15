const express = require("express");
const OPENAPI = require("openai");
const cors = require("cors");

// Creating express app
const app = express();

//cors options
const corsOptions = {
origin:["http://localhost:5173","https://deep-mind.vercel.app"],
methods:["GET","POST"],
optionsSuccessStatus: 200
}


// middleware to parse the incoming request and for cors
app.use(cors(corsOptions));
app.use(express.json());




// creating a new config for openai
const configuration = new OPENAPI.Configuration({
  apiKey: process.env.API_KEY,
});


// creating a new openai API
const openai = new OPENAPI.OpenAIApi(configuration);



// endpoint to parse incoming request of creating routine
app.post("/", async (req, res) => {
  let tasksString = "";
  let tasks = req.body.tasks;

  tasks.forEach((task, index) =>
    index < tasks.length - 1
      ? (tasksString += task + ",")
      : (tasksString += task)
  );

  try {
    let data = await createRoutine(tasksString);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(data.data.choices);
  } catch (e) {
    console.log(e);
  }
});


// Funtion to create routine
async function createRoutine(tasksString) {
  console.log(tasksString);
  const result = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.
Human: Prepare a routine for me, i have to study , go to market, play video game, eat and sleep
AI: Here's a sample routine that incorporates all of the activities you mentioned:
7:00 AM - Wake up, get dressed, and eat a healthy breakfast.
8:00 AM - Spend 2 hours studying for any courses or exams.
10:00 AM - Take a break and play a video game or engage in any other leisure activity for 30 minutes.
10:30 AM - Go to the market to buy necessary items.
11:30 AM - Have lunch and take a 30-minute break to recharge.
12:00 PM - Return to studying for another hour.
1:00 PM - Engage in coding or any other technical work for 2 hours.
3:00 PM - Take a break and go for a walk or exercise for 30 minutes to stretch your body and clear your mind.
3:30 PM - Spend 2 hours studying or working on any projects.
5:30 PM - Cook or order dinner.
6:30 PM - Meet with friends for a social outing or video call.
8:30 PM - Engage in a relaxing activity such as meditation or yoga for 30 minutes.
9:00 PM - Spend some leisure time, watch a movie or read a book.
11:00 PM - Get ready for bed and practice a relaxing activity such as meditation or yoga.
11:30 PM - Get a good night's sleep of 8 hours.
This routine provides a balance of studying, work, leisure activities, and self-care. Feel free to adjust the schedule to better fit your personal needs and schedule.
Human : Prepare a routine of me for a day, in which I want to ${tasksString}
AI:`,
    temperature: 0.1,
    max_tokens: 2000,
  });

  return result;
}

app.listen("3000", () => {
  console.group("running");
});

module.exports = app;
