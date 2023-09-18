const db = require("./database");

async function getMostPollutedDay(city) {
  const client = await db.connect();
  const query = `
    SELECT DATE(timestamp) AS day, 
           data->'current'->'pollution'->>'aqius' AS aqi 
    FROM air_quality 
    WHERE data->'data'->>'city' = $1
    ORDER BY (data->'data'->'current'->'pollution'->>'aqius')::integer DESC 
    LIMIT 1`;

  try {
    const result = await client.query(query, [city]);
    if (result.rows.length > 0) {
      return {
        mostPollutedDay: result.rows[0].day.toISOString().split("T")[0],
      };
    } else {
      return null; // No data available
    }
  } catch (error) {
    console.error("Error executing database query:", error);
    throw error;
  } finally {
    client.release();
  }
}

async function getMostPollutedDayForMunich(city) {
  const client = await db.connect();
  const query = `
    SELECT DATE(timestamp) AS day, 
           data->'current'->'pollution'->>'aqius' AS aqi 
    FROM air_quality 
    WHERE data->'data'->>'city' = $1
    ORDER BY (data->'data'->'current'->'pollution'->>'aqius')::integer DESC 
    LIMIT 1`;

  try {
    const result = await client.query(query, [city]);
    if (result.rows.length > 0) {
      return {
        mostPollutedDay: result.rows[0].day.toISOString().split("T")[0],
      };
    } else {
      return null; // No data available
    }
  } catch (error) {
    console.error("Error executing database query:", error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getMostPollutedDay,
  getMostPollutedDayForMunich,
};
