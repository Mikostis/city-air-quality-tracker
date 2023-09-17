const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;
const cron = require("node-cron");
const fetch = require("node-fetch");

// database connection
const db = require("./database");

/**
 * axios Furth
 */

// Define an API endpoint to get air quality of the nearest city using Axios
app.get("/air-quality-nearest-city-axios", async (req, res) => {
  const apiKey = "0d132a15-ab92-4b8b-8ff6-45d883a8b1f5"; // Replace with your actual API key

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
  const apiKey = "0d132a15-ab92-4b8b-8ff6-45d883a8b1f5"; // Replace with your actual API key

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
    /**
     *
     * Query the database to find the most polluted day for Furth
     *
     * */
    const client = await db.connect();
    const query = `
      SELECT DATE(timestamp) AS day, 
             data->'current'->'pollution'->>'aqius' AS aqi 
      FROM air_quality 
      WHERE data->'data'->>'city' = 'Furth' 
      ORDER BY (data->'data'->'current'->'pollution'->>'aqius')::integer DESC 
      LIMIT 1`;

    const result = await client.query(query);
    client.release();

    if (result.rows.length > 0) {
      const mostPollutedDay = result.rows[0].day;

      // Format the date to a more readable format (e.g., "2023-09-16")
      const formattedDate = mostPollutedDay.toISOString().split("T")[0];

      res.json({ mostPollutedDay: formattedDate });
    } else {
      res.status(404).json({ error: "No data available for Furth" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to retrieve most polluted day" });
  }
});

// CRON job to fetch and save air quality data for Nuremberg-Furth every 1 minute
cron.schedule("* * * * *", async () => {
  const apiKey = "0d132a15-ab92-4b8b-8ff6-45d883a8b1f5"; // Replace with your actual API key

  try {
    // Make a request to the IQAir API using Axios to get air quality for Nuremberg

    const response = await axios.get(
      `http://api.airvisual.com/v2/city?city=Fürth&state=Bavaria&country=Germany&key=${apiKey}`
    );
    const airQualityData = response.data;

    // Save air quality data and timestamp to the database
    const client = await db.connect(); // Assuming you've defined 'db' as your database connection
    const query =
      "INSERT INTO air_quality (data, timestamp) VALUES ($1, NOW())";
    await client.query(query, [JSON.stringify(airQualityData)]);
    client.release();

    console.log("Data fetched and saved for Furth : ", airQualityData);
  } catch (error) {
    console.error("CRON job error:", error);
  }
});

/**
 *
 * fetch Munich
 */

app.get("/air-quality-munich-fetch", async (req, res) => {
  const apiKey = "0d132a15-ab92-4b8b-8ff6-45d883a8b1f5";

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

// Define an API endpoint to get the most polluted day in Munich using Fetch
app.get("/most-polluted-day-munich", async (req, res) => {
  try {
    /**
     *
     * Query the database to find the most polluted day for Munich
     *
     * */
    const client = await db.connect();
    const query = `
      SELECT DATE(timestamp) AS day, 
             data->'current'->'pollution'->>'aqius' AS aqi 
      FROM air_quality 
      WHERE data->'data'->>'city' = 'Munich' 
      ORDER BY (data->'data'->'current'->'pollution'->>'aqius')::integer DESC 
      LIMIT 1`;

    const result = await client.query(query);
    client.release();

    if (result.rows.length > 0) {
      const mostPollutedDay = result.rows[0].day;

      // Format the date to a more readable format ( "2023-09-16")
      const formattedDate = mostPollutedDay.toISOString().split("T")[0];

      res.json({ mostPollutedDay: formattedDate });
    } else {
      res.status(404).json({ error: "No data available for Munich" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unable to retrieve most polluted day for Munich" });
  }
});

// CRON job to fetch and save air quality data for Munich using Fetch
cron.schedule("* * * * *", async () => {
  const apiKey = "0d132a15-ab92-4b8b-8ff6-45d883a8b1f5"; // Replace with your actual API key

  try {
    // Make a request to the IQAir API using Fetch to get air quality for Munich
    const response = await fetch(
      `http://api.airvisual.com/v2/city?city=Munich&state=Bavaria&country=Germany&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Unable to fetch air quality data for Munich");
    }

    const airQualityData = await response.json();

    // Save air quality data and timestamp to the database for Munich
    const client = await db.connect(); // Assuming you've defined 'db' as your database connection
    const query =
      "INSERT INTO air_quality (data, timestamp) VALUES ($1, NOW())";
    await client.query(query, [JSON.stringify(airQualityData)]);
    client.release();

    console.log("Data fetched and saved for Munich : ", airQualityData);
  } catch (error) {
    console.error("CRON job error:", error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
