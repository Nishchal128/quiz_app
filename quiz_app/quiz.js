// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

// Initialize Express application
const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load quiz questions from JSON file
const questions = JSON.parse(fs.readFileSync('questions.json'));

// Initialize current question index
let currentQuestionIndex = 0;

// Handle GET requests to the root URL
app.get('/', (req, res, next) => {
  try {
   
    const currentQuestion = questions[currentQuestionIndex];
    const hasNext = currentQuestionIndex < questions.length - 1;
    const hasPrev = currentQuestionIndex > 0;
  
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Node.js Quiz</title>
        <style>
          /* Styles omitted for brevity */
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Node.js Quiz</h1>
          <p>${currentQuestion.question}</p>
          <form action="/submit" method="post">
            ${currentQuestion.options.map(option => `
              <input type="radio" name="answer" value="${option}">${option}<br>
            `).join('')}
            <br>
            <input type="submit" value="Submit">
          </form>
          ${hasPrev ? `<a href="/prev">Previous</a>` : ''}
          ${hasNext ? `<a href="/next">Next</a>` : ''}
          <p>Use the "Next" and "Previous" buttons to navigate through the quiz.</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
});

// Handle POST requests to the '/submit' endpoint
app.post('/submit', (req, res, next) => {
  try {

    const selectedAnswer = req.body.answer;
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (selectedAnswer === correctAnswer) {

      res.send('<h1 style="color: green;">Correct!</h1>');
    } else {
      res.send(`<h1 style="color: red;">Incorrect! Correct answer is ${correctAnswer}</h1>`);
    }
  } catch (error) {
    next(error);
  }
});

// Handle GET requests to the '/next' endpoint
app.get('/next', (req, res, next) => {
  try {
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions.length) {
      currentQuestionIndex = 0;
    }
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// Handle GET requests to the '/prev' endpoint
app.get('/prev', (req, res, next) => {
  try {

    currentQuestionIndex--;
    if (currentQuestionIndex < 0) {
      currentQuestionIndex = questions.length - 1;
    }
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('<h1 style="color: red;">Something went wrong!</h1>');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
