# Air Quality Monitoring Application

This Node.js application allows you to monitor and retrieve air quality data for different locations using the IQAir API. It also includes a CRON job to periodically fetch and store air quality data in a PostgreSQL database.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Technologies Used](#technologies-used)

## Features

- Retrieve air quality data for the nearest city using Axios.
- Retrieve air quality data for a specific city (e.g., Furth, Germany) using Axios.
- Periodically fetch and store air quality data for Furth and Munich in a PostgreSQL database.
- Find the most polluted day for Furth and Munich by querying the database.

## Data Contributors

- [Bavarian State Office For The Environment](#) 
- [IQ Air - Furth](https://www.iqair.com/germany/bavaria/furth/furth-theresienstrasse) (Visit their website for more information)
- [IQ Air - Munich](https://www.iqair.com/germany/bavaria/munich) (Visit their website for more information)

## Getting Started

To get started with this application, follow these steps:

1. Clone the repository to your local machine:
   
   ```bash
   git clone https://github.com/Mikostis/air-quality-monitoring.git
   cd air-quality-monitoring
Install the project dependencies:

bash
Copy code
npm install
Set up your PostgreSQL database and configure the connection in the database.js file.

Replace the placeholder API keys in main.js and cron.js with your actual IQAir API keys.

Start the application:

bash
Copy code
npm start
Access the API endpoints in your browser or using tools like Postman.

Usage
Retrieve Air Quality for the Nearest City
Endpoint: /air-quality-nearest-city-axios

Description: Retrieves air quality data for the nearest city using Axios.

Retrieve Air Quality for Furth and Munich
Endpoint: /air-quality-furth-axios and /air-quality-munich-fetch

Description: Retrieves air quality data for Furth and Munich, Germany, using Axios and Fetch, respectively.

Find the Most Polluted Day for Furth and Munich
Endpoint: /most-polluted-day-furth and /most-polluted-day-munich

Description: Queries the database to find the most polluted day for Furth and Munich.

CRON Job
The CRON job runs every minute to fetch and store air quality data for Furth and Munich in the database.

Database Schema
The PostgreSQL database stores air quality data in an air_quality table. The table schema includes the following columns:

id: A unique identifier for each record.
data: JSONB column containing the air quality data in JSON format.
timestamp: Timestamp indicating when the data was recorded.
Technologies Used
Node.js
Express.js
Axios
Fetch
PostgreSQL
node-cron