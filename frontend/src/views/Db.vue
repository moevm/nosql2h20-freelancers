<template>
  <div v-if="getLogin=='admin'">

    <h3 style="text-align:center;">База данных сервиса</h3>
    <b-col style="padding: 0 20%;">

      <a><b-button class="mb-3" variant="outline-primary" size="lg" @click="saveDb()">Скачать</b-button></a>
      <a><b-button variant="outline-primary" size="lg" @click="importDb()">Импортировать в сервис</b-button></a>
      <b-form-file v-model="file" id="input-file" accept=".json" v-show="false"></b-form-file>
    </b-col>

  </div>

  <div v-else>
    Только администратор может просматривать эту страницу.
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
export default {
  data: () => ({
    data: null,
    file: null
  }),
  created() {
    this.$api.getDb().then(({data}) => {
      this.data = data
    })
  },
  computed: {
    ...mapGetters(['getLogin'])
  },
  watch: {
    file() {
      const blob = new Blob([this.file], {type:"application/json"});
      const fr = new FileReader();
      fr.addEventListener("load", () => {
        this.$api.refreshDb(JSON.parse(fr.result))
      })
      fr.readAsText(blob);
    }
  },
  methods: {
    saveDb() {
      const blob = new Blob([JSON.stringify(this.data, null, 2)], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
      a.download = "db.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    importDb() {
      const e = document.createEvent('MouseEvents')
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      document.getElementById('input-file').dispatchEvent(e);
    }
  }
}
</script>

<style scoped>

a, button {
  display: block;
  width: 100%;
}
</style>