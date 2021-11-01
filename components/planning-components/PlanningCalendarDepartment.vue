<template>
  <v-card>
    <div>
      <v-row>
        <v-col
          cols="2"
        >
          <v-menu
            :close-on-content-click="false"
            offset-x
          >
            <template #activator="{ on, attrs }">
              <v-btn
                class="ml-5 mt-5"
                v-bind="attrs"
                v-on="on"
                @click="showCreateEvent = true"
              >
                <v-icon>
                  mdi-plus
                </v-icon>
              </v-btn>
            </template>
            <v-card
              v-if="showCreateEvent"
              min-width="350px"
              flat
            >
              <v-toolbar
                :color="'green'"
                dark
              >
                <v-btn icon>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-toolbar-title>{{ $t('createNewEvent') }}</v-toolbar-title>
                <v-spacer />
              </v-toolbar>

              <v-autocomplete
                v-model="eventType"
                class="ml-3 mr-3"
                :items="eventTypesExceptHoliday.map(element => element.name)"
                :rules="[v => !!v || 'Event type is required']"
                :label="$t('eventType')"
                persistent-hint
                required
              />
              <v-dialog
                ref="dialogNewDate"
                v-model="dialogNewDate"
                :return-value.sync="datePicker"
                persistent
                width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="datePicker"
                    class="ml-3 mr-3"
                    label="Date:"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="datePicker"
                  class="ml-3 mr-3"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="dialogNewDate = false"
                  >
                    {{ $t('cancel') }}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialogNewDate.save(datePicker)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
              <v-dialog
                ref="dialogNewStartTime"
                v-model="dialogNewStartTime"
                :return-value.sync="start"
                persistent
                width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="start"
                    class="ml-3 mr-3"
                    :label="$t('start')"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-model="start"
                  :max="end"
                  format="24hr"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="dialogNewStartTime = false"
                  >
                    {{ $t('cancel') }}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialogNewStartTime.save(start)"
                  >
                    OK
                  </v-btn>
                </v-time-picker>
              </v-dialog>
              <v-dialog
                ref="dialogNewEndTime"
                v-model="dialogNewEndTime"
                :return-value.sync="end"
                persistent
                width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="end"
                    class="ml-3 mr-3"
                    :label="$t('end')"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-model="end"
                  :min="start"
                  format="24hr"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="dialogNewEndTime = false"
                  >
                    {{ $t('cancel') }}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialogNewEndTime.save(end)"
                  >
                    OK
                  </v-btn>
                </v-time-picker>
              </v-dialog>
              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="showCreateEvent = false"
                >
                  {{ $t('cancel') }}
                </v-btn>
                <v-btn
                  text
                  color="secondary"
                  @click="addEvent"
                >
                  {{ $t('save') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-col>

        <v-col
          cols="2"
        >
          <v-menu
            :close-on-content-click="false"
            offset-x
          >
            <template #activator="{ on, attrs }">
              <v-btn
                class="mt-5"
                v-bind="attrs"
                v-on="on"
                @click="showCopy = true"
              >
                <v-icon
                  style="padding-right: 5px"
                >
                  mdi-content-duplicate
                </v-icon>
                {{ $t('copy') }}
              </v-btn>
            </template>
            <v-card
              v-if="showCopy"
              min-width="350px"
              flat
            >
              <v-toolbar
                :color="'green'"
                dark
              >
                <v-btn icon>
                  <v-icon>mdi-content-duplicate</v-icon>
                </v-btn>
                <v-toolbar-title>{{ $t('copyEvents') }}</v-toolbar-title>
                <v-spacer />
              </v-toolbar>

              <v-dialog
                ref="dialogCopyDate"
                v-model="dialogCopyDate"
                :return-value.sync="rangeCopyDates"
                persistent
                width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateRangeText"
                    class="ml-3 mr-3"
                    :label="$t('copyDates')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="rangeCopyDates"
                  range
                  no-title
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="dialogCopyDate = false"
                  >
                    {{ $t('cancel') }}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialogCopyDate.save(rangeCopyDates)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <v-dialog
                ref="dialogStartCopyDate"
                v-model="dialogStartCopyDate"
                :return-value.sync="startCopyDatePicker"
                persistent
                width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="startCopyDatePicker"
                    class="ml-3 mr-3"
                    :label="$t('moveStartingFrom')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="startCopyDatePicker"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="dialogStartCopyDate = false"
                  >
                    {{ $t('cancel') }}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialogStartCopyDate.save(startCopyDatePicker)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="showCopy = false"
                >
                  {{ $t('cancel') }}
                </v-btn>
                <v-btn
                  text
                  color="secondary"
                  @click="copyEvents"
                >
                  {{ $t('save') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-col>
        <v-col
          cols="2"
        >
          <v-btn
            class="mt-5"
            @click="showAddEventType = true"
          >
            <v-icon
              style="padding-right: 5px"
            >
              mdi-plus
            </v-icon>
            {{ $t('eventType') }}
          </v-btn>
          <v-dialog
            v-model="showAddEventType"
          >
            <v-card style="width:40%; margin:auto;">
              <v-card-title class="headline">
                {{ $t('addAnEventType') }}
              </v-card-title>
              <v-text-field
                v-model="event.type"
                class="ml-3 mr-3"
                :label="$t('eventType')"
              />

              <v-text-field
                v-model="event.color"
                class="ml-3 mr-3"
                :label="$t('eventColor')"
              />
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" text @click="showAddEventType = false">
                  {{ $t('close') }}
                </v-btn>
                <v-spacer />
                <v-btn color="blue darken-1" text @click="saveEventType">
                  {{ $t('continue') }}
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <hr>
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
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name" />
              <v-btn
                icon
                @click="deleteEvent"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-spacer />
            </v-toolbar>
            <v-dialog
              ref="dialogDate"
              v-model="dialogDate"
              :return-value.sync="newDate"
              persistent
              width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="newDate"
                  :label="$t('pickANewDate')"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="newDate"
                scrollable
              >
                <v-spacer />
                <v-btn
                  text
                  color="primary"
                  @click="dialogDate = false"
                >
                  {{ $t('cancel') }}
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialogDate.save(newDate)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
            <v-dialog
              ref="dialogStart"
              v-model="dialogStart"
              :return-value.sync="newStart"
              persistent
              width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="newStart"
                  :label="$t('pickNewStart')"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-time-picker
                v-if="dialogStart"
                v-model="newStart"
                format="24hr"
                :max="newEnd"
                full-width
              >
                <v-spacer />
                <v-btn
                  text
                  color="primary"
                  @click="dialogStart = false"
                >
                  {{ $t('cancel') }}
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialogStart.save(newStart)"
                >
                  OK
                </v-btn>
              </v-time-picker>
            </v-dialog>
            <v-dialog
              ref="dialogEnd"
              v-model="dialogEnd"
              :return-value.sync="newEnd"
              persistent
              width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="newEnd"
                  :label="$t('pickNewEnd')"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-time-picker
                v-if="dialogEnd"
                v-model="newEnd"
                format="24hr"
                :min="newStart"
                full-width
              >
                <v-spacer />
                <v-btn
                  text
                  color="primary"
                  @click="dialogEnd = false"
                >
                  {{ $t('cancel') }}
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialogEnd.save(newEnd)"
                >
                  OK
                </v-btn>
              </v-time-picker>
            </v-dialog>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                {{ $t('cancel') }}
              </v-btn>
              <v-btn
                text
                color="secondary"
                @click="updateEvent"
              >
                {{ $t('save') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </div>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-form ref="formDelete">
        <v-card>
          <v-card-title class="headline">
            {{ $t('doYouWantToDeleteThisEvent') }}
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeDelete">
              {{ $t('cancel') }}
            </v-btn>
            <v-btn color="blue darken-1" text @click="deleteConfirmation">
              OK
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="dialogSuccess" max-width="500px" class="success">
      <v-card>
        <v-card-title class="headline">
          {{ $t('success') }}!
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeSuccess">
            {{ $t('close') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
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
    events: [],
    eventsPerEmployee: [],
    valid: false,
    datePicker: new Date().toISOString().substr(0, 10),
    start: '',
    end: '',
    eventType: '',
    allEventTypes: [],
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    newDate: null,
    newStart: null,
    newEnd: null,

    dialogDate: null,
    dialogStart: false,
    dialogEnd: false,
    dialogDelete: false,
    dialogSuccess: false,

    dialogNewDate: false,
    dialogNewStartTime: false,
    dialogNewEndTime: false,

    dialogCopyDate: false,
    rangeCopyDates: [new Date().toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],

    dialogStartCopyDate: false,
    startCopyDatePicker: new Date().toISOString().substr(0, 10),

    eventTypesExceptHoliday: [],
    showAddEventType: false,
    event: {
      type: '',
      color: ''
    },

    showCreateEvent: false,
    showCopy: false,

    formdata: null
  }),

  computed: {
    dateRangeText () {
      return this.rangeCopyDates.join(' ~ ')
    }
  },

  /**
   * Mounted method is called every time the page reloads.
   */
  mounted () {
    this.oneTimeEventsPerEmployee()
    this.getEventTypes()
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
        this.newDate = this.selectedEvent.start.split('T')[0]
        this.newStart = this.selectedEvent.start.split('T')[1].split(':')[0] + ':' + this.selectedEvent.start.split('T')[1].split(':')[1]
        this.newEnd = this.selectedEvent.end.split('T')[1].split(':')[0] + ':' + this.selectedEvent.end.split('T')[1].split(':')[1]
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
     * Copies the events from a selected range to
     * the next period from the selected date as the same range.
     */
    copyEvents () {
      const dateFrom = this.rangeCopyDates[0] + ' 00:00:00'
      const dateTo = this.rangeCopyDates[1] + ' 23:59:59'
      this.formdata = new FormData()
      this.formdata.append('dateFrom', dateFrom)
      this.formdata.append('dateTo', dateTo)
      this.formdata.append('employeeId', this.$auth.user.id)
      this.formdata.append('moveTo', this.startCopyDatePicker + ' 23:59:59')
      axios({
        url: 'http://212.227.210.204:8765/department/copy_to_next_week',
        method: 'POST',
        data: this.formdata,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        window.location.reload()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('In catch: ' + JSON.stringify(response.data.errors))
      })
    },

    /**
     * Gets all events from a specified employee
     * to display in the planning calendar.
     */
    getEvents () {
      this.events = []
      this.eventsPerEmployee.forEach((el) => {
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
     * Saves a new event type to the database.
     */
    saveEventType () {
      this.formdata = new FormData()
      this.formdata.append('name', this.event.type)
      this.formdata.append('color', this.event.color)
      axios({
        url: 'http://212.227.210.204:8765/department/add_event_type',
        method: 'POST',
        data: this.formdata,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.showAddEventType = false
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('in catch' + JSON.stringify(response.data.errors))
      })
    },

    /**
     * GET request to get all events of one selected employee.
     */
    oneTimeEventsPerEmployee () {
      axios.get('http://212.227.210.204:8765/get_one_time_events/' + this.$auth.user.id, {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.eventsPerEmployee = response.data
        this.getEvents()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('in catch: ' + JSON.stringify(response.data.errors))
      })
    },

    /**
     * Gets all the event types to show when creating
     * a new event in the type selection field.
     */
    getEventTypes () {
      axios.get('http://212.227.210.204:8765/department/event_types', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.allEventTypes = response.data
        this.allEventTypes.forEach((event) => {
          if (event.name !== 'Holiday') {
            this.eventTypesExceptHoliday.push(event)
          }
        })
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('in catch: ' + JSON.stringify(response.data.errors))
      })
    },

    /**
     * Adds an event.
     * Checks the validations on the backend and
     * if the validations are respected it automatically
     * adds the event in the planner,
     * otherwise it gives the user an error warning.
     */
    addEvent () {
      let eventTypeId = 0
      this.allEventTypes.forEach((element) => {
        if (this.eventType === element.name) {
          eventTypeId = element.id
        }
      })
      const startTime = this.datePicker + ' ' + this.start + ':00'
      const endTime = this.datePicker + ' ' + this.end + ':00'
      this.formdata = new FormData()
      this.formdata.append('eventTypeId', eventTypeId)
      this.formdata.append('employeeId', this.$auth.user.id)
      this.formdata.append('startTime', startTime)
      this.formdata.append('endTime', endTime)
      axios({
        url: 'http://212.227.210.204:8765/department/add_one_time_event',
        method: 'POST',
        data: this.formdata,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        window.location.reload()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response))
      })
    },

    /**
     * Edits an event in the database.
     */
    updateEvent () {
      const newStartTime = this.newDate + ' ' + this.newStart + ':00'
      const newEndTime = this.newDate + ' ' + this.newEnd + ':00'
      this.formdata = new FormData()
      this.formdata.append('id', this.selectedEvent.id)
      this.formdata.append('eventTypeId', this.selectedEvent.event_type)
      this.formdata.append('employeeId', this.$auth.user.id)
      this.formdata.append('startTime', newStartTime)
      this.formdata.append('endTime', newEndTime)
      axios({
        url: 'http://212.227.210.204:8765/department/edit_one_time_event',
        method: 'PUT',
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        },
        data: this.formdata
      }).then((response) => {
        this.selectedOpen = false
        window.location.reload()
      }).catch((error) => {
        console.log('in catch')
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Deletes the selected event.
     */
    deleteConfirmation () {
      this.formdata = new FormData()
      this.formdata.append('id', this.selectedEvent.id)
      axios({
        url: 'http://212.227.210.204:8765/department/delete_one_time_event',
        method: 'DELETE',
        data: this.formdata,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.$refs.formDelete.reset()
        this.dialogSuccess = true
        this.dialogDelete = false
        window.location.reload()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response))
      })
    },

    /**
     * Closes the dialog for event deletion.
     */
    deleteEvent () {
      this.dialogDelete = true
    },

    /**
     * Closes the dialog.
     */
    closeDelete () {
      this.dialogDelete = false
      this.$refs.formDelete.reset()
    },

    /**
     * Closes the dialog with the Success confirmation.
     */
    closeSuccess () {
      this.dialogSuccess = false
      window.location.reload()
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
