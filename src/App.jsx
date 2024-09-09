import axios from "axios";
import React, { useRef, useState, useEffect } from "react";

function App() {
  const [question, setQuestion] = useState([]);
  const [questionState, setQuestionState] = useState(0);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkedInput = useRef([]);

  useEffect(() => {
    axios("https://the-trivia-api.com/v2/questions")
      .then((res) => {
        const shuffleedQuestions = shuffleArray(res.data);
        setQuestion(shuffleedQuestions);
        setLoading(false);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //shuffle array

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  function startQuiz() {
    setStarted(true);
  }

  function nextQuestion() {
    const checkedButton = checkedInput.current.find((input) => input.checked);
    if (!checkedButton) {
      alert("Please select an answer");
      return;
    }

    const selectedValue = checkedButton.value;
    console.log("Selected answer:", selectedValue);
    if (selectedValue === question[questionState].correctAnswer) {
      setScore(score + 1);
    }

    if (questionState < question.length - 1) {
      setQuestionState(questionState + 1);
    } else {
      setShowResult(true);
    }
  }

  function playAgain() {
    setStarted(false);
    setShowResult(false);
    setQuestionState(0);
    setScore(0);
  }

  return (
    <>
      <h1>General knowledge Quiz </h1>
      {started === true ? (
        loading ? (
          <h1>Loading...</h1>
        ) : (
          (showResult && (
            <div>
              <h1>Quiz Result</h1>
              <p>
                Your score is {score} out of {question.length}
              </p>
              <button onClick={playAgain}> Play Again</button>
            </div>
          )) || (
            <div>
              <h1>
                Q{questionState + 1}: {question[questionState].question.text}
              </h1>
              <ul>
                {shuffleArray([
                  ...question[questionState].incorrectAnswers,
                  question[questionState].correctAnswer,
                ]).map((item, index) => {
                  return (
                    <li key={index}>
                      <input
                        type="radio"
                        name="choice"
                        id={item}
                        value={item}
                        ref={(el) => (checkedInput.current[index] = el)}
                      />
                      <label htmlFor={item}>{item}</label>
                    </li>
                  );
                })}
              </ul>
              <button onClick={nextQuestion}>Next</button>
            </div>
          )
        )
      ) : (
        <button onClick={startQuiz}>Start Quiz</button>
      )}
    </>
  );
}
export default App;
