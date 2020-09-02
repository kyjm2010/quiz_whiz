const question = document.getElementById("question")
const choices = Array.from(document.getElementsByClassName("choice-text"))
const progressText = document.getElementById('progressText')
const scoreText = document.getElementById('score')
const progressBarFull = document.getElementById('progressBarFull')
const loader = document.getElementById("loader")
const game = document.getElementById("game")
const start = document.getElementById("start")
const play = document.getElementById("play")
const mute = document.getElementById("mute")
let currentQuestion = {}
let acceptingAnswers = false
let score = 0
let questionCounter = 0
let availableQuestions = []
let questions = []
let category = document.getElementById("category")
let selectedCategory = localStorage.getItem("category")
let difficulty = document.getElementById("difficulty")
let selectedDifficulty = localStorage.getItem("difficulty")
let questionCount = document.getElementById("count")
let selectedCount = localStorage.getItem("count")
let audio = new Audio('sounds/game-theme.mp3')
let correctAudio = new Audio('sounds/correct.wav')
let wrongAudio = new Audio('sounds/wrong.wav')


function changeDifficulty() {
    localStorage.setItem("difficulty", difficulty.value)
    selectedDifficulty = localStorage.getItem("difficulty")
    console.log(selectedDifficulty)
    checkDependencies()
    loadAPI()
}

function changeCategory() {
    localStorage.setItem("category", category.value)
    selectedDifficulty = localStorage.getItem("category")
    console.log(selectedCategory)
    checkDependencies()
    loadAPI()
}

loadAPI()

function loadAPI() {
    fetch(`https://opentdb.com/api.php?amount=50&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`)

        .then(res => {
            return res.json()
        })
        .then(loadedQuestions => {
            console.log(loadedQuestions.results)
            questions = loadedQuestions.results.map(loadedQuestion => {
                const formattedQuestion = {
                    question: loadedQuestion.question
                }

                const answerChoices = [...loadedQuestion.incorrect_answers]
                formattedQuestion.answer = Math.floor(Math.random() * 3) + 1
                answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer)
                answerChoices.forEach((choice, index) => {
                    formattedQuestion["choice" + (index + 1)] = choice
                })
                return formattedQuestion
            })

            startGame()


        })

}

function startAudio() {
    audio.play()
}
let isPlaying = false

function togglePlay() {
    isPlaying ? audio.pause() : audio.play()
}

audio.onplaying = function () {
    isPlaying = true;
    play.style.display = "block"
    mute.style.display = "none"
}

audio.onpause = function () {
    isPlaying = false;
    play.style.display = "none"
    mute.style.display = "block"
}

function checkDependencies() {
    if (difficulty.value && category.value && questionCount.value != "") {
        start.classList.add("glow")
    } else {
        start.classList.remove("glow")
    }
}

function changeCount() {
    localStorage.setItem("count", questionCount.value)
    selectedCount = localStorage.getItem("count")
    checkDependencies()
}
const CORRECT_ANSWER = 10
const MAX_QUESTIONS = selectedCount

startGame = () => {

    questionCounter = 0
    score = 0
    availableQuestions = [...questions]
    game.classList.remove('hidden')
    loader.classList.add('hidden')
    getNewQuestion()
    startAudio()
}



getNewQuestion = () => {
    if (availableQuestions.length == 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score)
        return window.location.assign("end.html")
    }
    questionCounter++
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`
    const questionIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionIndex]
    question.innerHTML = currentQuestion.question

    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerHTML = currentQuestion['choice' + number]
    })

    availableQuestions.splice(questionIndex, 1)

    acceptingAnswers = true;
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return
        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']
        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        if (classToApply == 'correct') {
            correctAudio.play()
            incrementScore(CORRECT_ANSWER)
        } else {
            wrongAudio.play()
        }
        selectedChoice.parentElement.classList.add(classToApply)
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()
        }, 1500)
    })
})

incrementScore = num => {
    score += num
    scoreText.innerText = score
}


