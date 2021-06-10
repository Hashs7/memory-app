const emptyState = {
  user: [],
  old: [],
  wish: [],
};
// Add memory store
export const state = () => ({
  ...emptyState,
});

export const getters = {};

export const mutations = {
  updateInstruments(
    state,
    { userInstruments, oldInstruments, wishInstruments }
  ) {
    state.user = userInstruments;
    state.old = oldInstruments;
    state.wish = wishInstruments;
  },
};

export const actions = {
  async getUserInstruments({ commit }) {
    try {
      const res = await this.$api.getUserInstruments();
      commit('updateInstruments', res.data);
    } catch (e) {
      console.log(e);
    }
  },
};
