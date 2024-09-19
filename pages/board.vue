<template>
  <div>
    <div class="cards">
      <div class="card" v-for="(card, cardIndex) in cardsData" :key="cardIndex">
        <div class="card-head">
          <h4 class="title mb-2">{{ card.statusName }}</h4>
        </div>
        <ul class="tasks" @dragover="onDragCardOver($event, card)" @dragleave="onCardDragLeave($event)"
          @drop="onCardDrop($event, card)">
          <li v-for="(task, taskIndex) in card.tasks" :key="taskIndex"
            @dragstart="onDragStart($event, task, taskIndex, card.id)" @dragover="onDragOver($event, taskIndex, card)"
            @dragleave="onDragLeave($event)" @drop="onDrop($event, card, taskIndex)" class="mb-2 task" draggable="true">
            <span class="button" @click="openEditPopup(card.id, taskIndex)" :class="{
        'low-status': task.priority === 'Low',
        'medium-status': task.priority === 'Medium',
        'high-status': task.priority === 'High',
      }">
              {{ task.title }}
              <span class="d-flex align-center ml-1">
                <svg class="svg-icon flex-0-0">
                  <use xlink:href="#icon-edit"></use>
                </svg>
              </span>
            </span>
            <span class="delete-task">
              <span @click="getDataForDelete(card.id, taskIndex, task.title)" class="delete-task__button">
                <svg class="svg-icon">
                  <use xlink:href="#icon-delete"></use>
                </svg>
              </span>
            </span>
          </li>
        </ul>
        <div v-if="!card.showAddField" class="button custom" @click="showTaskField(card)">
          <svg class="svg-icon">
            <use xlink:href="#icon-plus"></use>
          </svg>
          Add new task
        </div>
        <div v-if="card.showAddField" class="add-task">
          <v-text-field v-model="taskName" @keyup.enter="createTask(card)" autofocus focused class="mb-0"
            label="Enter task title" variant="solo-filled" density="comfortable" hide-details></v-text-field>
          <div class="d-flex justify-end mt-2">
            <v-btn @click="createTask(card); card.showAddField = false;" class="px-2 icon-left mr-2">
              Save
            </v-btn>
            <v-btn @click="card.showAddField = false; taskName = '';" class="px-2 icon-left">
              Cancel
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <transition name="popup">
      <EditPopup v-show="showEditPopup" :showEditPopup="showEditPopup" @close="closePopup('edit')"
        @editInfo="editCardsData" :statuses="statuses" :taskData="currentTask" />
    </transition>
    <transition name="popup">
      <DeletePopup v-show="showDeletePopup" @close="closePopup('delete')" @confirm="deleteTask"
        :taskTitle="currentTaskTitle" />
    </transition>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted, watch } from 'vue';
import { useCardsStore } from '@/stores/cardsStore';
import EditPopup from './components/EditPopup.vue';
import DeletePopup from './components/PopupConfirmation.vue';

const store = useCardsStore();

const statuses = ['TODO', 'In progress', 'Done'],
  showEditPopup = ref(false),
  showDeletePopup = ref(false),
  taskName = ref(''),
  cardsData = ref([]);

const currentCardId = ref(null),
  currentTaskIndex = ref(null),
  currentTaskTitle = ref(''),
  currentTask = ref({});

const draggedObject = ref({}),
  draggedObjectIndex = ref(null),
  draggedObjectCardId = ref(null),
  droppedObjectIndex = ref(null),
  droppedObjectCardId = ref(null),
  droppedObjectCardStatus = ref('');

let startElement;

watch(() => store.cardsData, (newValue) => {
  cardsData.value = newValue;
}, { deep: true });

onMounted(() => {
  store.getCardsData();
});

function showTaskField(card) {
  const cardIndex = cardsData.value.findIndex(c => c.id === card.id);
  cardsData.value.forEach(c => {
    c.showAddField = false;
  });
  cardsData.value[cardIndex].showAddField = true;
  store.updateCardsData(cardsData.value);
}

