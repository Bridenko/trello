<template>
  <v-btn :to="{ name: pageName }" class="px-2 icon-left" density="comfortable">
    <svg class="svg-icon" v-if="props.showIcon && iconId">
      <use :xlink:href="iconId"></use>
    </svg>
    {{ props.routerText }}
  </v-btn>
</template>

<script setup lang="js">
const props = defineProps({
  pageName: {
    type: String,
    required: true
  },
  showIcon: {
    type: Boolean,
    required: true
  },
  routerText: {
    type: String,
    required: false
  },
  iconId: {
    type: String,
    required: false
  }
});
</script>

<style lang="scss">
.v-btn.icon-left .svg-icon {
  margin-right: 4px;
}

.v-btn--size-default {
  min-width: 24px !important;
}
</style>