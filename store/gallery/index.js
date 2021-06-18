export const state = () => ({
  medias: [],
  selected: {
    audio: [],
    media: [],
  },
  preview: null,
});

export const getters = {
  getPreview(state) {
    if (!state.preview) return;
    return state.medias.find((m) => m._id === state.preview);
  },

  getSelected: (state) => (type) => {
    return state.medias.filter((m) => state.selected[type].includes(m._id));
  },

  getLastSelected(state) {
    if (!state.selected.media[0]) return;
    return state.medias.find((m) => m._id === state.selected.media[0]);
  },

  getAudios(state) {
    return state.medias.filter((m) => m.mimetype.split('/')[0] === 'audio');
  },

  getLastAudio(state) {
    return state.medias[state.medias.length - 1];
  },

  getImgAndVideos(state) {
    return state.medias.filter((m) => m.mimetype.split('/')[0] !== 'audio');
  },
};

export const mutations = {
  setMedias(state, value) {
    state.medias = value;
  },

  addMedia(state, media) {
    state.medias.push(media);
  },

  updateMedia(state, media) {
    const index = state.medias.findIndex((file) => file._id === media._id);
    if (index < 0) return;
    state.medias.splice(index, 1, media);
  },

  removeMedia(state, _id) {
    const index = state.medias.findIndex((img) => img._id === _id);
    if (index < 0) return;
    state.medias.splice(index, 1);
  },

  resetSelected(state) {
    state.selected = {
      audio: [],
      media: [],
    };
  },

  addSelectedMedia(state, media) {
    state.selected.media.push(media);
  },

  addSelectedAudio(state, media) {
    state.selected.audio.push(media);
  },

  setPreview(state, id) {
    state.preview = id;
  },

  removeSelected(state, { id, type }) {
    const index = state.selected[type].indexOf(id);
    state.selected[type].splice(index, 1);
  },
};

export const actions = {
  async getMedias({ commit }) {
    try {
      const res = await this.$api.getUserMedias();
      commit('setMedias', res.data);
    } catch (e) {}
  },

  async updateMedia({ commit }, { id, name }) {
    try {
      const res = await this.$api.updateFileName(id, name);
      commit('updateMedia', res.data);
    } catch (e) {}
  },

  async deleteMedia({ commit }, id) {
    try {
      await this.$api.deleteMedia(id);
      commit('removeMedia', id);
    } catch (e) {}
  },
};
