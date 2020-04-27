import React from 'react';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import { connect } from "react-redux";


const mapStateToProps = (state) => {
    return { events: state.itinerary.itinerary.events, date: state.itinerary.itinerary.date, start: state.itinerary.itinerary.start };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveItinerary: (payload) => dispatch(saveItinerary(payload)),
        addEvent: (payload) => dispatch(addEvent(payload))
    };
}

function ConnectedEventResults(props) {

    var { name, location, city, state, free, category, image_url, time_start, description, event_site_url } = props.event;

    var saveEvent = (event) => {
        event.preventDefault();

        var timeArr = time_start.split('T');
        var time = timeArr[1].split('-');
        var startTime = time[0].slice(0,5);
        var endTime = time[1];

        var startHour = Number(startTime.slice(0, 2));
        var endHour = Number(endTime.slice(0, 2));


        if(endHour < startHour){
            endHour += 12;
            endTime = endHour.toString() + endTime.slice(2);
        }

        // console.log('start-->', startHour);
        // console.log('end-->', endHour);

        // console.log('time-->', time);
        // console.log('start-->', startTime);
        // console.log('end-->', endTime);

        var completeLocation = `${location.display_address[0]} ${location.display_address[1]}`
        
        var newEvent = {
            title: name,
            location: completeLocation,
            image: image_url,
            notes: description,
            startTime: startTime,
            endTime: endTime
        }
        
        console.log('newEvent--->', newEvent);
        var payload = {
            events: props.events
        }
        console.log('payload--->', payload);

        payload.events.push(newEvent);
        props.addEvent(newEvent, payload)

    }

    return (
        <div className='result'>
            <a href={event_site_url}>
            <div className='result-container'>
                <img className='result-image' src={image_url} height="70px"></img>
                <div className='result-info'>
                    <div><b>{name}</b></div>
                    <div>{location.address1}</div>
                    <div>{location.city}, {location.state}</div>
                    <div><i>{category}</i></div>
                </div>
            </div>
            </a>
            <Button variant="dark" className="add-yelp" type="submit" size="sm" onClick={saveEvent}>
                Add Event!
            </Button>
        </div>
    )
}

var EventResults = connect(mapStateToProps, mapDispatchToProps)(ConnectedEventResults);
export default EventResults;