function createTask(card) {
  const cardIndex = cardsData.value.findIndex(c => c.id === card.id);

  if (taskName.value.length !== 0) {

    const taskData = {
      title: taskName.value,
      priority: 'Low',
      status: card.statusName,
    }

    if (cardIndex !== -1) {
      cardsData.value[cardIndex].tasks.push(taskData);
    }

    taskName.value = '';
  } else {
    if (cardIndex !== -1) {
      cardsData.value[cardIndex].showAddField = false;
    }
  }

  store.updateCardsData(cardsData.value);
}

function getDataForDelete(cardId, taskIndex, taskTitle) {
  showDeletePopup.value = true;

  currentCardId.value = cardId;
  currentTaskIndex.value = taskIndex;
  currentTaskTitle.value = taskTitle;
}

function deleteTask() {
  const card = cardsData.value.find(item => item.id === currentCardId.value);
  card.tasks.splice(currentTaskIndex.value, 1);

  store.updateCardsData(cardsData.value);

  currentCardId.value = null;
  currentTaskIndex.value = null;
  showDeletePopup.value = false;
}

function openEditPopup(cardId, taskIndex) {
  showEditPopup.value = true;

  currentCardId.value = cardId;
  currentTaskIndex.value = taskIndex;

  const card = cardsData.value.find(item => item.id === cardId);

  currentTask.value = card.tasks[taskIndex];
}

function editCardsData(updatedTask) {
  const card = cardsData.value.find(item => item.id === currentCardId.value);
  card.tasks[currentTaskIndex.value] = updatedTask;

  for (let index = 0; index < cardsData.value.length; index++) {
    const obj = cardsData.value[index];
    const remainingTasks = obj.tasks.filter(task => task.status === obj.statusName);

    obj.tasks.forEach(task => {
      if (task.status !== obj.statusName) {
        const targetObj = cardsData.value.find(item => item.statusName === task.status);
        if (targetObj) {
          targetObj.tasks.push(task);
        }
      }
    });

    obj.tasks = remainingTasks;
  }

  store.updateCardsData(cardsData.value);
  showEditPopup.value = false;
}

function closePopup(popupName) {
  if (popupName === 'edit') {
    showEditPopup.value = false;
  } else if (popupName === 'delete') {
    showDeletePopup.value = false;
  }
}

function onDragStart(event, task, taskIndex, cardId) {
  draggedObject.value = task;
  draggedObjectIndex.value = taskIndex;
  draggedObjectCardId.value = cardId;
  startElement = event.target.closest('.task');
}

function onDragOver(event, taskIndex, card) {
  event.preventDefault();
  droppedObjectIndex.value = taskIndex;
  droppedObjectCardId.value = card.id;
  droppedObjectCardStatus.value = card.statusName;

  const taskElement = event.target.closest('.task');
  if (taskElement !== startElement) {
    taskElement.classList.add('opacity');
  }
}

function onDragCardOver(event, card) {
  event.preventDefault();
  droppedObjectCardId.value = card.id;
  droppedObjectCardStatus.value = card.statusName;

  if (card.tasks.length === 0) {
    const taskElement = event.target.closest('.tasks');
    if (taskElement) {
      taskElement.classList.add('opacity');
    }
  }
}

function onDragLeave(event) {
  const taskElement = event.target.closest('.task');
  if (taskElement) {
    taskElement.classList.remove('opacity');
  }
}

function onCardDragLeave(event) {
  const taskElement = event.target.closest('.tasks');
  if (taskElement) {
    taskElement.classList.remove('opacity');
  }
}

function onDrop(event, card, taskIndex) {
  const draggedCard = cardsData.value.find(item => item.id === draggedObjectCardId.value);
  const taskElement = event.target.closest('.task');
  if (taskElement) {
    taskElement.classList.remove('opacity');
  }

  if (draggedObjectCardId.value !== droppedObjectCardId.value) {
    const currentCard = cardsData.value.find(item => item.id === droppedObjectCardId.value);

    draggedObject.value.status = droppedObjectCardStatus.value;
    currentCard.tasks.splice(droppedObjectIndex.value, 0, draggedObject.value);
    draggedCard.tasks.splice(draggedObjectIndex.value, 1);
    store.updateCardsData(cardsData.value);

  } else if (draggedObjectCardId.value === droppedObjectCardId.value) {
    const currentTaskData = { ...card.tasks[draggedObjectIndex.value] };

    card.tasks.splice(draggedObjectIndex.value, 1);
    card.tasks.splice(taskIndex, 0, currentTaskData);
    store.updateCardsData(cardsData.value);
  }
}

