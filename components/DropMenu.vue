<template>
  <v-menu transition="slide-y-transition">
    <template v-slot:activator="{ props }">
      <v-btn class="pa-0" color="black" v-bind="props" density="comfortable">
        <svg class="svg-icon">
          <use xlink:href="#icon-down"></use>
        </svg>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, i) in menuItems" :key="i">
        <a href="#!">{{ item.title }}</a>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="js">
const menuItems = [
  { title: 'Link' },
  { title: 'Link two' },
];
</script>