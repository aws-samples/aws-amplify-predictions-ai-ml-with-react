import Amplify, { Predictions } from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';
import React, { useState } from 'react';
import { TextField, Button, Tooltip } from '@material-ui/core';

import AccountCircleIcon from '@material-ui/icons/AccountCircleTwoTone';
import Negative from '@material-ui/icons/SentimentDissatisfiedTwoTone';
import Positive from '@material-ui/icons/SentimentSatisfiedAltTwoTone';
import Neutral from '@material-ui/icons/FaceTwoTone';

import PartsOfSpeech from './assets/json/parts-of-speech.json';

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

function App() {
  const [interpret, getInterpret] = useState([]);
  const [text,getText] = useState('');
  const [mood,getMood] = useState('none');

  function parseText() {

    return interpret.map((word: {text:string, syntax:keyof typeof PartsOfSpeech}, ind:number) => {
      const pos: string = PartsOfSpeech[word.syntax];
      return (<Tooltip key={ind} title={pos}>
        <span>{word.text} </span>
      </Tooltip>)
    });
  }

  function parseInterpretation(interpretation:any) {
    if (typeof interpretation !== 'object' || !interpretation) return;
    const {sentiment, language, keyPhrases, syntax, textEntities} = interpretation;
    const newMood = sentiment.predominant;
    getMood(newMood);
    getInterpret(syntax);
  }

  function getInterpretation() {
    const txt: any = {
      text: {
        source: {
          text: text,
        },
        type: 'ALL'
      }
    }

    Predictions.interpret(txt).then(result => {
      const { textInterpretation } = result;
      parseInterpretation(textInterpretation);
      console.log(textInterpretation);
    })
      .catch(err => { throw err })
  }

  function setText(e: any) {
    getText(e.target.value);
  }

  function reset() {
    getInterpret([]);
    getMood('none');
  }

  function checkForEnter(e: any) {
    if (!text.length) reset();
    if (e.key === 'Enter' && text.length) {
      getInterpretation();
    }
  }

  function displayMood() {
    let res;
    switch(mood.toUpperCase()) {
      case 'POSITIVE': res = <Positive fontSize="large"/>;
      break;
      case 'NEGATIVE': res = <Negative fontSize="large"/>;
      break;
      case 'MIXED':
      case 'NEUTRAL': res = <Neutral fontSize="large"/>;
      break;
      default: res =  <AccountCircleIcon fontSize="large"/>;
      break;
    }
    return res;
  }

  return (
    <div className="App">
      <div className="sentiment">
        {displayMood()}
      </div>
      <div className="input-container">        
        <TextField
            id="text-box"
            className="text-box"
            placeholder="Input Text Here"
            margin="normal"
            variant="outlined"
            value={text}
            onChange={setText}
            onKeyUp={checkForEnter}
            rows={4}
            multiline
            fullWidth
            autoFocus
          />
        <div className="result-container">    
          <div className="words">{parseText()}</div>    
          <TextField
              id="result-box"
              className="text-box"
              placeholder="Result Will Show Here"
              value={interpret.length ? ' ' : ''}
              margin="normal"
              variant="outlined"
              rows={4}
              multiline
              fullWidth
              inputProps={{readOnly:true}}
            />
        </div>
      </div>
      <Button 
        className="submit"
        variant="contained" 
        color="primary"
        onClick={getInterpretation}>
        Interpret
      </Button>
    </div>
  );
}

export default App;
