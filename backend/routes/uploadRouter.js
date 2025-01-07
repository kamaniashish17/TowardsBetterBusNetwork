const express = require("express");

const uploadDataController = require("../controllers/uploadBusStopsDataController");

const router = express.Router();

console.log("Inside Router!!!!");

router.post(
  "/upload/bus-stops",
  uploadDataController.uploadBusStopsDataController
);
// router.post(
//   "/upload/bus-routes",
//   uploadDataController.uploadBusRoutesDataController
// );

router.post(
  "/upload/bus-trips",
  uploadDataController.uplpoadBusTripsDataController
);

module.exports = router;
