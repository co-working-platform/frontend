<template>
  <div>
    <v-sheet
      tile
      height="54"
      class="d-flex"
    >
      <v-btn
        outlined
        class="mr-4"
        color="grey darken-2"
        @click="setToday"
      >
        {{ $t('today') }}
      </v-btn>
      <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.prev()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select
        v-model="type"
        :items="types"
        dense
        outlined
        hide-details
        class="ma-2"
        label="type"
      />
      <!-- <v-select
          v-model="mode"
          :items="modes"
          dense
          outlined
          hide-details
          label="event-overlap-mode"
          class="ma-2"
        /> -->
      <v-select
        v-model="weekday"
        :items="weekdays"
        dense
        outlined
        hide-details
        :label="$t('weekdays')"
        class="ma-2"
      />
      <v-spacer />
      <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.next()"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="focus"
        :weekdays="weekday"
        :type="type"
        :events="events"
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
        @change="getEvents"
      />
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card
          v-if="selectedOpen"
          min-width="350px"
          flat
        >
          <v-toolbar
            :color="selectedEvent.color"
            dark
          >
            <v-toolbar-title v-html="selectedEvent.name" />
          </v-toolbar>

          <v-text-field
            v-model="eventDate"
            label="Date:"
            prepend-icon="mdi-calendar"
            readonly
          />
          <v-text-field
            v-model="eventStartTime"
            :label="$t('start')"
            prepend-icon="mdi-time"
            readonly
          />
          <v-text-field
            v-model="eventEndTime"
            :label="$t('end')"
            prepend-icon="mdi-time"
            readonly
          />

          <v-card-actions>
            <v-btn
              text
              color="secondary"
              @click="selectedOpen = false"
            >
              {{ $t('close') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data: () => ({
    type: 'month',
    types: ['month', 'week', 'day', '4day'],
    mode: 'column',
    modes: ['stack', 'column'],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    weekdays: [
      { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
      { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
      { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
      { text: 'Mon, Wed, Fri', value: [1, 3, 5] }
    ],
    focus: '',
    eventsForUser: [],
    events: [],
    valid: false,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,

    eventDate: '',
    eventStartTime: '',
    eventEndTime: '',

    show: false,
    formdata: null
  }),

  /**
   * Mounted method is called every time the page reloads.
   */
  mounted () {
    this.getOneTimeEventsForUser()
  },

  methods: {
    /**
     * Opens the day view of the calendar.
     * @param date
     */
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },

    /**
     * Sets the color of the event in the calendar to
     * the color the event has on the backend.
     * @param event the event selected
     * @returns { the color of the event }
     */
    getEventColor (event) {
      return event.color
    },

    /**
     * TODO why is it empty?
     */
    setToday () {
      this.focus = ''
    },

    /**
     * TODO
     * @param nativeEvent
     * @param event
     */
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        this.eventDate = this.selectedEvent.start.split('T')[0]
        this.eventStartTime = this.selectedEvent.start.split('T')[1].split(':')[0] + ':' + this.selectedEvent.start.split('T')[1].split(':')[1]
        this.eventEndTime = this.selectedEvent.end.split('T')[1].split(':')[0] + ':' + this.selectedEvent.end.split('T')[1].split(':')[1]
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen))
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },

    /**
     * Gets all events from a specified employee
     * to display in the planning calendar.
     */
    getEvents () {
      this.events = []
      this.eventsForUser.forEach((el) => {
        this.events.push({
          id: el.id,
          emp_id: el.employee.id,
          event_type: el.eventType.id,
          name: el.eventType.name,
          start: el.startTime,
          end: el.endTime,
          color: el.eventType.color,
          timed: false
        })
      })
    },

    /**
     * GET request to get all events for the authenticated user.
     */
    getOneTimeEventsForUser () {
      const employeeId = this.$auth.user.id
      axios.get('http://212.227.210.204:8765/get_one_time_events/' + employeeId, {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.eventsForUser = response.data
        this.getEvents()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('in catch: ' + JSON.stringify(response.data.errors))
      })
    }
  }
}
</script>

<style scoped>

.time {
    color:black;
    font-size: 17px;
}

.toolbar_buttons {
  margin-top: 14px;
}

</style>

}
</script>
