export const surveys = [
    {
        surveyDriverId: 1,
        labelDay: 'Saturday to Monday',
        labelDate: 'From March 12 to March 14 2021'
    },
    {
        surveyDriverId: 2,
        labelDay: 'Saturday to Monday',
        labelDate: 'From June 12 to June 14 2021'
    },
    {
        surveyDriverId: 3,
        labelDay: 'Saturday to Monday',
        labelDate: 'From July 12 to July 14 2021'
    }
];

export const survey = {
    surveyDriverId: 1,
    questions: [
        {
            id: 1,
            title: 'Day',
            label: 'Departure day',
            requiredSequence: null,
            questionType: 'DEVELOPMENT',
            questionDataType: 'DATE',
            selectedChoice: '2021-01-01'
        },
        {
            id: 2,
            title: 'Time',
            label: 'Time range',
            requiredSequence: null,
            questionType: 'CHOICE',
            multipleAnswer: false,
            selectedChoices: [],
            displayedChoices: [
                {
                    id: 4,
                    label: 'AM',
                    priority: 0
                }, {
                    id: 5,
                    label: 'PM',
                    priority: 0
                }, {
                    id: 6,
                    label: 'ALL',
                    priority: 0
                }
            ]
        },
        {
            id: 3,
            title: 'Destination',
            label: 'Destination',
            requiredSequence: 1,
            questionType: 'NESTEDCHOICE',
            allSelected: false,
            selectedChoices: [11, 21],
            displayedChoices: [
                {
                    idGroup: 1,
                    label: 'East coast',
                    showGroupOnly: false,
                    choices: [{
                        id: 11,
                        label: 'New-york',
                        priority: 0
                    }, {
                        id: 12,
                        label: 'Maine',
                        priority: 0
                    }]
                },
                {
                    idGroup: 2,
                    label: 'West coast',
                    showGroupOnly: false,
                    choices: [{
                        id: 21,
                        label: 'Texas',
                        priority: 0
                    }, {
                        id: 22,
                        label: 'California',
                        priority: 0
                    }]
                }
            ]
        },
        {
            id: 4,
            title: 'Distance',
            label: 'Distance',
            requiredSequence: 2,
            questionType: 'CHOICE',
            multipleAnswer: false,
            selectedChoices: [],
            displayedChoices: [{
                id: 777,
                label: '0-499 miles',
                priority: 0,
            }, {
                id: 888,
                label: '499-999 miles',
                priority: 0
            },
            {
                id: 999,
                label: 'Unlimited',
                priority: 0
            }]
        }
    ]
}


export const tripsSurveys = [
    {
        surveyId: 1,
        title: "Trips based on survey 1",
        labelDay: "Friday March 12 2021"
    },
    {
        surveyId: 2,
        title: "Trips based on survey 2",
        labelDay: "Friday April 12 2021"
    }
]

export const trip = [
    {
        id: 1,
        destination: "Maine",
        deptHour: "09:00",
        milage: 300,
        firstRdv: "19 May 11:00",
        type: "FT"
    },
    {
        id: 2,
        destination: "Maine, New-York",
        deptHour: "09:00",
        milage: 300,
        firstRdv: "19 May 11:00",
        type: "FM - 2"
    },
    {
        id: 3,
        destination: "Maine, New-York, Florida",
        deptHour: "09:00",
        milage: 300,
        firstRdv: "19 May 11:00",
        type: "FM - 3"
    }
]

export const tripDetails = {
    tripId: 1,
    departureDay: "Friday March 12 2021",
    hasDangerousGoods: true,
    drops: [
        {
            number: 1,
            appointmentTime: "2021-05-13 09:00",
            clientAddress: "170 5E AV ROUGEMONT, QC J0L 1M0 CAN"
        },
        {
            number: 2,
            appointmentTime: "2021-06-13 09:00",
            clientAddress: "95 VULCAN ST ETOBICOKE, ON M9W 1L4 CAN"
        },
        {
            number: 3,
            appointmentTime: "2021-07-13 09:00",
            clientAddress: "4500 RUE HICKMORE SAINT-LAURENT, QC H4T 1K2 CAN"
        }
    ]
}
