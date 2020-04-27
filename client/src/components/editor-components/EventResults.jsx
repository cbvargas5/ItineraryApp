import React from 'react';
import EventResultsItem from './EventResultsItem.jsx';


const EventResults = props => (
    <div id='results-container'>
        <center>
            <div className='line'></div>
            <h5>Results</h5>
            <div id='results'>
                {props.events ? props.events.map((event) => (
                    <EventResultsItem event={event} />
                )) : "No Results Found"}
            </div>
        </center>
    </div>
)

export default EventResults;