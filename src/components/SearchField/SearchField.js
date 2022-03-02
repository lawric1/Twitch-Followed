import "./SearchField.css";
import React, {useState} from 'react'

export function SearchField(props) {
    const [input, setInput] = useState("");

    
    function updateInput(event) {
        setInput(event.target.value);
    }

    function handleSubmit(event) {
        props.callback(input);
        event.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                className="search"
                type="text"
                placeholder="ex: buddha"
                value={input} 
                onChange={updateInput} />
            
            <input className="button" type="submit" value="Submit" />
        </form>
    );
}