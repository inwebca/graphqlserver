import  { ApolloServer, gql } from 'apollo-server'
import  { surveys, surveyQuestion, surveyTrip, tripDetails } from './data.js';

//labels : FR ou EN a partir de la bd ou on se sert du fichier de localisation dans le front?

//Surveys
  // Question
  // Trip

const typeDefs = gql`
  type Survey{
    surveyDriverId: Int!
    labeldate: String
    labelClosingTime: String
    labelTimeLeft: String
    phaseType: PhaseType!
    state: EngineState!
  }

  type SingleSurvey {
    surveyDriverId: Int!
    driverEmployeeId: Int!
    phaseType: PhaseType!
    questions: [Question]
    suggestedTrips: [Trip]
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
    id: Int!
    label: String!
    priority: Int
  }

  type NestedDisplayedChoice{
    idGroup: Int!
    label: String!
    choices: [DisplayedChoice!]
    showGroupOnly: Boolean
  }

  enum PhaseType{
    QUESTION
    TRIP
  }

  enum EngineState{
    OPEN
    IN_PROCESS
    TRIP_ASSIGNED
    PLANNING
  }

  type Trip{
    id: Int!
    destination: String!
    deptHour: String!
    milage: Int!
    firstRdv: String!
    type: String!
  }

  type TripDetails{
    tripId: Int!
    departureDay: String!
    hasDangerousGoods: Boolean
    drops: [Drop]
  }

  type Drop{
    sequence: Int!
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

  input SelectedTrip{
    tripId: Int!
    priority: Int!
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
    startDay: String
    endDay: String
    startTime: String
    endTime: String
  }

  input DriverSurveyChoices{
    surveyDriverId: Int!
    phaseType: PhaseType!
    questionPriority: [QuestionPriority]
    selectedDevelopmentChoice: [SelectedDevelopmentChoice]
    selectedChoices: [Int]
    selectedTrips: [SelectedTrip]
  }
  
  type Query {

    """
    Get a list of surveys
    """
    driverSurveysSearch(criteria: DriverSurveySearchCriteria!, languageId: Int!): [Survey],
    
    """
    Get a specific survey
    """
    driverSurvey(surveyDriverId: Int!, languageId: Int!): SingleSurvey

    """
    Get the trips details
    """
    tripDetails(tripId: Int!, languageId: Int!): TripDetails
  }

  type Mutation {
    """
    Save a specific survey

    Fields used for Question survey type:
    questionPriority
    selectedDevelopmentChoice
    selectedChoices

    Fields used for Trip survey type:
    selectedTrips
    """
    driverSurvey(surveyChoices: DriverSurveyChoices!, languageId: Int!): SingleSurvey
  }
`;


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
      return args.surveyDriverId === 1 ? surveyQuestion : surveyTrip;
    },
    tripDetails(parent, args, context, info){
      return tripDetails;
    }
  },
  Mutation: {
    driverSurvey(parent, args, context, info) {
      return args.surveyChoices.surveyDriverId === 1 ? surveyQuestion : surveyTrip;
    }
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`????  Server ready at ${url}`);
});