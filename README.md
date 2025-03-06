# Deployment Guideline for Heucard-Admin

This document provides instructions on how to set up and deploy the **heucard-admin** project.

## Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation
Clone the repository and navigate to the project folder:
```sh
git clone <repository_url>
cd heucard-admin
```

Install dependencies:
```sh
npm install
```

## Environment Configuration
Before running the application, create a `.env` file in the root directory and add the following content:
```env
BASE_URL=....
```
Replace `....` with the actual base URL of your Laravel API.

## Running the Application
After setting up the `.env` file, start the application using the following command:
```sh
npm run start
```
This will launch the application in development mode.

