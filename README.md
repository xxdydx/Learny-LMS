# Learny LMS

### Site is deployed [here](https://learny-lms.vercel.app)!

## Table of contents

- [Features](#features)
- [Motivations and Aims](#motivations-and-aims)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Development](#development)

## Motivations and Aims

I am a part-time tutor, who mostly teaches via online platforms via Zoom. As part of my tuition classes, I also provide worksheets and notes to my students, and I usually upload them online on platforms like Google Drive or Onedrive. However, I've noticed that the navigation experience may not be the most intuitive. I also found that the uploading process could be quite inconvenient, as I would have to upload worksheets and answers (for the same topic) every week, as I didn't want my students to see worksheets/answer keys that are meant for upcoming weeks' lessons. Assignment submission is hard to track on such a platform as well. I have tried platforms like Google Classroom as well, but the structure was too rigid, so I decided to take things into my own hands and created my own Progressive Web App (PWA) to organise and distribute assignments, worksheets and answer keys to my students.

## Tech Stack

- PostgreSQL
- Express
- React
- NodeJS

## Setup

### Ensure that you have Node.js, npm and PostgreSQL installed.

If you do not have Node.js installed, it is recommended to install from their site [here](https://nodejs.org/en/). This will install the latest version of Node.js along with npm.

If you do not have PostgreSQL installed, download it [here](https://postgresapp.com/downloads.html).

### Clone the repository

```bash
git clone git@github.com:xxdydx/Learny-LMS.git
```

### Install dependencies

1. To install frontend dependencies, `cd` to the frontend directory and run

   ```bash
   npm install
   ```

1. To install backend dependencies, `cd` to the backend directory and run
   ```bash
   npm install
   ```

### Initializing PostgreSQL database

Assuming you have Docker on your system installed, you can run the following command in the backend directory to start a Postgres Docker image. Replace 'mysecretpassword' with the password of your choice.

```bash
docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres
```

### Initializing environment variables

I use the Amazon S3 service to upload files. To ensure you have access to all the features, you can create an AWS account and add your API keys to the app in an .env file.

The .env file should contain the following:

```bash
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres (replace 'mysecretpassword' with the password you defined earlier)

ACCESS_KEY_ID=AKIAS53A6GEFMCQF4U7M (From AWS)

SECRET_ACCESS_KEY=FiOOgVWLoHvjrt1T9c9n7Ms+IhXw60A9hSgHWIa8 (From AWS)

AWS_REGION=ap-southeast-1 (From AWS)

AWS_BUCKET_NAME=ae-education-lms (From AWS)

PORT=3001 (or any port of your choice)

```

## Development

### Start server in development

1. Run Postgres app and start the server on `Port 5432`.

2. Start the local backend server by `cd` to the backend folder running
   ```bash
   npm run dev
   ```

The server should now be running locally on `localhost:3001`, and the API can be reached via `localhost:3001/api`.

The backend server must be running before starting the app.

### Start frontend NextJS app in development

1. Start the app by `cd` to the frontend folder and running

```bash
npm run dev
```

The app should now be running locally on `localhost:3000`.

The website should be now be live and connected with the backend server and database.
