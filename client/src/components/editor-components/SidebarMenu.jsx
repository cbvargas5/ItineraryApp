import React from 'react';
import TimePicker from 'react-time-picker';
import { Accordion, Card, Form, Row, Col, Button, FormControl } from 'react-bootstrap';
import { connect } from "react-redux";
import FindEventMenu from './FindEventMenu.jsx';
import moment from 'moment';

const mapDispatchToProps = (dispatch) => {
    return {
        saveItinerary: (payload) => dispatch(saveItinerary(payload)),
        addEvent: (payload) => dispatch(addEvent(payload))
    };
}

const mapStateToProps = (state) => {
    return { events: state.itinerary.itinerary.events, start: state.itinerary.itinerary.start, _id: state.itinerary.itinerary._id };
};

class ConnectedSidebarMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            location: '',
            startTime: "11:00",
            endTime: "13:00",
            notes: '',
            events: [],
            start: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
        this.saveEvent = this.saveEvent.bind(this);
    }       

    handleChange(event) {
        var item = event.target.id;
        var value = event.target.value;
        this.setState({
            [item]: value
        })
    }

    handleTimeChange(startTime) {
        this.setState({ startTime });
    }

    handleEndTimeChange(endTime) {
        this.setState({ endTime });
    }

    saveEvent(event){
        event.preventDefault();
        var day = moment(this.props.start);
        var formattedDate = day.toISOString();
        var newEvent = {
            title: this.state.title,
            location: this.state.location,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            notes: this.state.notes,
            start: formattedDate,
            votes: []
        }

        var payload = {
            events: this.state.events
        }

        payload.events.push(newEvent);

        console.log("sidebar payload --->", payload);

        this.props.addEvent(newEvent, payload)
        // this.props.saveItinerary(payload);

        this.setState({
            events: payload.events,
            title: '',
            location: '',
            startTime: "0:00",
            endTime: "0:00",
            notes: '',
            date: formattedDate
        })
    }

    componentDidMount(){
        var events = this.props.events;
        if(!(events)){
            events = [];
        }
        this.setState({
            events
        })
    }


    render() {
        return (
            <div id='sidebar-container' className='e-e-i default-text'>
                <Accordion defaultActiveKey="2">
                    <Card>
                        <Accordion.Toggle className="c-h" as={Card.Header} eventKey="1">
                            Find Event
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>

                                <FindEventMenu />

                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle className="c-h" as={Card.Header} eventKey="2">
                            Create a custom event
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="2">
                            <Card.Body>
                                <Form>
                                    <Form.Control className="c-e-f" type="text" id="title" placeholder="Event Title" onChange={this.handleChange} />
                                    <Form.Control className="c-e-f" id="location" placeholder="Location" onChange={this.handleChange} />
                                    <Row>
                                        <Col>Start Time:
                                            <TimePicker
                                                onChange={this.handleTimeChange}
                                                value={this.state.startTime} id="startTime" className="c-e-f" disableClock={true}
                                            />
                                        </Col>
                                        <Col>End Time:
                                            <TimePicker
                                                onChange={this.handleEndTimeChange}
                                                value={this.state.endTime} id="endTime" className="c-e-f" disableClock={true}
                                            />
                                        </Col>
                                    </Row>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Control className="c-e-f" id="notes" placeholder="Notes/Description (Optional)" as="textarea" rows="3" onChange={this.handleChange} />
                                    </Form.Group>
                                </Form>
                                <Button variant="success" type="submit" onClick={this.saveEvent}>
                                    Add Event!
                                </Button>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
        )
    }
}

var SidebarMenu = connect(mapStateToProps, mapDispatchToProps)(ConnectedSidebarMenu);
export default SidebarMenu;


