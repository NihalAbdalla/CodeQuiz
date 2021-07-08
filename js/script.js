var questionTimer = document.querySelector("#questionTimer");
var TotalTimer = document.querySelector("#totalTimer");
var questionDiv = document.querySelector("#questions");
var timerTable = document.querySelector("#timers");

var score = 0;
var quiz = {};

var questionMaxTime = 10;
var questionTimeUsed = 0;
var questionInterval;

var totalQuizDuration = 0;
var totalTimeElapsed = 0;
var gameInterval;
var quizSeconds = 0;
var questionSeconds = 0;

init();


function init() {
    clearHTML();
    reset();
    let quizHeading = document.createElement("p");
    quizHeading.setAttribute("id", "main-quiz-heading");
    quizHeading.textContent = "Are you ready for Code Pop Quiz";

    let instructions = document.createElement("p");
    instructions.setAttribute("id", "quiz-instructions");
    instructions.textContent = "10 seconds to answer each question. If you answer correctly you will score points. If you score incorrect, you will be penalized time but not lose points.";

    let startQuiz = document.createElement("button");
    startQuiz.setAttribute("id", "startQuiz");
    startQuiz.textContent = "Start Quiz";

    questionDiv.appendChild(quizHeading);
    questionDiv.appendChild(instructions);
    questionDiv.appendChild(startQuiz);

    startQuiz.addEventListener("click", function () {
        startQuestions(quizQuestions);
    });

}

function clearHTML() {
    questionDiv.innerHTML = "";
}

function reset() {
    score = 0;

    questionMaxTime = 10;
    questionTimeUsed = 0;
    questionInterval;

    totalQuizDuration = 0;
    totalTimeElapsed = 0;
    gameInterval;
}

function startQuestions(questionSet) {
    quiz = listQuestions(questionSet);
    timerTable.setAttribute("style", "visibility: visible;");
    totalQuizDuration = quiz.length * 10;

    kickoffTimer();
    calculateTime();

    displayQuestion();
}

function listQuestions(arr) {
    let ques = [];

    for (let i = 0; i < arr.length; i++) {
        ques.push(arr[i]);
    }
    return ques;
}

function kickoffTimer() {
    setGameTime();

    gameInterval = setInterval(function () {
        questionTimeUsed++;
        totalTimeElapsed++;
        calculateTime();
    }, 1000);
}

function stopTime() {
    quizSeconds = 0;
    questionSeconds = 0;
    clearInterval(gameInterval);
}


function calculateTime() {
    TotalTimer.textContent = totalQuizDuration - questionTimeUsed;
    questionTimer.textContent = questionMaxTime - questionTimeUsed;

    if ((questionMaxTime - questionTimeUsed) < 1) {
        totalQuizDuration -= 10;
        displayQuestion();
    }

    if ((totalQuizDuration - questionTimeUsed) < 1) {
        closeQuiz();
    }
}

function setGameTime() {
    clearInterval(gameInterval);
    quizSeconds = totalQuizDuration;
}

function displayQuestion() {
    questionTimeUsed = 0;

    if (quiz.length === 0) {
        closeQuiz();
        return;
    }

    currentQuestion = quiz.pop();

    clearHTML();

    let question = document.createElement("h2");
    question.setAttribute("question", currentQuestion.title);
    question.textContent = currentQuestion.title;
    questionDiv.appendChild(question)

    let choiceBox = document.createElement("ul");
    choiceBox.setAttribute("id", "choiceBox");
    questionDiv.appendChild(choiceBox);

    for (let i = 0; i < currentQuestion.choices.length; i++) {
        let listChoice = document.createElement("li");
        listChoice.setAttribute("choice-value", currentQuestion.choices[i]);
        listChoice.setAttribute("id", "questionNum-" + i);
        listChoice.textContent = currentQuestion.choices[i];
        choiceBox.appendChild(listChoice)
    }

    choiceBox.addEventListener("click", function () {
        gradeAnswer(currentQuestion);
    });
}

function closeQuiz() {
    console.log('done')
    stopTime();
    clearHTML();

    timerTable.setAttribute("style", "visibility: hidden;");

    let heading = document.createElement("p");
    heading.setAttribute("id", "main-heading");
    heading.textContent = "Quiz Over";

    let instructions = document.createElement("p");
    instructions.setAttribute("id", "instructions");
    instructions.textContent = " Your final score is " + score;

    let startQuizAgain = document.createElement("button");
    startQuizAgain.setAttribute("id", "startQuizAgain");
    startQuizAgain.setAttribute("class", "btn btn-secondary");
    startQuizAgain.textContent = "Start Quiz again";

    let para = document.createElement("p");

    let playerInitials = document.createElement("label");
    playerInitials.setAttribute("for", "playerInitials");
    playerInitials.textContent = "Enter your initials: ";

    let initialTextBox = document.createElement("input");
    initialTextBox.setAttribute("id", "playerInitials");
    initialTextBox.setAttribute("name", "playerInitials");
    initialTextBox.setAttribute("maxlength", "4");
    initialTextBox.setAttribute("size", "4");


    questionDiv.appendChild(heading);
    questionDiv.appendChild(instructions);
    questionDiv.appendChild(playerInitials);
    questionDiv.appendChild(initialTextBox);
    questionDiv.appendChild(para);
    questionDiv.appendChild(startQuizAgain);

    startQuizAgain.addEventListener("click", init);

    initialTextBox.addEventListener("input", function () {
        initialTextBox.value = initialTextBox.value.toString();
        if (initialTextBox.value.length === 4) {
            stopTime();
            clearHTML();
            timerTable.setAttribute("style", "visibility: hidden;");

            let heading = document.createElement("h2");
            heading.setAttribute("id", "main-heading");
            heading.textContent = "Thanks " + initialTextBox.value.toUpperCase() + " for playing the quiz ";


            let startQuizAgain = document.createElement("button");
            startQuizAgain.setAttribute("id", "startQuizAgain");
            startQuizAgain.setAttribute("class", "btn btn-secondary");
            startQuizAgain.textContent = "Play Again!";

            questionDiv.appendChild(heading);
            questionDiv.appendChild(startQuizAgain);

            startQuizAgain.addEventListener("click", init);
        }
    });
}

function gradeAnswer(cur) {
    let e = event.target;
    if (e.matches("li")) {
        let selectedItem = e.textContent;
        if (selectedItem === cur.answer) {
            score += questionMaxTime - questionTimeUsed;
        } else {
            totalQuizDuration -= 10;
        }
        displayCorrectAnswer(cur);
    }
}

function displayCorrectAnswer(cur) {

    for (let i = 0; i < cur.choices.length; i++) {

        let questid = "#questionNum-" + i;
        let questrow = document.querySelector(questid);
        if (cur.choices[i] !== cur.answer) {
            questrow.setAttribute("style", "background-color: lightblue");
        } else {
            questrow.setAttribute("style", "background-color: lightgreen");
        }
    }
    setTimeout(displayQuestion, 500);
}