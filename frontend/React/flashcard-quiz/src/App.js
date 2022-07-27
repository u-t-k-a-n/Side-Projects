import React, { useState, useEffect, useRef } from 'react';
import FlashCardList from './FlashCardList';
import "./app.css";
import axios from 'axios';

function App() {
  const [flashCards, setFlashCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios.get("https://opentdb.com/api_category.php")
    .then(res => {
      setCategories(res.data.trivia_categories);
    })
  }, [])

  function decodeString(str) {
    var txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios.get("https://opentdb.com/api.php", {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value
        }
        })
      .then(res => {
        setFlashCards(res.data.results.map((questionItem, index) => {
          const answer = decodeString(questionItem.correct_answer);
          const options = [
            ...questionItem.incorrect_answers.map(a => decodeString(a)),
            answer
          ];
          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem.question),
            answer: answer,
            options: options.sort(() => Math.random() - 0.5)
          }
        })
        )
      })
  }

  return (
    <>
      <form className='header' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='category'>Category</label>
          <select id='category' ref={categoryEl}>
            {categories.map(category => {
              return <option key={category.id} value={category.id}>{category.name}</option>
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='amount'>Number of Questions</label>
          <input type='number' id='amount' min='1' max='50' defaultValue='10' ref={amountEl}/>
        </div>
        <div className='form-group'>
          <button type='submit' className='btn'>Generate</button>
        </div>
      </form>
      <div className='container'>
        <FlashCardList flashCards={flashCards} />
      </div>
    </>
  );
}

export default App;
