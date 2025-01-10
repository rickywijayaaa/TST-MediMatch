# Medimatch

Medimatch is a platform to assist users in finding alternative medicines with similar compositions and functions using machine learning models. The system integrates features for consultation booking and cryptocurrency payment support.

## Deployment and Repository Links

- **Frontend Deployment**: [Medimatch Frontend](https://medimatch.web.id)
- **Backend Deployment**: [Medimatch Backend](https://backend.medimatch.web.id)
- **Repository**: [GitHub ](https://github.com/rickywijayaaa/TST-MediMatch)

---

## Running the Frontend

To run the frontend locally, follow these steps:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`.

---

## Running the Backend

To build and deploy the backend using Docker:

1. Build the Docker image:
   ```bash
   docker build . -t ghcr.io/rickywijayaaa/medimatch
   ```

2. Start the services using `docker-compose`:
   ```bash
   docker-compose up -d
   ```

The backend will be available at `http://localhost:8000` or as deployed on `https://backend.medimatch.web.id`.

---

## Endpoints Table

| Endpoint                 | Method   | Function                                               | Authorization        |
|--------------------------|----------|-------------------------------------------------------|----------------------|
| `/generate-api-key`      | POST     | Generate API keys for external developers             | Public               |
| `/reservation`           | POST     | Create a reservation (integrated with external API)   | Bearer Token + API Key |
| `/api-keys`              | GET      | List all generated API keys                           | Public               |
| `/recommend`             | POST     | Recommend alternative medicines using ML models       | API Key (Optional for Medimatch users) |
| `/payment`               | POST     | Create payment and generate a QR code for Solana crypto | API Key             |
| `/check/{paymentID}`     | GET      | Check payment status using a payment ID               | API Key             |
| `/`                      | GET      | Health check endpoint to verify server status         | Public               |

---

## Tech Stack

- **Frontend**: Vite + React.js
- **Backend**: FastAPI, Uvicorn
- **Database**: Supabase
- **Authentication**: Firebase with OAuth2
- **Hosting**: Hostinger VPS GIO NEO Lite (IP: 103.127.139.184)
- **Domain**: [medimatch.web.id](https://medimatch.web.id)

---

For more details, refer to the documentation available at: [Backend Documentation](https://backend.medimatch.web.id/docs).

---

## Author

Ricky Wijaya (18222043)