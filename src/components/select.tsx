import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import Languages from '../assets/json/languages.json';
const languageValues: any[] = Object.keys(Languages.languages);

export default function(props: any) {
    return (<Autocomplete
        className="language-box"
        value={props.value}
        options={languageValues}
        inputValue={props.input}
        onInputChange={props.onInputChange}
        onChange={props.onChange}
        autoComplete
        autoHighlight
        clearOnBlur
        fullWidth
        classes={{popper:'language-popper'}}
        getOptionLabel={(option: keyof typeof Languages.languages) => Languages.languages[option] || ''}
        renderInput={(params:any) => 
        <TextField
            {...params}
            className="language-text"
            placeholder={`Select a ${props.type} Language`}
        />}
    />)
}