const csvParser = require("csv-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const CHUNK_SIZE = 100;
const BusStopsModel = require("../models/BusStops");
const BusTripsModel = require("../models/BusTrip");

// async function uploadaBusRoutesDataController(req, res){

// }

async function uplpoadBusTripsDataController(req, res) {
  const { fileName } = req.body;

  const filePath = path.join(__dirname, "..", "csv-files", fileName);
  console.log("FilePath", filePath);

  try {
    const stream = fs.createReadStream(filePath);
    const busTrips = [];
    stream
      .pipe(csvParser())
      .on("data", async (row) => {
        try {
          const busTripsData = {
            Trip_Id: parseInt(row.Trip_Id),
            Route_Id: row.Route_Id,
            Service_Cost: parseFloat(row.Service_Cost),
            Construction_Cost: parseFloat(row.Construction_Cost),
            TimeStamp: row.TimeStamp,
            Average_Speed: parseInt(row.Average_Speed),
            AvgCheckIn: parseFloat(row.AvgCheckIn),
            AvgCheckOut: parseFloat(row.AvgCheckOut),
            Average_Load: parseFloat(row.Average_Load),
          };
          busTrips.push(busTripsData);
        } catch (err) {
          console.error("Error Saving Bus Trips Data", err);
        }
      })
      .on("end", () => {
        BusTripsModel.insertMany(busTrips)
          .then(() => {
            console.log("BusTrips File Successfully Uploaded");
            res.status(200).json({
              message: "BusTrips file successfully processed and uploaded!!!!",
            });
          })
          .catch((err) => {
            console.error("Error occurred", err);
          });
      });
  } catch (err) {
    console.error("Error Processing CSV File", err);
    res.status(500).json({ error: "Internal Server Erorr!!!!!!!!!" });
  }
}

async function uploadBusStopsDataController(req, res) {
  console.log("Request", req.body);
  const { fileName } = req.body;
  const filePath = path.join(__dirname, "..", "csv-files", fileName);
  console.log("FilePath", filePath);

  try {
    const stream = fs.createReadStream(filePath);
    const busStops = [];
    stream
      .pipe(csvParser())
      .on("data", async (row) => {
        try {
          const routes = JSON.parse(row.Routes.replace(/'/g, '"'));
          const busStopsData = {
            StopCode: row.StopCode,
            StopName: row.StopName,
            StopType: row.StopType,
            Latitude: parseFloat(row.Latitude),
            Longitude: parseFloat(row.Longitude),
            Direction: row.Direction.toUpperCase(),
            Status: row.Status,
            Routes: routes,
            Zone: row.Zone,
          };
          busStops.push(busStopsData);
        } catch (err) {
          console.error("Error saving Bus Stops Data:", err);
        }
      })
      .on("end", () => {
        BusStopsModel.insertMany(busStops)
          .then(() => {
            console.log("CSV file successfully processed");
            res.status(200).json({
              message: "CSV file successfully processed and uploaded!!!!",
            });
          })
          .catch((err) => {
            console.error(err);
          });
      });
  } catch (err) {
    console.error("Error Processing CSV File", err);
    res.status(500).json({ error: "Internal Server Erorr!!!!!!!!!" });
  }
}

module.exports = { uploadBusStopsDataController, uplpoadBusTripsDataController };
