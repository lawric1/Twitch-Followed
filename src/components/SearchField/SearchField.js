import "./SearchField.css";

import React, {useState} from 'react';


export function SearchField(props) {
    // input state will be used to send the search text to the callback function.
    const [input, setInput] = useState("");

    function updateInput(event) {
        setInput(event.target.value);
    }


    function handleSubmit(event) {
        // callback function is "requestChannelsData" from the App component.
        props.callback(input);
        // preventDefault is used so the page don't reload when the submit button is clicked.
        event.preventDefault();
    }


    return (
        <form onSubmit={handleSubmit}>
            <input 
                className="search"
                type="text"
                placeholder="ex: buddha"
                onChange={updateInput} />
            
            <input className="button" type="submit" value="Search" />
        </form>
    );
}