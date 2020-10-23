import Amplify, { Predictions } from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';
import React, { useState } from 'react';
import { TextField, Button, Tooltip } from '@material-ui/core';
import Autocomplete from './components/select';
import AccountCircleIcon from '@material-ui/icons/AccountCircleTwoTone';
import Negative from '@material-ui/icons/SentimentDissatisfiedTwoTone';
import Positive from '@material-ui/icons/SentimentSatisfiedAltTwoTone';
import Neutral from '@material-ui/icons/FaceTwoTone';

import PartsOfSpeech from './assets/json/parts-of-speech.json';
import Languages from './assets/json/languages.json';

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

let initialLanguage = navigator.languages
? navigator.languages
: (navigator.language || (navigator as any).userLanguage);

if (!Array.isArray(initialLanguage)) initialLanguage = [initialLanguage];
initialLanguage = initialLanguage.find((lang: any) => Languages.languages.hasOwnProperty(lang));
if (!initialLanguage) initialLanguage = '';

function App() {
  const [words, getWords] = useState([]);
  const [text,getText] = useState('');
  const [mood,getMood] = useState('');

  const [targetInput,getTargetInput] = useState('');
  const [targetValue, getTargetValue] = useState('');

  const [sourceInput,getSourceInput] = useState('');
  const [sourceValue, getSourceValue] = useState(initialLanguage);

  function parseText() {
    return words.map((word: {text:string, syntax?:keyof typeof PartsOfSpeech}, ind:number) => {
      if (!word.syntax) {
        return (<div key={ind} className="word-container">
        <span>{word.text}</span> 
      </div>)
      } else {
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
      }
    });
  }

  function parseInterpretation(interpretation:any) {
    if (typeof interpretation !== 'object' || !interpretation) return;
    const {sentiment, language, syntax} = interpretation;
    if (!targetValue) {
      getTargetValue(language);
    }
    const newMood = sentiment.predominant;
    getMood(newMood);
    getWords(syntax);
  }

  function translate(inputText: string, cb = (_:any)=>_) {
    if (!targetValue) return;
    Predictions.convert({
      translateText: {
        source: {
          text: inputText,
          language: sourceValue
        },
        targetLanguage: targetValue
      }
    }).then(result => {
      cb(result.text);
      console.log(result.text);
    })
      .catch(err => { throw err })
  }

  function interpret(inputText: string, cb = (_:any)=>_) {
    const txt: any = {
      text: {
        source: {
          text: inputText,
        },
        type: 'ALL'
      }
    }

    Predictions.interpret(txt).then(result => {
      const { textInterpretation } = result;
      cb(textInterpretation);
      console.log(textInterpretation);
    })
      .catch(err => { throw err })
  }

  function reset() {
    getWords([]);
    getMood('none');
    getTargetValue('');
    getTargetInput('');
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
    getTargetValue(val);
  }

  function onInputChange(e: any, val: any) {
    getTargetInput(val);
  }

  function sourceChange(e: any, val: any) {
    getSourceValue(val);
  }

  function sourceInputChange(e: any, val: any) {
    getSourceInput(val);
  }


  function onSubmit() {
    if (targetValue) {
        translate(text, (res:string) => {
          const syn = Object.keys(Languages.syntax);
          if ((syn.includes(targetValue))) {
            interpret(res, parseInterpretation);
          } else {
            const word = [{
              text: res
            }]
            getWords((word as any));
          }
        });
    } else {
      interpret(text, parseInterpretation)
    }
  }

  function checkForEnter(e: any) {
    if (!text.length) reset();
    if (e.key === 'Enter' && text.length) {
      onSubmit();
    }
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
          <Autocomplete
            value={sourceValue as keyof typeof Languages}
            inputValue={sourceInput}
            onInputChange={sourceInputChange}
            onChange={sourceChange}
            type="Source"
          />
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
            value={targetValue as keyof typeof Languages.languages}
            inputValue={targetInput}
            onInputChange={onInputChange}
            onChange={onChange}
            type="Target"
          />
        </div>
      </div>
      <Button 
          className="submit"
          variant="contained" 
          color="primary"
          onClick={onSubmit}>
          Interpret
      </Button>
    </div>
  );
}

export default App;
