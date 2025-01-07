import React, { useState, useEffect } from "react";
import busImage from "../../images/homePage-2.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [sourceName, setSourceName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const navigate = useNavigate();
  const [routesData, setRoutesData] = useState([]);

  // Define SourceMap and dynamically create DestinationMap
  const SourceMap = new Map([
    ["e square", ["ma na pa nadikathi"]],
    ["kacharevasti", ["keshavnagar"]],
    ["shivtirthnagar corner", ["anandnagar kothrud", "sutardara"]],
    ["shivtirthnagar", ["sutardara"]],
    ["siemens", ["shivaji chowk hinjawadi"]],
    ["deccan corner", ["nal stop"]],
    ["jai bhavaninagar", ["ideal colony"]],
    ["gavali matha", ["gavhanevasti bhosari"]],
    ["telco hostel", ["agnishamak kendra landewadi"]]
  ]);

  const DestinationMap = new Map();
  for (const [key, values] of SourceMap) {
    values.forEach(value => {
      if (!DestinationMap.has(value)) {
        DestinationMap.set(value, []);
      }
      DestinationMap.get(value).push(key);
    });
  }

  useEffect(() => {
    setSourceOptions(Array.from(SourceMap.keys()));
    setDestinationOptions(Array.from(DestinationMap.keys()));
  }, []);

  // Update destination options when source changes
  useEffect(() => {
    if (sourceName) {
      setDestinationOptions(SourceMap.get(sourceName));
      if (SourceMap.get(sourceName).length === 1) {
        setDestinationName(SourceMap.get(sourceName)[0]);
      }
    } else {
      setDestinationOptions(Array.from(DestinationMap.keys()));
    }
  }, [sourceName]);

  // Update source options when destination changes
  useEffect(() => {
    if (destinationName) {
      setSourceOptions(DestinationMap.get(destinationName));
      if (DestinationMap.get(destinationName).length === 1) {
        setSourceName(DestinationMap.get(destinationName)[0]);
      }
    } else {
      setSourceOptions(Array.from(SourceMap.keys()));
    }
  }, [destinationName]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (sourceName && destinationName) {
      try {
        const response = await axios.post(
          "http://localhost:8000/get/AllPossibleRoutes",
          { sourceName, destinationName }
        );
        setRoutesData(response.data);
        navigate(`/routes/${sourceName}/${destinationName}`, {
          state: { routesData: response.data },
        });
      } catch (error) {
        console.error("Error fetching routes data:", error);
      }
    } else {
      alert('Please select both a source and a destination.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 h-full">
        <img
          src={busImage}
          alt="Bus Network"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="md:w-1/2 flex items-center justify-center bg-gray-100">
        <form className="w-full max-w-sm p-8" onSubmit={handleSubmit}>
          <h2 className="text-lg font-bold mb-4">Find Routes</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="source">
              Source
            </label>
            <select
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              id="source"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
            >
              <option value="">Select an Option</option>
              {sourceOptions.map((source, index) => (
                <option key={index} value={source}>{source}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
              Destination
            </label>
            <select
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              id="destination"
              value={destinationName}
              onChange={(e) => setDestinationName(e.target.value)}
            >
              <option value="">Select an Option</option>
              {destinationOptions.map((destination, index) => (
                <option key={index} value={destination}>{destination}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Show All Routes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;