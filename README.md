# flight-search-app

This project is a web application that allows users to search for flight offers from multiple carriers, displaying itineraries, pricing, and other flight details. It integrates an external API for retrieving live flight information.

## Tech Stack

- Frontend: React with TypeScript
- Backend: Spring Boot (Java 22)
- Docker: Docker Compose for containerization

## Prerequisites

- Prerequisites
- Docker
- Node.js
- Java 22
- Gradle

# Getting Started

1. Clone the Repo:
 - Through Https:
```shell
git clone https://github.com/alonsofabila-encora/flight-search-app.git
```
 - Through SSH
```shell
git clone git@github.com:alonsofabila-encora/flight-search-app.git
```

## Frontend Setup

1. Navigate to the backend project directory:

```shell
cd frontend-flight-search
```

2. Install dependencies of the project:

```shell
npm install 
```

3. Run test and project:

```shell
npm run dev
```

## Backend Setup

Open a new terminal and follow:

1. Navigate to the backend project directory:

```shell
cd BackendFlightSearch
```

2. Run project:

```shell
./gradlew bootRun
```

## Docker Setup

1. For docker run the following command

```shell
docker-compose up --build
```
