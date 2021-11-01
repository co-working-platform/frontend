<template>
  <v-card class="rounded-1">
    <div>
      <v-row>
        <v-col
          cols="12"
          md="2"
        >
          <v-autocomplete
            v-model="employee"
            class="ml-5"
            :items="employees.map(el => el.firstname + ' ' + el.lastname)"
            :rules="[v => !!v || 'Employee is required']"
            :label="$t('chooseAnEmployee')"
            persistent-hint
            required
            @change="storeEmployee"
          />
        </v-col>
        <v-col
          cols="12"
          md="1"
        >
          <v-menu
            :close-on-content-click="false"
            offset-x
          >
            <template #activator="{ on, attrs }">
              <v-btn
                v-if="show"
                class="toolbar_buttons"
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
                    Cancel
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
              <v-dialog v-model="dialogValidations" max-width="500px">
                <v-card>
                  <v-card-title class="headline">
                    <v-list>
                      <v-list-item v-for="el in wrongValidations" :key="el">
                        {{ el }}
                      </v-list-item>
                    </v-list>
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="closeValidations">
                      {{ $t('close') }}
                    </v-btn>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="continueAddEvent">
                      {{ $t('continue') }}
                    </v-btn>
                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogForceAddEvent" max-width="500px">
                <v-card>
                  <div style="display: flex; flex-direction: row;">
                    <v-otp-input
                      input-classes="otp-input"
                      :num-inputs="4"
                      separator="-"
                      :should-auto-focus="true"
                      @on-complete="handleOnComplete"
                    />

                    <button @click="handleClearInput()">
                      {{ $t('clearInput') }}
                    </button>
                  </div>
                </v-card>
              </v-dialog>
            </v-card>
          </v-menu>
        </v-col>

        <v-col
          cols="12"
          md="1"
        >
          <v-menu
            :close-on-content-click="false"
            offset-x
          >
            <template #activator="{ on, attrs }">
              <v-btn
                v-if="employee"
                class="toolbar_buttons"
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
        <v-spacer />
        <v-col
          cols="12"
          md="2"
        >
          <v-btn
            v-if="show"
            class="toolbar_buttons"
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
            <v-card style="width:40%;margin:auto;">
              <v-card-title class="headline">
                {{ $t('addAnEventType') }}
              </v-card-title>
              <v-text-field
                v-model="event.type"
                class="ml-3 mr-3"
                :label="$t('eventType')"
              />

              <v-autocomplete
                v-model="event.color"
                class="ml-3 mr-3"
                :items="colors"
                :rules="[v => !!v || 'Color is required']"
                persistent-hint
                required
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
        <v-spacer />
        <v-col
          cols="12"
          md="2"
        >
          <v-btn
            v-if="show"
            class="toolbar_buttons"
            @click="showHoliday = true"
          >
            <v-icon
              style="padding-right: 5px"
            >
              mdi-plus
            </v-icon>
            {{ $t('publicHoliday') }}
          </v-btn>
          <v-dialog
            v-model="showHoliday"
          >
            <v-card style="width:40%;margin:auto;">
              <v-card-title class="headline">
                {{ $t('addAPublicHoliday') }}
              </v-card-title>
              <v-text-field
                v-model="holiday"
                class="ml-3 mr-3"
                :label="$t('holidayName')"
              />
              <v-dialog
                ref="dialogStartCopyDate"
                v-model="dialogStartCopyDate"
                :return-value.sync="startHolidayDatePicker"
                persistent
                width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="startHolidayDatePicker"
                    class="ml-3 mr-3"
                    :label="$t('moveStartingFrom')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="startHolidayDatePicker"
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
                    @click="$refs.dialogStartCopyDate.save(startHolidayDatePicker)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" text @click="showHoliday = false">
                  {{ $t('close') }}
                </v-btn>
                <v-spacer />
                <v-btn color="blue darken-1" text @click="saveHoliday">
                  {{ $t('continue') }}
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-spacer />
        <v-spacer />
        <v-spacer />
        <v-spacer />

        <v-col
          cols="12"
          md="1"
        >
          <v-menu
            :close-on-content-click="false"
            offset-y
          >
            <template #activator="{ on, attrs }">
              <v-btn
                class="toolbar_buttons"
                v-bind="attrs"
                :right="true"
                :absolute="true"
                v-on="on"
                @click="showExportToCSV = true"
              >
                <v-icon style="padding-right: 5px">
                  mdi-export-variant
                </v-icon>
                {{ $t('export') }}
              </v-btn>
            </template>
            <v-card
              v-if="showExportToCSV"
              min-width="350px"
              flat
            >
              <v-toolbar
                :color="'green'"
                dark
              >
                <v-btn icon>
                  <v-icon>mdi-export-variant</v-icon>
                </v-btn>
                <v-toolbar-title>{{ $t('exportPlanningsToCSV') }}</v-toolbar-title>
                <v-spacer />
              </v-toolbar>

              <v-dialog
                ref="dialogExportDate"
                v-model="dialogExportDate"
                :return-value.sync="rangeExportDates"
                persistent
                width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="exportDateRangeText"
                    :label="$t('dateRange')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="rangeExportDates"
                  range
                  no-title
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="dialogExportDate = false"
                  >
                    {{ $t('cancel') }}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="getAllWorkingHours"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="showExportToCSV = false"
                >
                  {{ $t('cancel') }}
                </v-btn>
                <download-csv
                  :data="allWorkingHours"
                  :name="dataFile"
                  :labels="labels"
                  :fields="fields"
                  @export-finished="exportToCSV"
                >
                  <v-btn
                    text
                    color="secondary"
                    @click="showExportToCSV = false"
                  >
                    {{ $t('exportToCSV') }}
                  </v-btn>
                </download-csv>
              </v-card-actions>
            </v-card>
          </v-menu>
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
              <v-btn v-if="!isHoliday" icon>
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
              v-if="!isHoliday"
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
              v-if="!isHoliday"
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
              v-if="!isHoliday"
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
                v-if="!isHoliday"
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
import JsonCSV from 'vue-json-csv'
import OtpInput from '@bachdgvn/vue-otp-input'
export default {
  components: {
    'download-csv': JsonCSV,
    'v-otp-input': OtpInput
  },
  data: () => ({
    dataFile: '',
    labels: {
      name: 'Employee Name',
      normalHours: 'Total Number of Hours',
      sundayHours: 'Total Number of Sunday Hours',
      holidayHours: 'Total Numbers of Holiday Hours',
      nightHours: 'Total Number of Night Hours',
      daysWorked: 'Total Number of Working Days'
    },
    fields: ['name', 'normalHours', 'sundayHours', 'holidayHours', 'nightHours', 'daysWorked'],
    isExported: false,
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
    employees: [],
    employee: '',
    allEvents: [],
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

    wrongValidations: [],
    dialogValidations: false,
    dialogForceAddEvent: false,

    eventTypesExceptHoliday: [],
    showAddEventType: false,
    event: {
      type: '',
      color: ''
    },

    showHoliday: false,
    startHolidayDatePicker: new Date().toISOString().substr(0, 10),
    holiday: '',
    holidays: [],

    user: null,

    dialogCopyDate: false,
    rangeCopyDates: [new Date().toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],

    dialogStartCopyDate: false,
    startCopyDatePicker: new Date().toISOString().substr(0, 10),

    dialogExportDate: false,
    rangeExportDates: [new Date().toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],

    showCreateEvent: false,
    showCopy: false,
    showExportToCSV: false,

    allWorkingHours: [],

    isHoliday: false,

    colors: [
      'red',
      'blue',
      'green',
      'yellow',
      'pink',
      'grey',
      'purple',
      'black'
    ],

    show: false,

    formdata: null
  }),

  computed: {
    dateRangeText () {
      return this.rangeCopyDates.join(' ~ ')
    },
    exportDateRangeText () {
      return this.rangeExportDates.join(' ~ ')
    }
  },

  /**
   * Mounted method is called every time the page reloads.
   */
  mounted () {
    this.setUser()
    this.checkIfEmployeeInLocalStorage()
    this.getHolidays()
    this.getEmployees()
    this.getEventTypes()
  },

  methods: {
    /**
     * Sets the user field to the authenticated user.
     */
    setUser () {
      axios.get('http://212.227.210.204:8765/user', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.user = response.data
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('Method get user error: ' + response)
        console.log('Method get user stringified errors: ' + JSON.stringify(response.data.errors))
      })
    },

    /**
     * Checks if the user has already viewed another employees calendar
     * and redirects to that employees calendar view if the employee exists
     * in local storage, otherwise it goes to his planning.
     */
    checkIfEmployeeInLocalStorage () {
      this.employee = localStorage.getItem('name')
      if (this.employee !== null) {
        this.show = true
      }
    },
    /**
     * Checks if the selectedEvent is an holiday or not
     * @param selectedEvent
     */
    isEventAnHoliday (selectedEvent) {
      this.isHoliday = false
      this.holidays.forEach((holiday) => {
        if (holiday.name === selectedEvent.name) {
          this.isHoliday = true
        }
      })
    },

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
     * Stores the last viewed employee in the local storage.
     */
    storeEmployee () {
      if (process.browser) {
        localStorage.setItem('name', this.employee)
      }
      window.location.reload()
    },

    /**
     * TODO do we still need it?
     * @param selectedEvent
     * @returns {*}
     */
    parseToReadableDate (selectedEvent) {
      const dateAndStartTime = selectedEvent.start.split('T')
      const date = dateAndStartTime[0]
      return date
    },

    /**
     * TODO do we still need this as well?
     * We do not use them anywhere else.
     * @param selectedStartTime
     * @returns {string}
     */
    parseToReadableStartTime (selectedStartTime) {
      const startTime = selectedStartTime.split('T')
      return 'From: ' + startTime[1]
    },

    /**
     * TODO do we still need this as well?
     * We do not use them anywhere else.
     * @param selectedEndTime
     * @returns {string}
     */
    parseToReadableEndTime (selectedEndTime) {
      const endTime = selectedEndTime.split('T')
      return 'To: ' + endTime[1]
    },

    /**
     * TODO
     * @param nativeEvent
     * @param event
     */
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.isEventAnHoliday(this.selectedEvent)
        this.selectedElement = nativeEvent.target
        if (!this.isHoliday) {
          this.newDate = this.selectedEvent.start.split('T')[0]
          this.newStart = this.selectedEvent.start.split('T')[1].split(':')[0] + ':' + this.selectedEvent.start.split('T')[1].split(':')[1]
          this.newEnd = this.selectedEvent.end.split('T')[1].split(':')[0] + ':' + this.selectedEvent.end.split('T')[1].split(':')[1]
        }
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
      let employeeId = 0
      this.employees.forEach((element) => {
        if (element.firstname + ' ' + element.lastname === this.employee) {
          employeeId = element.id
        }
      })
      this.formdata.append('employeeId', employeeId)
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
      this.getHolidayEvents()
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
     * Gets all public holidays stored in the database.
     */
    getHolidays () {
      axios.get('http://212.227.210.204:8765/department/public_holidays', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.holidays = response.data
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Gets all holidays as events to show in the pplanning.
     */
    getHolidayEvents () {
      let eventId = ''
      this.allEventTypes.forEach((event) => {
        if (event.name === 'Holiday') {
          eventId = event.id
        }
      })
      this.holidays.forEach((el) => {
        this.events.push({
          id: el.id,
          // emp_id: employee.id,
          event_type: eventId,
          name: el.name,
          start: el.date,
          end: el.date,
          color: 'orange',
          timed: false
        })
      })
    },

    /**
     * Creates and saves a new holiday in the database.
     */
    saveHoliday () {
      this.formdata = new FormData()
      this.formdata.append('date', this.startHolidayDatePicker)
      this.formdata.append('name', this.holiday)
      axios({
        url: 'http://212.227.210.204:8765/department/add_public_holiday',
        method: 'POST',
        data: this.formdata,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.showHoliday = false
        window.location.reload()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('in catch' + JSON.stringify(response.data.errors))
      })
    },

    /**
     * Gets all the employees from the database through
     * a GET request to the following endpoint:
     * 'http://212.227.210.204:8765/department/employees'.
     * As well as, sets the employee variable used for the export of the data.
     */
    getEmployees () {
      axios.get('http://212.227.210.204:8765/admin/employees', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.employees = response.data
        this.oneTimeEventsPerEmployee()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * GET request to get all events of one selected employee.
     */
    oneTimeEventsPerEmployee () {
      if (!this.employee) { return }
      let employeeId = 0
      this.employees.forEach((element) => {
        if (this.employee === element.firstname + ' ' + element.lastname) {
          employeeId = element.id
        }
      })
      axios.get('http://212.227.210.204:8765/get_one_time_events/' + employeeId, {
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
     * GET method to get all events stored in the database.
     * TODO do we still need this?
     */
    getAllOneTimeEvents () {
      axios.get('http://212.227.210.204:8765/get_one_time_events', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.allEvents = response.data
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
     * Opens the dialog to enter a pin to forcefully
     * add an event.
     */
    continueAddEvent () {
      this.closeValidations()
      this.dialogForceAddEvent = true
    },

    /**
     * When one of the numbers in the pincode is modified this method is called.
     * @param value the value of the final pincode
     */
    handleOnChange (value) {
      // when one of the number in the pincode is rechanged by the user
    },

    /**
     * When the bbutton to clear the input is pressed
     * this method is called to clear all the numbers
     * previously added in the boxes.
     */
    handleClearInput () {
      this.$refs.otpInput.clearInput()
    },

    /**
     * When all the boxes have been filled with numbers
     * the POST method checks if the pin was correctly inserted or not.
     * If it was, the event is successfully added,
     * otherwise it asks the user to insert the correct pincode.
     * @param value
     */
    handleOnComplete (value) {
      console.log('The entered pin code: ' + value)
      this.formdata = new FormData()
      this.formdata.append('password', value)
      this.formdata.append('city_id', this.user.employee.department.city.id)
      axios({
        url: 'http://212.227.210.204:8765/department/check_password',
        method: 'POST',
        data: this.formdata,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.forceAddEvent()
      }).catch((error) => {
        const response = error.response
        window.alert('in catch' + JSON.stringify(response.data.errors))
      })
    },

    /**
     * The actual POST method to add an event by force.
     * This method is called when the correct pincode was inserted.
     */
    forceAddEvent () {
      let eventTypeId = 0
      this.allEventTypes.forEach((element) => {
        if (this.eventType === element.name) {
          eventTypeId = element.id
        }
      })
      let employeeId = 0
      this.employees.forEach((element) => {
        if (element.firstname + ' ' + element.lastname === this.employee) {
          employeeId = element.id
        }
      })
      const startTime = this.datePicker + ' ' + this.start + ':00'
      const endTime = this.datePicker + ' ' + this.end + ':00'
      this.formdata = new FormData()
      this.formdata.append('eventTypeId', eventTypeId)
      this.formdata.append('employeeId', employeeId)
      this.formdata.append('startTime', startTime)
      this.formdata.append('endTime', endTime)
      axios({
        url: 'http://212.227.210.204:8765/department/add_one_time_event_without_validation',
        method: 'POST',
        data: this.formdata,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        window.location.reload()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response.status
        console.log('in catch' + JSON.stringify(response))
      })
    },

    /**
     * Adds an event.
     * Checks the validations on the backend and
     * if the validations are respected it automatically
     * adds the event in the planner,
     * otherwise it specifies the broken rules and
     * asks for the pincode to forcefully add that event.
     */
    addEvent () {
      let eventTypeId = 0
      this.allEventTypes.forEach((element) => {
        if (this.eventType === element.name) {
          eventTypeId = element.id
        }
      })
      let employeeId = 0
      this.employees.forEach((element) => {
        if (element.firstname + ' ' + element.lastname === this.employee) {
          employeeId = element.id
        }
      })
      const startTime = this.datePicker + ' ' + this.start + ':00'
      const endTime = this.datePicker + ' ' + this.end + ':00'
      this.formdata = new FormData()
      this.formdata.append('eventTypeId', eventTypeId)
      this.formdata.append('employeeId', employeeId)
      this.formdata.append('startTime', startTime)
      this.formdata.append('endTime', endTime)
      axios({
        url: 'http://212.227.210.204:8765/department/add_one_time_event',
        method: 'POST',
        data: this.formdata,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        window.location.reload()
      }).catch((error) => {
        if (error.response.status === 400) {
          this.update = true
          this.wrongValidations = error.response.data
          this.dialogValidations = true
        }
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
      this.formdata.append('employeeId', this.selectedEvent.emp_id)
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
     * Gets all working hours data to be exported to he csv file.
     */
    getAllWorkingHours () {
      this.$refs.dialogExportDate.save(this.rangeExportDates)
      this.dataFile = 'Working_Hours_from_' + this.rangeExportDates[0] + '_to_' + this.rangeExportDates[1] + '.csv'
      this.formdata = new FormData()
      const start = this.rangeExportDates[0] + ' 00:00:00'
      const end = this.rangeExportDates[1] + ' 23:59:59'
      this.formdata.append('from', start)
      this.formdata.append('to', end)
      axios({
        url: 'http://212.227.210.204:8765/admin/get_hours_worked',
        method: 'POST',
        data: this.formdata,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.allWorkingHours = response.data
        this.exportToCSV()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Changes the isExported variable when the export is done.
     * @param event
     */
    exportToCSV (event) {
      console.log(event)
      this.isExported = true
      setTimeout(() => {
        this.isExported = false
      }, 3 * 1000)
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
    },

    /**
     * Closes the dialog showing all broken validations.
     */
    closeValidations () {
      this.dialogValidations = false
    },

    /**
     * Closes the pincode dialog.
     */
    closeForceAddEvent () {
      this.dialogForceAddEvent = false
      window.location.reload()
    }
  }
}
</script>

<style>
.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  color: darkgrey;
  border-radius: 4px;
  border: 1px solid rgba(189, 195, 199, 1);
  text-align: center;
}
.error {
  border: 1px solid red !important;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.time {
  color:black;
  font-size: 17px;
}

.toolbar_buttons {
  margin-top: 14px;
}

</style>
