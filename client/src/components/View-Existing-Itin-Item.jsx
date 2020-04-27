import React from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";

var itinItem = (({ itin, history }) => {

    var date = moment(itin.start);
    var formattedDate = date.format('MM-DD-YYYY');


    var handleClick = (event) => {
        event.preventDefault();
        history.push(`/event-editor/${itin._id}`);
    }

    var handleExport = (event) => {
        event.preventDefault();
        history.push(`/public/${itin._id}`)
    }


    return(
        <div className='itin-item-list'>
            <div className="itin-item" onClick={handleClick}>
                <h5>{itin.name}</h5>
                <div><b>Date:</b> {formattedDate}</div>
                <div><b>Created By:</b> {itin.user.name}</div>
            </div>
            <div className='itim-item-export'>
                <Button variant='dark' onClick={handleExport}>Share Your Itinerary</Button>
            </div>
        </div>
    )
})

export default withRouter(itinItem);