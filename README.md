### Description

**Quick Start:**

1. Spin up local netlify server: `netlify dev`
2. Run local host: `npm run dev`

**Current Features:**

* Shows a 4 month price curve for outbound NYC flights using real data from Amadeus API (with fallback to mock data)
* Interactive price charts with tooltips using Recharts library
* Original Google Flights link is provided for visual verification
* Serverless backend using Netlify Functions to handle API requests

**Demo Site (Mock Data):**

https://6829819a09a0de55357b98eb--apollo-route-manager-0acz9.netlify.app/


**Future Features:**

* One-click cancel button for existing booked routes (assuming all routes are booked)
* One-click punt button for a booked flight into future if the trip is not taken

**Running the API**


Once we load the api key and secret into env we can call the documented api: https://developers.amadeus.com/my-apps/route-price-manager?userId=jason.bian75@gmail.com, we can also test calling the api locally. 

ID here for example is jason.bian75@gmail.com

Checking Connectivity:

```
source .env && curl -X POST "https://api.amadeus.com/v1/security/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=$AMADEUS_API_KEY&client_secret=$AMADEUS_API_SECRET" | jq
```

Running:

source .env && \
TOKEN=$(curl -s -X POST "https://api.amadeus.com/v1/security/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=$AMADEUS_API_KEY&client_secret=$AMADEUS_API_SECRET" | \
  jq -r '.access_token') && \
curl -s "https://api.amadeus.com/v2/shopping/flight-offers?originLocationCode=NYC&destinationLocationCode=LAX&departureDate=$(date -v+3m +%Y-%m-%d)&adults=1&nonStop=true&max=1" \
  -H "Authorization: Bearer $TOKEN" | jq