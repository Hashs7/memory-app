export const state = () => ({
  token: null,
  senderToken: null,
  instrumentId: null,
  date: null,
});

export const getters = {
  pendingHandover(state) {
    return state.token && state.instrumentId;
  },
};

export const mutations = {
  setDate(state, value) {
    state.date = value;
  },
  setToken(state, value) {
    state.token = value;
  },
  setSenderToken(state, value) {
    state.senderToken = value;
  },
  setInstrumentId(state, value) {
    state.instrumentId = value;
  },
};

export const actions = {};
