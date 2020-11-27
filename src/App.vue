<template>
<div id="app">
  <header-bar></header-bar>
  <router-view></router-view>
</div>
</template>

<script>

import HeaderBar from '@/components/HeaderBar'
export default {
  name: 'app',
  components: {
    HeaderBar
  }
}
</script>
<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none !important;
  cursor: pointer;
}

.task {
  margin-bottom: 10px;
  display: block;
  color: unset;
  padding: 5px;
  width: 100%;
}

.task:hover {
  color: unset ;
}

.jc-btw {
  display: flex;
  justify-content: space-between;
}

.task-price {
  color: white;
  background: #316C3A;
  border: 2px solid #316C3A;
  border-radius: 6px;
  padding: 2px 6px;
}

.container-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  margin-bottom: 15px;
  text-align: center;
}

.a-shadow{
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px;
  transition: .2s;
  
}

.a-shadow-hov:hover {
  transform: translateY(-1px);
  box-shadow: 2px 2px 5px 0px;
  cursor: pointer;
}
</style>