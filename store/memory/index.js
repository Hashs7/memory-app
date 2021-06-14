import { getContent, emptyMemory } from '@/const/memory';

// Add memory store
export const state = () => ({
  data: { ...emptyMemory },
});

export const getters = {
  contents: (state) => state.data.contents,
};

export const mutations = {
  addContent(state, { type, file }) {
    const id = Date.now();
    const content = {
      ...getContent(type),
      id,
      ...(file && { file }),
    };
    state.data.contents.push(content);
  },

  setContents(state, value) {
    state.data.contents = value;
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

  updatePreview(state, { file }) {
    if (file) {
      state.data.preview.file = file;
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
  addSelectedMedia({ rootGetters, commit, dispatch }, { hasIndex, index }) {
    const selected = rootGetters['gallery/getLastSelected'];
    if (!selected) return;
    if (hasIndex) {
      commit('updateContent', {
        index,
        file: selected,
      });
    } else {
      commit('updatePreview', {
        file: selected,
      });
    }
    commit('gallery/removeSelected', selected._id, { root: true });
  },

  addSelectedAudios({ rootGetters, commit }) {
    rootGetters['gallery/getSelected'].forEach((file) => {
      commit('addContent', {
        type: 'audio',
        file,
      });
    });
    commit('gallery/resetSelected', null, { root: true });
  },
};
