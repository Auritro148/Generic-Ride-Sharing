<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
}

body {
  margin: 0;
  background: #f4fbfd;
  font-family: Arial, sans-serif;
}

.app {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>