<!-- <template>
    <router-view  />
</template>

<script>
export default {
  name: 'App',
};
</script> -->
<script setup>
import DefaultLayout from  "./layouts/DefaultLayout.vue";
import AdminLayout from "./layouts/AdminLayout.vue"
</script>

<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
export default {
  computed: {
    layout() {
      if (this.$route.meta.layout === "default") {
        return DefaultLayout;
      } else if (this.$route.meta.layout === "admin") {
        return AdminLayout;
      } else {
        // Default layout
        return DefaultLayout;
      }
    }
  }
};
</script>