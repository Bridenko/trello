<template>
  <div class="popup minimal">
    <div class="popup-wrapper">
      <p class="text">Task title: {{ props.taskTitle }}</p>
      <v-divider class="my-2"></v-divider>
      <h4 class="title">Are you sure you want to delete this task ?</h4>
      <div class="d-flex justify-center mt-4">
        <v-btn class="px-2 icon-left mr-2" @click="confirmationEvent">
          Yes
        </v-btn>
        <v-btn class="px-2 icon-left" @click="closePopup">
          No
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
const props = defineProps({
  taskTitle: {
    type: String,
    required: false
  }
});

const emit = defineEmits(['close', 'submit']);

function closePopup() {
  emit('close');
}

function confirmationEvent() {
  emit('confirm');
}
</script>