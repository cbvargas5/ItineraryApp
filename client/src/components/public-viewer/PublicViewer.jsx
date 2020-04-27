import React from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import moment from 'moment';
import axios from 'axios';

import '../../../dist/style.scss'


class ConnectedCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            events: []
        }
    }

    componentDidMount() {
        if (this.props.match.params.itin_id) {
            axios.get(`/itinerary/${this.props.match.params.itin_id}`)
                .then(res => {
                    let newEvents = res.data.events;
                    console.log('res!--->', res);
                    this.setState({ events: newEvents, title: res.data.name })
                })
                .catch(err => console.log(err))
        }
    }

    render() {
        var day = moment(this.props.date);
        var formattedDate = day.toISOString();
        return (
            <div id="calendar-export" className="e-e-i">
            <h3>{this.state.title}</h3>
                <FullCalendar id="calendar-module"
                    defaultView="timeGridDay"
                    plugins={[timeGridPlugin, bootstrapPlugin]}
                    themeSystem={'bootstrap'}
                    height={750}
                    aspectRatio={0.5}
                    handleWindowResize={true}
                    defaultDate={formattedDate}
                    allDaySlot={false}
                    events={this.state.events}
                />
            </div>
        )
    }
}

const Calendar = ConnectedCalendar;
export default Calendar;