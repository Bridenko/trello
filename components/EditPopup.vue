<template>
  <div class="popup">
    <div class="popup-wrapper">
      <h4 class="title">Edit task</h4>
      <v-text-field v-model="localTaskData.title" class="mb-2" label="Task title" variant="solo-filled"
        density="comfortable" hide-details></v-text-field>
      <v-text-field v-model="localTaskData.desc" class="mb-2" label="Task description" variant="solo-filled"
        density="comfortable" hide-details></v-text-field>
      <v-select v-model="localTaskData.respPerson" class="mb-2" :items="responsiblePerson" label="Responsible person"
        chips multiple variant="solo-filled" density="comfortable" hide-details></v-select>
      <v-select v-model="localTaskData.implementers" class="mb-2" :items="implementers" label="Implementers" chips
        multiple variant="solo-filled" density="comfortable" hide-details></v-select>
      <div class="d-flex mb-2">
        <v-select v-model="localTaskData.status" class="mr-2 w-50" label="Status" :items="props.statuses"
          variant="solo-filled" density="comfortable" hide-details></v-select>
        <v-select v-model="localTaskData.priority" class="w-50" label="Priority" :items="priority" variant="solo-filled"
          density="comfortable" hide-details></v-select>
      </div>
      <div v-if="showError" class="form-error">{{ errorText }}</div>
      <div class="d-flex justify-end mt-4">
        <v-btn class="px-2 icon-left mr-2" @click="editData">
          Save
        </v-btn>
        <v-btn class="px-2 icon-left" @click="closePopup">
          Cancel
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  statuses: {
    type: Array,
    required: true
  },
  taskData: {
    type: Object,
    required: true
  },
  showEditPopup: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'editInfo']);

const priority = ['Low', 'Medium', 'High'],
  responsiblePerson = ['Igor', 'Anatolii', 'Oleg'],
  implementers = ['Igor', 'Anatolii', 'Oleg'];

const localTaskData = ref({ ...props.taskData }),
  errorText = ref(''),
  showError = ref(false);

watch(() => props.taskData, (newValue) => {
  localTaskData.value = { ...newValue };
}, { deep: true });

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

function closePopup() {
  emit('close');
}

function editData() {
  if (localTaskData.value.title.length === 0) {
    errorText.value = 'Task title cannot be empty. Please fill in this field.';
    showError.value = true;
  } else {
    errorText.value = '';
    showError.value = false;
    emit('editInfo', localTaskData.value);
  }
}

function handleKeydown(event) {
  if (event.key === 'Enter' && props.showEditPopup) {
    editData();
  }
}
</script>

<style lang="scss">
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.7);

  &.minimal {
    .popup-wrapper {
      max-width: 300px;
    }
  }

  &-wrapper {
    max-width: 50%;
    width: 100%;
    margin: 0 auto;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    padding: 20px;
    border-radius: 6px;

    background-color: #6ECDF0;
  }


  .title {
    font-weight: 500;
    text-align: center;
    margin-bottom: 10px;
    font-size: 22px;
    color: black !important;
  }

  .text {
    overflow-wrap: anywhere;
    font-size: 16px;
    text-align: center;
    color: rgb(61, 61, 61) !important;
  }
}

.form-error {
  padding: 10px;

  background-color: #E2816D;
  border-radius: 4px;

  text-align: center;
  color: black !important;
  font-weight: 500;
}
</style>