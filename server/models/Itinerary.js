const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const ItinerarySchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    },
    events: [
        {
            title: {
                type: String
            },
            location: {
                type: String,
            },
            image: {
                type: String
            },
            startTime: {
                type: String,
            },
            endTime: {
                type: String
            },
            notes: {
                type: String
            },
            votes: [
                {
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: "users"
                    },
                    vote: {
                        type: Boolean
                    }
                }
            ]
        }
    ],
    collaborators: {
        type: [String]
    }

});

module.exports = Itinerary = mongoose.model("itinerary", ItinerarySchema);