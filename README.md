**Project Overview**
This project is a web-based application that allows users to interact with an AI assistant to get information about different countries. The frontend displays a list of countries with their relevant details such as capital, currency, and languages. The user can also initiate a chat with an AI assistant to ask for more detailed information about a specific country. The backend is powered by OpenAI's LLaMA model to generate AI responses based on user queries.

**Setup Instructions**
To set up the project locally, follow these steps:

1. Clone the repository
   git clone https://github.com/ilhanmaghriby/kuasar-project
   cd kuasar-project

2. Install dependencies
   For the frontend (React-based):
   cd client
   npm install
   For the backend (Express.js server):
   cd server
   npm install

3. Run the application
   For the frontend:
   cd client
   npm run dev
   For the backend:
   cd server
   node server.js
   The frontend will be available at http://localhost:5173, and the backend will be running at http://localhost:3000.

**Available Features**
Country List: Displays a list of countries with basic information such as name, capital, currency, and languages.
AI Interaction: Allows users to click on a country and ask the AI assistant for more detailed information about that country.
Responsive Design: The application is responsive and works well across different screen sizes.
Infinite Scrolling: You can choose to view all countries or limit the view to a few.

**Technical Decisions and Architecture**
Frontend: Built with React.js and Apollo Client for managing GraphQL queries. The frontend is styled using Tailwind CSS and AOS (Animate On Scroll) for animations.
Backend: The backend is built using Express.js and OpenAI’s API to handle AI responses. The server listens for POST requests on /generate, processes the input, and sends back an AI-generated response.
AI Model: We use OpenAI's meta/llama-3.1-405b-instruct model to generate responses to user queries.

**Future Improvements**
User Authentication: Implement user authentication to save user interactions and preferences.
Multi-Language Support: Enhance the app to support multiple languages for a broader audience.
Performance Optimizations: Refactor code for better performance, especially with large amounts of data.
Error Handling: Improve error handling for different edge cases and failures in both frontend and backend.
Enhanced AI Integration: Integrate additional AI models for more diverse and accurate responses.
Deployment: Deploy the app on cloud platforms like AWS or Heroku for live access.
