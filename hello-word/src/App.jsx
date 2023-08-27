import { useState,useCallback,useEffect  } from 'react'
import './App.css'
import StartScreen from './components/StartScreen'
import {wordsList} from './data/words'
import Game from './components/Game'
import GameOver from './components/GameOver'


const stages =[ 
  {id:1,name:"start"},
  {id:2,name:"game"},
  {id:3,name:"end"}
]

const guessesQty= 3

function App() {
  const [ gameStage,setGameStage] = useState(stages[0].name);
  const [words]= useState(wordsList)
 
  const [pickedWord,setPickedWord] = useState("")
  const [pickedCategory,setPickedCartegory] = useState("")
  const [letters,setLetters]= useState([])

  const [guessedLetters,setGuessedLetters]=useState([])
  const [wrongLetter,setWrongLetter]=useState([])
  const [guesses,setGuesses]=useState(guessesQty)
  const [score,setScore]=useState(0)

  const pickWordAndCategory=useCallback (()=> {
    const categories = Object.keys(words);
    const category=
    categories[Math.floor(Math.random() * Object.keys(categories).length)];
    
    const word=
    words[category][Math.floor(Math.random()* words[category].length)]
    
    return{word,category}
  },[ words]);

  const startGame= useCallback(()=> {

    clearLettterStates()

    const {word,category}=pickWordAndCategory();
    
    let wordLetters=word.split("");
        
    wordLetters= wordLetters.map((l)=> l.toLowerCase());

    setPickedWord(word)
    setPickedCartegory(category)
    setLetters(wordLetters)
   
    
    setGameStage(stages[1].name);
  },[pickWordAndCategory]);


  const verifyLetter=(letter) => {

    const normalizedLetter=letter.toLowerCase();

    if (guessedLetters.includes(normalizedLetter)
     || wrongLetter.includes(normalizedLetter)) {
      return;
    }
    if (letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters)=> [
        ...actualGuessedLetters,normalizedLetter
      ])
    } else {
      setWrongLetter((actualWrongLetters)=> [
        ...actualWrongLetters,
        normalizedLetter
      ]);
      setGuesses((actualGuessed)=> actualGuessed - 1)
    }
    
  }

  const clearLettterStates= () => {
    setGuessedLetters([]);
    setWrongLetter ([])
  }

  useEffect(()=>{
    if (guesses <= 0){
      clearLettterStates();
      setGameStage(stages[2].name)
    }
  },[guesses]);

  useEffect(()=>{
    const uniqueLetters= [...new Set(letters)];

    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name){
      setScore((actualScore)=> (actualScore += 100));

      startGame();
    }
  },[guessedLetters, letters,startGame, gameStage]);

  const retry=()=>{
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name)
  }

  return (
    <div className='App'>
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && <Game 
      verifyLetter={verifyLetter}
      pickedWord={pickedWord}
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetter={wrongLetter}
      guesses={guesses}
      score={score}
      />}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}

    </div>
  )
}

export default App
