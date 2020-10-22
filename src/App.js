import Amplify, { Predictions } from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';
import React, { useState } from 'react';
import { TextField, Button, Tooltip } from '@material-ui/core';

import AccountCircleIcon from '@material-ui/icons/AccountCircleTwoTone';
import Negative from '@material-ui/icons/SentimentDissatisfiedTwoTone';
import Positive from '@material-ui/icons/SentimentSatisfiedAltTwoTone';
import Neutral from '@material-ui/icons/FaceTwoTone';

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

function App() {
  const [interpret, getInterpret] = useState('');
  const [text,getText] = useState('');
  const [mood,getMood] = useState('none');

  function parseText(syntax) {

  }

  function parseInterpretation(interpretation) {
    if (typeof interpretation.textInterpretation !== 'object' || !interpretation.textInterpretation) return;
    const {sentiment, keyPhrases, syntax, textEntities} = interpretation.textInterpretation;
    const newMood = sentiment.predominant;
    getMood(newMood);
    console.log(newMood);
    getInterpret(JSON.stringify(syntax, null, 2));
  }

  function getInterpretation() {
    Predictions.interpret({
      text: {
        source: {
          text: text,
        },
        type: "ALL"
      }
    }).then(result => {
      parseInterpretation(result);
      console.log(result);
    })
      .catch(err => { throw err })
  }

  function setText(e) {
    getText(e.target.value);
  }

  function reset() {
    getInterpret('');
    getMood('none');
  }

  function checkForEnter(e) {
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
        <TextField
            id="result-box"
            className="text-box"
            placeholder="Result Will Show Here"
            value={interpret}
            margin="normal"
            variant="outlined"
            rows={4}
            multiline
            fullWidth
            inputProps={{readOnly:true}}
          />
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
