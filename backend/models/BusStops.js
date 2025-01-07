const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const BusStopSchema = new Schema({
    StopCode:{
        type: String
    },
    StopName:{
        type: String
    },
    Status:{
        type: String,
        enum:{
            values:['Inactive', 'Active']
        },
    },
    StopType:{
        type: String,
        enum:{
            values:['Primary', 'Secondary']
        },
    },
    Latitude:{
        type: Number
    },
    Longitude:{
        type: Number
    },
    Direction:{
        type: String,
        enum:{
            values:['UP', 'DOWN', 'RIGHT', 'LEFT']
        }
    },
    Zone:{
        type: String,
        enum:{
            values:['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4']
        }
    },
    Routes:{
        type:[String]
    },
})

const BusStop = mongoose.model('BusStops', BusStopSchema)

module.exports = BusStop;


