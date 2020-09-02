const username = document.getElementById("username")
const saveScoreBtn = document.getElementById("saveScoreBtn")
const finalScore = document.getElementById('finalScore')
const mostRecentScore = localStorage.getItem('mostRecentScore')

finalScore.innerText = `${mostRecentScore} Points!`

const highScores = JSON.parse(localStorage.getItem('highScores')) || []
const MAX_HIGH_SCORES = 5

console.log('highScores')
username.addEventListener('keyup', () =>{
    console.log(username.value)
    saveScoreBtn.disabled = !username.value
    
    if(username.value != ""){
        saveScoreBtn.style.background = "#177c17"
        saveScoreBtn.style.borderColor = "#266436"
    } else {
        saveScoreBtn.style.background = "#852b14"
        saveScoreBtn.style.borderColor = "#681010dc"
    }
})
saveHighScore = (e) => {
    e.preventDefault()
    const score = {
        score: mostRecentScore,
        name: username.value
    }
    highScores.push(score)
    highScores.sort( (a,b) => b.score - a.score)
    highScores.splice(5)

    
    localStorage.setItem('highScores', JSON.stringify(highScores))
    saveScoreBtn.innerHTML = ""
    saveScoreBtn.innerHTML = "Score Saved!"
    saveScoreBtn.disabled = true
    console.log(highScores)
}