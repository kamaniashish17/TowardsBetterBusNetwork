const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const BusSchema = new Schema({
    BusId:{
        type:Number
    },
    RouteAccess:{
        type:String
    },
    BusStops:{
        type:[String]
    },
    Capacity:{
        type: Number
    },
    Speed:{
        type: Number
    },
    Direction:{
        type: String,
        enum:{
            values: ["UP", "DOWN"]
        }
    },
    Source:{
        type: String
    },
    Destination:{
        type: String
    }
})

const BusModel = mongoose.model('Bus', BusSchema)

module.exports = BusModel