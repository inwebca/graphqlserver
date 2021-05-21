const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
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
  
  type Query {
    driverSurveysSearch: [DriverSurvey],
    driverSurvey(surveyDriverId: Int!, languageId: Int!) : DriverSurvey
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
      selectedChoices: [11,21],
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
    driverSurveysSearch: () => surveys,
    driverSurvey(parent, args, context, info) {
      return survey;
    }
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});