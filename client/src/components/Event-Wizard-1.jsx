import React from 'react';
import { Form, Button, Overlay } from 'react-bootstrap';
import { HashLink as Link } from 'react-router-hash-link';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => {
    return{
        saveItinerary: (payload) => dispatch(saveItinerary(payload)),
        saveItineraryDB: (payload) => dispatch(saveItineraryDB(payload)),
        clearCurrentItinerary: (payload) => dispatch(clearCurrentItinerary())
    };
};

const mapStateToProps = state => {
    return { 
        itinerary: state.itinerary.itinerary,
        user: state.auth.user
    };
};

class ConnectedEventWizard1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            start: null
        }
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
    }

    // Get current date/time, save to local state
    componentDidMount() {

        this.props.clearCurrentItinerary();

        var currDate = new Date();
        this.setState({
            start: currDate
        });
    }

    // Change local state based on user date/time selection
    handleDateChange(date) {
        this.setState({
            start: date
        });
    }

    handleTitleChange(event){
        var name = event.target.value;
        this.setState({
            name: name
        });
    }

    // Send current state to store
    handleNext(event){
        event.preventDefault();
        var payload = this.state;
        //payload.user = this.props.user.id;
        this.props.saveItinerary(payload);
    }

    // Send current state to store, send from store to database
    handleSave(event){
        event.preventDefault();
        var saved = this.props.itinerary;
        // If nothing has been saved to the store or store has not been sent to DB
        if((saved === null) || (!(saved._id))){
            // Save state to store & send info to DB
            var payload = this.state;
            payload.user = this.props.user.id;
            this.props.saveItineraryDB(payload, this.props.history);
        }
        
    }

    render() {
        return (
            <div className="e-w1 e-w">
                <Form>
                    <div className='form-item'>
                        <Form.Group controlId="formBasicItineraryTitle">
                            <Form.Label><h3>What do you want to call your itinerary?</h3></Form.Label>
                            <Form.Control onChange={this.handleTitleChange} size="lg" type="text" placeholder="Ex. Happy Birthday Brian's Ferrets!" />
                        </Form.Group>
                    </div>
                    <div className='form-item'>
                        <Form.Group controlId="formBasicItineraryDate">
                            <Form.Label><h3>Start date and time?</h3></Form.Label>
                            <DatePicker
                                selected={this.state.start}
                                onChange={this.handleDateChange}
                                showTimeSelect
                                dateFormat="Pp"
                            />
                        </Form.Group>
                    </div>
                    <div className='form-item form-button'>
                        {/* <Button variant="light" type="submit" onClick={this.handleSave}>
                            Save Progress
                            </Button> */}
                        <Link smooth to="/create-new/#add-collaborators">
                            <Button variant="success" type="submit" onClick={this.handleNext}>
                                Onward!
                            </Button>
                        </Link>
                    </div>
                </Form>
            </div>
        )
    }
}

var EventWizard1 = connect(mapStateToProps, mapDispatchToProps)(ConnectedEventWizard1);

export default EventWizard1;

