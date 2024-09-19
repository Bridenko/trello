<template>
  <NuxtLayout>
    <v-app>
      <HeaderComponent />
      <v-main>
        <v-container fluid>
          <NuxtPage />
        </v-container>
      </v-main>
      <SvgArea />
    </v-app>
  </NuxtLayout>
</template>

<script setup lang="js">
import HeaderComponent from './layouts/HeaderComponent.vue';
import SvgArea from './components/SvgArea.vue';
</script>
