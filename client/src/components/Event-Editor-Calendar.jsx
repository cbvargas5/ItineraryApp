import React from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import { Toast, Button, Badge } from 'react-bootstrap';
import { connect } from "react-redux";
import moment from 'moment';

import '../../dist/style.scss'

import { addVote, deleteVote } from '../actions';

const mapStateToProps = state => {

    return {
        events: state.itinerary.itinerary.events,
        start: state.itinerary.itinerary.start,
        itin_id: state.itinerary.itinerary._id
    };

};

class ConnectedCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            title: '',
            location: '',
            description: '',
            votes: [],
            event_id: null,
            showToast: false
        }
        this.handleDateClick = this.handleDateClick.bind(this);
        this.toggleToast = this.toggleToast.bind(this);
    }

    toggleToast() {
        this.setState({
            showToast: !(this.state.showToast)
        })
    }

    handleDateClick(arg) {
        var event = arg.event;

        var title = event.title;
        var location = event.extendedProps.location;
        var description = event.extendedProps.notes;
        var votes = event.extendedProps.votes;
        var event_id = event.extendedProps._id;

        this.setState({
            title,
            location,
            description,
            showToast: true,
            votes,
            event_id
        }, () => { console.log(this.state) });
    }

    sendUpVote = () => {
        this.props.addVote(this.props.itin_id, this.state.event_id, true)
            .then(res => {
                console.log("Vote was added")
                let newVotes = res.data.events.find(event => event._id === this.state.event_id).votes;
                console.log(newVotes);
                this.setState({ votes: newVotes })
                //dispatch(getItineraryById(itin_id));
            })
            .catch(err => {
                console.log("Vote could not be added")
            });
    }

    sendDownVote = () => {
        this.props.addVote(this.props.itin_id, this.state.event_id, false)
            .then(res => {
                console.log("Vote was added")
                let newVotes = res.data.events.find(event => event._id === this.state.event_id).votes;
                console.log(newVotes);
                this.setState({ votes: newVotes })
                //dispatch(getItineraryById(itin_id));
            })
            .catch(err => {
                console.log("Vote could not be added")
            });
    }

    static getDerivedStateFromProps(props, state) {
        return { events: props.events }
    }

    componentDidMount() {
        var newEvents;
        if (this.props.events !== undefined) {
            newEvents = this.props.events;
        }
        else {
            newEvents = [];
        }
        this.setState({
            events: newEvents
        })
    }

    render() {
        var day = moment(this.props.start);
        var formattedDate = day.toISOString();
        console.log('formatted--->', formattedDate);
        var newEvents;
        if (this.state.events) {
            newEvents = [...this.state.events];
        }
        else {
            newEvents = [];
        }
        return (
            <div id="calendar" className="e-e-i">
                <FullCalendar id="calendar-module"
                    defaultView="timeGridDay"
                    plugins={[timeGridPlugin, bootstrapPlugin, interactionPlugin]}
                    themeSystem={'bootstrap'}
                    height={750}
                    aspectRatio={0.5}
                    handleWindowResize={true}
                    defaultDate={formattedDate}
                    allDaySlot={false}
                    events={newEvents}
                    eventClick={this.handleDateClick}
                />
                <Toast show={this.state.showToast} onClose={this.toggleToast}>
                    <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                        <strong className="toast-header">More About This Event!</strong>
                    </Toast.Header>
                    <Toast.Body>
                        <div className='toast-message'><b>Event:</b> {this.state.title}</div>
                        <div className='toast-message'><b>Location:</b> {this.state.location}</div>
                        <div className='toast-message'><b>Event Description:</b> {this.state.description}</div>

                        <span style={{"text-align": "center"}}>
                            <Button variant="info" size="sm" onClick={this.sendUpVote}>
                                <i className="fas fa-thumbs-up" />
                                <Badge pill variant="info">
                                    {this.state.votes.filter(vote => vote.vote === true).length}
                                </Badge>
                            </Button>

                            <Button variant="danger" size="sm" onClick={this.sendDownVote}>
                                <i className="fas fa-thumbs-down" />
                                <Badge pill variant="danger">
                                    {this.state.votes.filter(vote => vote.vote === false).length}
                                </Badge>
                            </Button>
                        </span>

                    </Toast.Body>
                </Toast>
            </div>
        )
    }
}

const Calendar = connect(mapStateToProps, { addVote, deleteVote })(ConnectedCalendar);
export default Calendar;