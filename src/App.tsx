import Amplify, { Predictions } from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';
import React, { useState } from 'react';
import { TextField, Button, Tooltip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import AccountCircleIcon from '@material-ui/icons/AccountCircleTwoTone';
import Negative from '@material-ui/icons/SentimentDissatisfiedTwoTone';
import Positive from '@material-ui/icons/SentimentSatisfiedAltTwoTone';
import Neutral from '@material-ui/icons/FaceTwoTone';

import PartsOfSpeech from './assets/json/parts-of-speech.json';
import Languages from './assets/json/languages.json';

const languageValues: any[] = Object.keys(Languages);

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

function App() {
  const [words, getWords] = useState([]);
  const [text,getText] = useState('');
  const [mood,getMood] = useState('none');

  const [languageInput,getLanguageInput] = useState('');
  const [languageValue, getLanguageValue] = useState('');

  function parseText() {

    return words.map((word: {text:string, syntax:keyof typeof PartsOfSpeech}, ind:number) => {
      const pos: string = PartsOfSpeech[word.syntax];

      return (<Tooltip 
        key={ind} 
        title={pos}
        placement="top"
        interactive
        arrow
      >
        <div className="word-container">
          <span>{word.text}</span> 
        </div>
      </Tooltip>)
    });
  }

  function parseInterpretation(interpretation:any) {
    if (typeof interpretation !== 'object' || !interpretation) return;
    const {sentiment, language, syntax} = interpretation;
    if (!languageValue) {
      getLanguageValue(language);
    }
    const newMood = sentiment.predominant;
    getMood(newMood);
    getWords(syntax);
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

  function reset() {
    getWords([]);
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


  function setText(e: any) {
    getText(e.target.value);
  }

  function onChange(e: any, val: any) {

    getLanguageValue(val);
  }

  function onInputChange(e: any, val: any) {
    console.log(val);
    getLanguageInput(val);
  }

  function onAutocompleteKeyUp() {

  }

  return (
    <div className="App">
      <div className="sentiment">
        {displayMood()}
      </div>
      <div className="input-container">  
        <div className="text-container">
          <div className="text-wrapper">
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
          </div>
        <Button 
          className="submit"
          variant="contained" 
          color="primary"
          onClick={getInterpretation}>
          Interpret
        </Button>
        </div>
        <div className="result-container">    
          <div className="result-box">
            <div className="words">{parseText()}</div>    
            <TextField
                id="result-box"
                className="text-box"
                placeholder="Results Will Show Here"
                value={words.length ? ' ' : ''}
                margin="normal"
                variant="outlined"
                rows={4}
                multiline
                fullWidth
                inputProps={{readOnly:true}}
            />
          </div>
          <Autocomplete
            className="language-box"
            value={languageValue as keyof typeof Languages}
            options={languageValues}
            inputValue={languageInput}
            onInputChange={onInputChange}
            onChange={onChange}
            autoComplete
            autoHighlight
            clearOnBlur
            fullWidth
            classes={{popper:'language-popper'}}
            getOptionLabel={(option: keyof typeof Languages) => Languages[option]}
            renderInput={(params:any) => 
            <TextField
                {...params}
                className="language-text"
                onKeyUp={onAutocompleteKeyUp}
                placeholder="Select a Language"
            />
            }
        />
        </div>
      </div>
    </div>
  );
}

export default App;
