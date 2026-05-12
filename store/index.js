import { createStore } from 'vuex';
export default createStore({
  state: { gameScore: 0, difficultyLevel: 1 },
  mutations: {
    INCREMENT_SCORE(state) { state.gameScore++; },
    SET_DIFFICULTY(state, level) { state.difficultyLevel = level; }
  },
  actions: {
    addScore({ commit }) { commit('INCREMENT_SCORE'); },
    changeDifficulty({ commit }, level) { commit('SET_DIFFICULTY', level); }
  },
  getters: { currentScore: (state) => state.gameScore }
});
