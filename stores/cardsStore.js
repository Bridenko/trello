import {
  defineStore
} from 'pinia';

export const useCardsStore = defineStore('cards', {
  state: () => {
    return {
      cardsData: []
    }
  },
  actions: {
    getCardsData() {
      const storageCardData = JSON.parse(localStorage.getItem('storage-cards'));

      if (storageCardData === null) {
        const cardsArray = [{
            "id": 1,
            "statusName": "TODO",
            "showAddField": false,
            "tasks": [{
                "title": "task - 1",
                "priority": "Low",
                "status": "TODO"
              },
              {
                "title": "task - 2",
                "priority": "Medium",
                "status": "TODO"
              },
              {
                "title": "task - 3",
                "priority": "High",
                "status": "TODO"
              }
            ]
          },
          {
            "id": 2,
            "statusName": "In progress",
            "showAddField": false,
            "tasks": [{
                "title": "task - 4",
                "priority": "High",
                "status": "In progress",
                "desc": "123"
              },
              {
                "title": "task - 5",
                "priority": "Medium",
                "status": "In progress"
              },
              {
                "title": "task - 6",
                "priority": "Low",
                "status": "In progress"
              }
            ]
          },
          {
            "id": 3,
            "statusName": "Done",
            "showAddField": false,
            "tasks": [{
                "title": "task - 8",
                "priority": "Medium",
                "status": "Done"
              },
              {
                "title": "task - 7",
                "priority": "Medium",
                "status": "Done"
              },
              {
                "title": "task - 9",
                "priority": "High",
                "status": "Done"
              }
            ]
          }
        ]

        localStorage.setItem('storage-cards', JSON.stringify(cardsArray));

        this.cardsData = cardsArray;
      } else {
        this.cardsData = storageCardData;
      }
    },
    updateCardsData(newCardsData) {
      localStorage.setItem('storage-cards', JSON.stringify(newCardsData));
      this.cardsData = newCardsData;
    }
  },
});