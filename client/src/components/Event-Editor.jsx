import React from 'react';
import Header from './Header.jsx';
import SidebarMenu from './editor-components/SidebarMenu.jsx';
import EventEditorCalendar from './Event-Editor-Calendar.jsx';

import { connect } from "react-redux";
import { getItineraryById } from "../actions";
import { useParams } from 'react-router-dom';

import { Spinner } from 'react-bootstrap';

class EventEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itinerary: {}
        }
    }

    componentDidUpdate(){
        console.log('Editor has been updated!');
        console.log('State--->', this.state.itinerary);
    }

    componentDidMount() {

        //let { itin_id } = useParams();

        console.log(this.props.match.params.itin_id);
        if (this.props.match.params.itin_id) {
            this.props.getItineraryById(this.props.match.params.itin_id);
        }

        this.setState({
            itinerary: this.props.itinerary
        })
    }


    render() {
        console.log('Editor is re-rendering!');

        let { loading, itinerary } = this.props.itinerary;

        console.log(loading);
        console.log(itinerary);

        var newEvents = {...this.state.itinerary};

        return (
            <div id='e-e-c'>
                <Header />

                {itinerary === null || loading ? <Spinner animation="grow" variant="primary" /> : (
                    <div id='event-editor'>
                        <SidebarMenu />
                        <EventEditorCalendar itinerary={newEvents}/>
                    </div>
                )}

            </div>
        )
    }
}

const mapStateToProps = state => ({
    itinerary: state.itinerary
});

export default connect(mapStateToProps, { getItineraryById })(EventEditor);