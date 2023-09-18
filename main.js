const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable if available
const cron = require("node-cron");
const fetch = require("node-fetch");

// database connection
const db = require("./database");
const {
  getMostPollutedDay,
  getMostPollutedDayForMunich,
} = require("./queries");

// Load environment variables from a .env file if available
require("dotenv").config();

const apiKey = process.env.AIRVISUAL_API_KEY; // Use the AIRVISUAL_API_KEY environment variable

/**
 * axios Furth
 */

// Define an API endpoint to get air quality of the nearest city using Axios
app.get("/air-quality-nearest-city-axios", async (req, res) => {
  try {
    // Make a request to the IQAir API using Axios to get air quality
    const response = await axios.get(
      `http://api.airvisual.com/v2/nearest_city?key=${apiKey}`
    );
    const airQualityData = response.data;

    // Return air quality data as JSON
    res.json(airQualityData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch air quality data" });
  }
});

// Define an API endpoint to get air quality for Furth using Axios
app.get("/air-quality-furth-axios", async (req, res) => {
  try {
    // Make a request to the IQAir API using Axios to get air quality for Furth
    const response = await axios.get(
      `http://api.airvisual.com/v2/city?city=Furth&state=Bavaria&country=Germany&key=${apiKey}`
    );
    const airQualityData = response.data;

    // Return air quality data for Furth as JSON
    res.json(airQualityData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unable to fetch air quality data for Furth" });
  }
});

// Define an API endpoint to get the most polluted day in Fürth
app.get("/most-polluted-day", async (req, res) => {
  try {
    const mostPollutedDay = await getMostPollutedDay("Furth");

    if (mostPollutedDay) {
      res.json(mostPollutedDay);
    } else {
      res.status(404).json({ error: "No data available for Furth" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CRON job to fetch and save air quality data for Furth every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    // Make a request to the IQAir API using Axios to get air quality for Furth
    const response = await axios.get(
      `http://api.airvisual.com/v2/city?city=Furth&state=Bavaria&country=Germany&key=${apiKey}`
    );
    const airQualityData = response.data;

    // Save air quality data and timestamp to the database
    const client = await db.connect();
    const query =
      "INSERT INTO air_quality (data, timestamp) VALUES ($1, NOW())";
    await client.query(query, [JSON.stringify(airQualityData)]);
    client.release();

    console.log("Data fetched and saved for Furth:", airQualityData);
  } catch (error) {
    console.error("CRON job error:", error);
  }
});

/**
 * fetch Munich
 */

app.get("/air-quality-munich-fetch", async (req, res) => {
  try {
    // Make a request to the IQAir API using Fetch to get air quality for Munich
    const response = await fetch(
      `http://api.airvisual.com/v2/city?city=Munich&state=Bavaria&country=Germany&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Unable to fetch air quality data for Munich");
    }

    const airQualityData = await response.json();

    // Return air quality data for Munich as JSON
    res.json(airQualityData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unable to fetch air quality data for Munich" });
  }
});

// Define an API endpoint to get the most polluted day in Munich
app.get("/most-polluted-day-munich", async (req, res) => {
  try {
    const mostPollutedDay = await getMostPollutedDayForMunich("Munich");

    if (mostPollutedDay) {
      res.json(mostPollutedDay);
    } else {
      res.status(404).json({ error: "No data available for Munich" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CRON job to fetch and save air quality data for Munich using Fetch every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    // Make a request to the IQAir API using Fetch to get air quality for Munich
    const response = await fetch(
      `http://api.airvisual.com/v2/city?city=Munich&state=Bavaria&country=Germany&key=${apiKey}`
    );

    if (!response.ok) {
      throw Error("Unable to fetch air quality data for Munich");
    }

    const airQualityData = await response.json();

    // Save air quality data and timestamp to the database for Munich
    const client = await db.connect();
    const query =
      "INSERT INTO air_quality (data, timestamp) VALUES ($1, NOW())";
    await client.query(query, [JSON.stringify(airQualityData)]);
    client.release();

    console.log("Data fetched and saved for Munich:", airQualityData);
  } catch (error) {
    console.error("CRON job error:", error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
