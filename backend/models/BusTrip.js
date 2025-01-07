const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TripSchema = new Schema({
  Trip_Id: {
    type: Number,
    required: true,
  },
  Route_Id: {
    type: String,
  },
  Service_Cost: {
    type: Number,
  },
  Construction_Cost: {
    type: Number,
  },
  TimeStamp: {
    type: String,
  },
  Average_Speed: {
    type: String,
  },
  Average_Load: {
    type: Number,
  },
  AvgCheckIn: {
    type: Number,
  },
  AvgCheckOut: {
    type: Number,
  },
});

const TripModel = mongoose.model("BusTrips", TripSchema);

module.exports = TripModel;
