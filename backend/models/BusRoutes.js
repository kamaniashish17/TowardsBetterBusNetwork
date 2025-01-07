const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const RoutesScehma = new Schema({
    BusId:{
        type:Number
    },
    RouteAccess:{
        type:String,
        required: true
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
            values: ["UP", "DOWN","RIGHT"]
        }
    },
    Source:{
        type: String
    },
    Destination:{
        type: String
    },
    TotalLength:{
        type: Number
    }
    ,
    Zone:{
        type: String,
        enum:{
            values:["Zone 1", "Zone 2", "Zone 3", "Zone 4"]
        }
    },
    NumberofStops:{
        type:Number
    },

    ConstructionCost:{
        type:Number
    },
    ServiceCost:{
        type:Number
    }
    ,
    Optimal:{
        type:String
    },

    Weight:{
        type:Number,
    },
    CheckIn1: {
        type: [Number]
    },
    CheckIn2: {
        type: [Number]
    },
    CheckIn3: {
        type: [Number]
    },
    CheckIn4: {
        type: [Number]
    },
    CheckIn5: {
        type: [Number]
    },
    CheckIn6: {
        type: [Number]
    },
    CheckIn7: {
        type: [Number]
    },
    CheckIn8: {
        type: [Number]
    },
    CheckIn9: {
        type: [Number]
    },
    CheckIn10: {
        type: [Number]
    },
    CheckIn11: {
        type: [Number]
    },
    CheckIn12: {
        type: [Number]
    },
    CheckOut1: {
        type: [Number]
    },
    CheckOut2: {
        type: [Number]
    },
    CheckOut3: {
        type: [Number]
    },
    CheckOut4: {
        type: [Number]
    },
    CheckOut5: {
        type: [Number]
    },
    CheckOut6: {
        type: [Number]
    },
    CheckOut7: {
        type: [Number]
    },
    CheckOut8: {
        type: [Number]
    },
    CheckOut9: {
        type: [Number]
    },
    CheckOut10: {
        type: [Number]
    },
    CheckOut11: {
        type: [Number]
    },
    CheckOut12: {
        type: [Number]
    },
    StopCoordinateMap: {
        type: [{
            stop_id: String,
            latitude: Number,
            longitude: Number
        }]
    }
})

const RouteModel = mongoose.model('BusRoutes', RoutesScehma)

module.exports = RouteModel