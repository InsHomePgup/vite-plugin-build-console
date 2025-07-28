<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />

<!--  <div class="plugin-info">-->
<!--    <h2>Vite Plugin Build Console</h2>-->
<!--    <p>这是一个用于测试 vite-plugin-build-console 插件的 playground。</p>-->
<!--    <p>请运行 <code>pnpm build</code> 来查看插件的输出效果。</p>-->
<!--    <p>环境变量示例：</p>-->
<!--    <ul>-->
<!--      <li>VITE_APP_TITLE: {{ import.meta.env.VITE_APP_TITLE }}</li>-->
<!--      <li>VITE_API_URL: {{ import.meta.env.VITE_API_URL }}</li>-->
<!--    </ul>-->
<!--  </div>-->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.plugin-info {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: left;
}
</style>
