const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');

let correctAnswer = "";
let correctScore = 0;
let askedCount = 0;
const totalQuestion = 10;

async function loadQuestion() {
    const APIUrl = 'https://opentdb.com/api.php?amount=1&lang=es';
    const result = await fetch(APIUrl);
    const { results: [{ question, category, correct_answer, incorrect_answers }] } = await result.json();
    _result.innerHTML = "";
    showQuestion(question, category, correct_answer, incorrect_answers);
}

function eventListeners() {
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    setCount();
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showQuestion(question, category, correct_answer, incorrect_answers) {
    _checkBtn.disabled = false;
    correctAnswer = HTMLDecode(correct_answer);
    const optionsList = [...incorrect_answers.map(option => HTMLDecode(option)), correctAnswer];

    shuffleArray(optionsList);

    _question.innerHTML = `${HTMLDecode(question)} <br> <span class="category"> ${HTMLDecode(category)} </span>`;
    _options.innerHTML = optionsList.map((option, index) => `
        <li>${index + 1}. <span>${option}</span></li>
    `).join('');
    selectOption();
}


function selectOption() {
    _options.querySelectorAll('li').forEach(option => {
        option.addEventListener('click', function() {
            _options.querySelector('.selected')?.classList.remove('selected');
            option.classList.add('selected');
        });
    });
}

function checkAnswer() {
    _checkBtn.disabled = true;
    const selectedOption = _options.querySelector('.selected');

    if (!selectedOption) {
        _result.innerHTML = `<p><i class="fas fa-question"></i> Selecciona una opción</p>`;
        _checkBtn.disabled = false;
        return;
    }

    const selectedAnswer = selectedOption.querySelector('span').textContent;
    if (selectedAnswer === HTMLDecode(correctAnswer)) {
        correctScore++;
        _result.innerHTML = `<p><i class="fas fa-check"></i> Respuesta Correcta</p>`;
    } else {
        _result.innerHTML = `<p><i class="fas fa-times"></i> Respuesta Incorrecta</p> <small><b>Respuesta Correcta: </b>${correctAnswer}</small>`;
    }
    checkCount();
}

function HTMLDecode(textString) {
    const doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount() {
    askedCount++;
    setCount();

    if (askedCount === totalQuestion) {
        _result.innerHTML += `<p>Tu puntaje es ${correctScore}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(loadQuestion, 1600);
    }
}

function setCount() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function restartQuiz() {
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}
