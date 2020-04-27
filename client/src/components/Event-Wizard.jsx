import { HashLink as Link } from 'react-router-hash-link';
import React from 'react';
import EventWizard1 from './Event-Wizard-1.jsx';
import EventWizard2 from './Event-Wizard-2.jsx';
import Header from './Header.jsx';



var EventWizard = props => {
    return(
        <div>
            <Header />
            <div id="event-wizard">
                <EventWizard1 />
                <EventWizard2 />
            </div>
        </div>
    )
}

export default EventWizard;