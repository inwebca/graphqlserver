const { ApolloServer, gql } = require('apollo-server');

//todo : finaliser la query suggestedTripSurvey

const typeDefs = gql`
  type DriverSurvey {
    surveyDriverId: Int!
    driverEmployeeId: Int
    startDate: String
    endDate: String
    labelDate: String
    labelDay: String
    hasGrief: Boolean,
    questions: [Question!]
  }

  interface Question{
    id: Int!
    title: String!
    label: String!
    requiredSequence: Int
    questionType: QuestionType!
  }

  type Development implements Question{
    id: Int!
    title: String!
    label: String!
    requiredSequence: Int
    questionType: QuestionType!
    questionDataType: QuestionDataType!
    selectedChoice: String
  }

  type Choice implements Question{
    id: Int!
    title: String!
    label: String!
    requiredSequence: Int
    questionType: QuestionType!
    multipleAnswer: Boolean!
    selectedChoices: [Int]
    displayedChoices: [DisplayedChoice!]
  }

  type NestedChoice implements Question{
    id: Int!
    title: String!
    label: String!
    requiredSequence: Int
    questionType: QuestionType!
    allSelected: Boolean!
    selectedChoices: [Int]
    displayedChoices: [NestedDisplayedChoice!]
  }

  type DisplayedChoice{
    id: Int!,
    label: String!,
    priority: Int
  }

  type NestedDisplayedChoice{
    idGroup: Int!
    label: String!
    choices: [DisplayedChoice!]
    showGroupOnly: Boolean
  }


  type SuggestedTrips{
    surveyTripId: Int!
    labelDay: String!,
    title: String!
  }

  type TripDetails{
    idTrip: Int!
    departureDay: String!
    hasDangerousGoods: Boolean
    drops: [Drop]
  }

  type Drop{
    number: Int!
    appointmentTime: String!
    clientAddress: String!
  }

  input QuestionPriority{
    id: Int!
    priority: Int!
  }

  input SelectedDevelopmentChoice{
    id: Int!
    selectedChoice: String!
  }

  enum QuestionType{
    DEVELOPMENT,
    CHOICE,
    NESTEDCHOICE
  }

  enum QuestionDataType{
    DATE,
    STRING,
    NUMBER,
    BOOLEAN,
  }

  enum SurveyStatus {
    ACTIVE
    COMPLETED
    ENGINE_PROCESSED
    ATTRIBUTED
    CANCELED
  }

  input DriverSurveySearchCriteria {
    managerEmployeId: Int
    driverEmployeId: Int
    surveyId: Int
    surveyStatus: SurveyStatus
    startDate: String
    endDate: String
  }

  input DriverSurveyChoices{
    surveyDriverId: Int!
    questionPriority: [QuestionPriority]
    selectedDevelopmentChoice: [SelectedDevelopmentChoice]
    selectedChoices: [Int]
  }
  
  type Query {
    """
    Get a list of surveys
    """
    driverSurveysSearch(criteria: DriverSurveySearchCriteria!, languageId: Int!): [DriverSurvey],
    
    """
    Get a specific survey
    """
    driverSurvey(surveyDriverId: Int!, languageId: Int!): DriverSurvey

    """
    Get the trips surveys based on survey choices
    """
    suggestedTripsSearch(driverEmployeId: Int!, surveyId: Int!, languageId: Int!): [SuggestedTrips]

    """
    Get a specific trip survey
    """
    suggestedTripSurvey(surveyTripId: Int!, languageId: Int!): SuggestedTrips

    """
    Get the trips details
    """
    tripDetails(tripId: Int!, languageId: Int!): TripDetails
  }

  type Mutation {
    """
    Save a specific survey
    """
    driverSurvey(surveyChoices: DriverSurveyChoices!, languageId: Int!): DriverSurvey
  }
`;

const surveys = [
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

const survey = {
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

const trips = [
  {
    surveyTripId: 1,
    title: "Trips based on survey 1",
    labelDay: "Friday March 12 2021"
  },
  {
    surveyTripId: 2,
    title: "Trips based on survey 2",
    labelDay: "Friday April 12 2021"
  }
]

const trip = {

}

const tripDetails = {
  idTrip: 1,
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


const resolvers = {
  Question: {
    __resolveType(question, context, info) {
      if (question.questionType === 'DEVELOPMENT') {
        return 'Development';
      }
      if (question.questionType === 'CHOICE') {
        return 'Choice';
      }
      if (question.questionType === 'NESTEDCHOICE') {
        return 'NestedChoice';
      }
      return null; // GraphQLError is thrown
    },
  },
  Query: {
    driverSurveysSearch(parent, args, context, info) {
      return surveys;
    },
    driverSurvey(parent, args, context, info) {
      return survey;
    },
    suggestedTripsSearch(parent, args, context, info){
      return trips;
    },
    suggestedTripSurvey(parent, args, context, info){
      return trip;
    },
    tripDetails(parent, args, context, info){
      return tripDetails;
    }
  },
  Mutation: {
    driverSurvey(parent, args, context, info) {
      return survey;
    }
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});