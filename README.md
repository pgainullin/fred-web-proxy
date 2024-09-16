# St. Louis FRED Economic Data Web Proxy

A Firebase Cloud Function that acts as a web proxy to access the [St. Louis Federal Reserve Economic Data (FRED) API](https://fred.stlouisfed.org/).

## Overview

This project provides a serverless solution to proxy requests to the St. Louis FRED API, enabling secure and controlled access to economic data. Built with Node.js and Firebase Cloud Functions, it simplifies the process of fetching economic data for your applications.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)
- [Contact](#contact)

## Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (Node Package Manager)
- **Firebase CLI**: Install globally using `npm install -g firebase-tools`
- A **Firebase Project**: Create one at [Firebase Console](https://console.firebase.google.com/)
- An **API Key** for the [St. Louis FRED API](https://fred.stlouisfed.org/docs/api/fred/)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/pgainullin/fred-web-proxy.git
   cd your-repo-name
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

## Configuration

### Firebase Setup

1. **Login to Firebase**

   ```bash
   firebase login
   ```

2. **Initialize Firebase in the Project**

   ```bash
   firebase init
   ```

   - **Select Features**: Use the spacebar to select **Functions** and press Enter.
   - **Project Setup**: Choose your existing Firebase project or create a new one.
   - **Language Selection**: Select **JavaScript**.
   - **ESLint**: Choose whether to enable linting with ESLint.
   - **Install Dependencies**: When prompted, select **Yes** to install dependencies.

### Environment Variables

1. **Set Firebase Function Configuration**

Note down your FRED API Key and add it to Firebase Secrets:

   ```bash
   firebase functions:secrets:set FRED_KEY
   ```
Make sure you copy the key carefully as it is easy to make a mistake in the CLI here.

2. [Optional] **Set up Local Secrets for Testing**

Add a `.secrets.local` file to the `functions` folder:

```bash
# functions/.secret.local
FRED_KEY=[your FRED API Key]
```

## Usage

### Running Locally

1. **Start the Firebase Emulator**

   ```bash
   firebase emulators:start
   ```

2. **Access the Function**

   The function will be available at:

   ```
   http://localhost:5001/your-project-id/your-region/yourFunctionName
   ```

### Making Requests

- Requests can be made through the standard Firebase Functions Callable API: https://firebase.google.com/docs/functions/callable?gen=2nd.

## Deployment

1. **Deploy to Firebase**

   ```bash
   firebase deploy --only functions
   ```

2. **Access the Deployed Function**

   The live function URL will be displayed in your Firebase Console.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

2. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**

4. **Commit Your Changes**

   ```bash
   git commit -m "Description of your changes"
   ```

5. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**

## License

This project is licensed under the [Apache 2.0 license](LICENSE).

## Credits

- **Rust-based proxy server**: [stlouisfed-fred-web-proxy](https://github.com/proprietary/stlouisfed-fred-web-proxy) by [proprietary](https://github.com/proprietary)
- **Node.js Translation**: Initial translation to Node.js by OpenAI's GPT-4o and this document by o1-preview.

## About the St. Louis FRED API

The [Federal Reserve Economic Data (FRED) API](https://fred.stlouisfed.org/docs/api/fred/) provides access to a wealth of economic data, including US and international macroeconomic data.

## Contact

For questions or support, please open an issue or contact the maintainer at [info@palm83.com].


