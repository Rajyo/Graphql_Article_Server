const gql = require("graphql-tag")


const typeDefs = gql`
    
    enum Nationality {
        Bulgaria
        USA
        UK
        Canada
        Columbia
        Australia
    }

    type User {
        _id: ID!
        email: String!
        username: String!
        password: String!
        age: Int!
        nationality: Nationality!
    }
    


    type Query {
        users: [User!]!
        user(id: ID!): User!
    }



    input createUserInput {
        email: String!
        username: String!
        password: String!
        age: Int!
        nationality: Nationality!
    }

    input updateUsernameInput {
        id: ID!
        newUsername: String!
    }

    input loginUserInput {
        email: String!
        password: String!
    }

    type Token {
        token: String
        userId: ID
    }

    type Mutation {
        createUser(input: createUserInput!): User
        updateUsername(input: updateUsernameInput!): User
        deleteUser(id: ID!): String

        loginUser(input: loginUserInput!): Token 
    }

`

module.exports = {typeDefs}