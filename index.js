import  { ApolloServer, gql } from 'apollo-server'
import  { surveys, survey, tripsSurveys, trip, tripDetails } from './data.js';

const typeDefs = gql`
  type DriverSurvey {
    surveyDriverId: Int!
    driverEmployeeId: Int
    labelDate: String
    labelClosingTime: String,
    labelTimeLeft: String,
  }

  type SingleDriverSurvey{
    surveyDriverId: Int!
    driverEmployeeId: Int
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


  type TripsSurveys{
    surveyId: Int!
    labelDay: String!
    title: String
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
    Get a single survey
    """
    driverSurvey(surveyDriverId: Int!, languageId: Int!): SingleDriverSurvey

    """
    Get the trips surveys based on survey choices
    """
    tripsSurveys(driverEmployeId: Int!, surveyId: Int!, languageId: Int!): [TripsSurveys]

    """
    Get a list of suggested trips
    """
    suggestedTrips(driverEmployeId: Int!, surveyId: Int!, languageId: Int!): [Trip]

    """
    Get the trips details
    """
    tripDetails(tripId: Int!, languageId: Int!): TripDetails
  }

  type Mutation {
    """
    Save a single survey
    """
    driverSurvey(surveyChoices: DriverSurveyChoices!, languageId: Int!): SingleDriverSurvey
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
      return survey;
    },
    tripsSurveys(parent, args, context, info){
      return tripsSurveys;
    },
    suggestedTrips(parent, args, context, info){
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