function onCardDrop(event, card) {
  const draggedCard = cardsData.value.find(item => item.id === draggedObjectCardId.value);
  const taskElement = event.target.closest('.tasks');
  if (taskElement) {
    taskElement.classList.remove('opacity');
  }

  if (draggedObjectCardId.value !== droppedObjectCardId.value && card.tasks.length === 0) {
    const currentCard = cardsData.value.find(item => item.id === droppedObjectCardId.value);

    draggedObject.value.status = droppedObjectCardStatus.value;
    currentCard.tasks.splice(droppedObjectIndex.value, 0, draggedObject.value);
    draggedCard.tasks.splice(draggedObjectIndex.value, 1);
    store.updateCardsData(cardsData.value);
  }
}
</script>

<style lang="scss">
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: flex-start;
  grid-gap: 10px;
  max-width: 70%;

  @media (max-width:1024px) {
    max-width: 100%;
  }

  @media (max-width:767px) {
    grid-template-columns: none;
  }
}

.card {
  padding: 10px;

  border-radius: 6px;
  background-color: #041D36;
  box-shadow: 0 0 15px #4989a152;
}

.tasks {
  min-height: 42px;
  margin-bottom: 0;
  border-radius: 4px;

  &.opacity {
    min-height: 34px;
    margin-bottom: 8px;
    background-color: grey;
  }

  li {
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 3px;

    transition: opacity 0.1s ease;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: calc(100% - 30px);
      height: 100%;
      border-radius: 3px;
      background-color: grey;

      opacity: 0;
      visibility: hidden;
      pointer-events: none;

      transition: opacity 0.1s ease;
    }

    &.opacity {
      opacity: 0.5;

      &::before {
        content: '';
        opacity: 1;
        visibility: visible;
      }
    }

    .button {
      overflow-wrap: anywhere;
      padding: 5px 10px 5px 16px;
      background-color: #dedede;

      &.low-status,
      &.medium-status,
      &.high-status {
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;

          width: 8px;
          height: 100%;
          border-radius: 3px 0 0 3px;
        }
      }

      &.low-status {
        &::before {
          content: '';
          background-color: #a5a5a5;
        }
      }

      &.medium-status {
        &::before {
          content: '';
          background-color: #6bc4e5;
        }
      }

      &.high-status {
        &::before {
          content: '';
          background-color: #E2816D;
        }
      }
    }

  }

  .delete-task {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    margin-left: 5px;

    padding: 0;
    height: 34px;

    border-radius: 3px;

    transition: background-color 0.2s ease;
    cursor: pointer;

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0;
    }

    @media (min-width: 1025px) {
      &:hover {
        background-color: #E2816D;
      }
    }

  }
}

.add-task {
  padding: 10px;
  border-radius: 6px;
  background-color: #6ECDF0;

  .v-field--variant-solo,
  .v-field--variant-solo-filled {
    background: #041D36 !important;
  }

  .v-field--variant-solo-filled .v-field__overlay {
    opacity: 0 !important;
  }

  .v-field * {
    color: white !important;
  }
}

.button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 5px 10px;

  border-radius: 3px;
  background-color: #6ECDF0;
  color: black !important;

  transition: background-color 0.2s ease;
  cursor: pointer;

  .svg-icon {
    flex: 0 0 auto;
    opacity: 0;
    margin-left: 10px;

    transition: opacity 0.2s ease;
  }

  &.custom {
    justify-content: inherit;

    color: white !important;
    background-color: transparent;

    .svg-icon {
      opacity: 1;
      margin-left: inherit;
      margin-right: 5px;
    }
  }

  @media (min-width: 1025px) {
    &:hover {
      background-color: #F1EBAC;

      .svg-icon {
        opacity: 1;
      }

      &.custom {
        background-color: #E2816D;
      }
    }
  }

}
</style>