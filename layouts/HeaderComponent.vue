<template>
  <v-toolbar class="py-1 px-4" density="compact">
    <RouterLink pageName="index" :showIcon="false" routerText="My trello" />
    <RouterLink pageName="favorite" :showIcon="true" iconId="#icon-star" />
    <RouterLink pageName="private" :showIcon="true" iconId="#icon-users" />
    <RouterLink pageName="board" :showIcon="true" iconId="#icon-dashboard" routerText="Board" />
    <DropMenu />
  </v-toolbar>
</template>

<script setup lang="js">
import RouterLink from './components/RouterLink.vue';
import DropMenu from './components/DropMenu.vue';
</script>

<style lang="scss">
header {
  .v-btn {
    margin-right: 5px;

    &:last-child {
      margin-right: 0;
    }

    @media (max-width:767px) {
      padding: 0 4px !important;
    }
  }
}
</style>
