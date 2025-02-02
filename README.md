# Country Insight

## Project Overview

Country Insight is a web-based application that allows users to interact with an AI assistant to get information about various countries. The frontend displays a list of countries along with details such as capitals, currencies, and languages. Users can also start a conversation with the AI assistant to learn more about a specific country. The backend uses the LLaMA model from OpenAI to generate AI responses based on user queries.

## Setup Instructions

To run this project locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/ilhanmaghriby/country-insight
cd country-insight
```

### 2. Install dependencies

#### Frontend (React.js):

```bash
cd client
npm install
```

#### Backend (Express.js):

```bash
cd server
npm install
```

### 3. Run the Application

#### Run the Frontend:

```bash
cd client
npm run dev
```

#### Run the Backend:

```bash
cd server
node server.js
```

The frontend application will be available at `http://localhost:5173`, while the backend will run at `http://localhost:3000`.

## Available Features

- **Country List**: Displays a list of countries with basic information such as name, capital, currency, language, and continent.
- **AI Interaction**: Users can click on a country and ask the AI assistant for more detailed information.
- **Responsive Design**: The application is designed to adapt to various screen sizes.
- **Infinite Scrolling**: Option to view all countries or limit the display as needed.

## Technologies Used

- **Frontend**: Built with React.js, Vite for fast development and bundling, and Apollo Client for GraphQL management. Styling is done with Tailwind CSS, and animations are powered by AOS (Animate On Scroll).
- **Backend**: Uses Express.js with OpenAI integration to generate AI responses.
- **AI Model**: Utilizes the `meta/llama-3.1-405b-instruct` model from OpenAI to answer user queries.

## Future Development and Improvements

- **User Authentication**: Implement login/logout functionality to store user interactions.
- **Multi-Language Support**: Allow users to select the display language.
- **Performance Optimization**: Improve data processing efficiency for better performance.
- **Better Error Handling**: More robust error handling for different cases.
- **Advanced AI Integration**: Add additional AI models for more accurate responses.
- **Cloud Deployment**: Deploy the application on a cloud platform like AWS or Heroku for public access.

---
