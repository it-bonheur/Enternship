import axios from 'axios';

// Using JSONPlaceholder as a mock backend for the activity
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const gameService = {
  /**
   * POST: Sends the player's name and score to the server.
   * Linked to Activity 2.5 (Axios POST) and Activity 8 (uses Vuex score).
   */
  async submitHighScore(playerName, score) {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, {
        title: playerName, // Sending name as title for the mock API
        body: score,      // Sending the Vuex score as body
        userId: 1,
      });
      console.log('API Response (Success):', response.data);
      return response.data;
    } catch (error) {
      console.error('Error posting score to API:', error);
      throw error;
    }
  },

  /**
   * GET: Retrieves a list of scores to display on the leaderboard.
   * Linked to Activity 2.5 (Axios GET).
   */
  async fetchHighScores() {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts?_limit=5`);
      console.log('Fetched High Scores:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching scores from API:', error);
      return []; // Return empty array so the app doesn't crash
    }
  }
};
