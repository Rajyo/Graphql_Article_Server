const gql = require("graphql-tag")


const typeDefs = gql`
    
    enum Nationality {
        India
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
    
    type Article {
        _id: ID!
        author: User!
        title: String!
        description: String!
    }


    type Query {
        users: [User!]!
        user(id: ID!): User!

        articles: [Article!]!
        article(id: ID!): Article!
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
        newPassword: String!
    }
    
    input createArticleInput {
        author: String!
        title: String!
        description: String!
    }

    input updateArticleInput {
        id: ID!
        newTitle: String!
        newDescription: String!
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
        createUser(input: createUserInput!): String
        updateUsername(input: updateUsernameInput!): User
        deleteUser(id: ID!): String
        
        createArticle(input: createArticleInput!): String
        updateArticle(input: updateArticleInput!): Article
        deleteArticle(id: ID!): String

        loginUser(input: loginUserInput!): Token 
    }

`

module.exports = { typeDefs }