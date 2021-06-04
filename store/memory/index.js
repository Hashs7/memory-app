import { getContent, emptyMemory } from '@/const/memory';

// Add memory store
export const state = () => ({
  data: { ...emptyMemory },
});

export const getters = {
  contents: (state) => state.data.contents,
};

export const mutations = {
  addContent(state, type) {
    console.log(getContent(type));
    state.data.contents.push(getContent(type));
  },

  updateName(state, value) {
    state.data.name = value;
  },

  updateDate(state, value) {
    state.data.date = value;
  },

  updateVisibility(state, value) {
    state.data.visibility = value;
  },

  setMemory(state, memory) {
    state.data = { ...memory };
  },

  updateContent(state, { index, value, file }) {
    if (value) {
      state.data.contents[index].content = value;
    }
    if (file) {
      state.data.contents[index].file = file;
    }
  },

  resetState(state) {
    state.data = { ...emptyMemory };
  },

  removeContent(state, index) {
    state.data.contents.splice(index, 1);
  },

  selectTheme(state, slug) {
    state.themes.forEach((t) => (t.selected = false));
    const theme = state.themes.find((t) => t.slug === slug);
    theme.selected = true;
  },
};

export const actions = {
  addSelectedMedia({ rootGetters, commit, dispatch }, index) {
    const selected = rootGetters['gallery/getLastSelected'];
    if (!selected) return;
    commit('updateContent', {
      index,
      file: selected,
    });
    commit('gallery/removeSelected', selected._id, { root: true });
  },
};
