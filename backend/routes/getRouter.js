const express = require("express");

const getDataController = require("../controllers/getBusDataController");

const router = express.Router();

console.log("Inside Get Router!!!!");

router.get("/getBusRoutes", getDataController.getBusRoutesDataController);

router.get("/busRoutesHeatMap", getDataController.getBusRoutesHeatMapData);

router.post("/allPossibleRoutes", getDataController.getAllPossibleRoutesDataController)

router.get("/routesOfAllZones", getDataController.getAllRoutesByZone)

router.get("/getRadarData", getDataController.getRadarDataController)

router.get("/allRoutes", getDataController.getAllRoutes)

router.get("/getPieChartData", getDataController.getPieChartDataController)

module.exports = router;
