<template>
  <form ref="form" class="instrument-short-form">
    <div class="round-upload">
      <FileUpload ref="files" :label="false" />
    </div>

    <div class="form__group">
      <label>
        <input
          v-model="name"
          placeholder="Nom"
          class="form__input"
          name="name"
          type="text"
        />
      </label>
    </div>
    <div class="form__group">
      <label>
        <input
          v-model="type"
          placeholder="Type"
          class="form__input"
          name="type"
          type="text"
        />
      </label>
    </div>
    <div class="form__group">
      <label>
        <input
          v-model="specification"
          placeholder="Spécification"
          name="specification"
          class="form__input"
          type="text"
        />
      </label>
    </div>
    <div class="form__group">
      <label>
        <input
          v-model="brand"
          placeholder="Marque"
          class="form__input"
          name="brand"
          type="text"
          required
        />
      </label>
    </div>
  </form>
</template>

<script>
import FileUpload from '@/components/UI/FileUpload';

export default {
  name: 'InstrumentShortForm',
  components: {
    FileUpload,
  },
  data() {
    return {
      name: '',
      type: '',
      specification: '',
      brand: '',
    };
  },
  methods: {
    submit() {
      const formData = new FormData(this.$refs.form);
      if (this.$refs.files.dropFiles) {
        const file = this.$refs.files.dropFiles[0];
        formData.append('image', file);
      }
      return this.$api.newInstrument(formData);
    },
  },
};
</script>
