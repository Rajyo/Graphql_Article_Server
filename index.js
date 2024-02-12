const { ApolloServer } = require("@apollo/server")
const { expressMiddleware } = require("@apollo/server/express4")
const { ApolloServerPluginDrainHttpServer } = require("@apollo/server/plugin/drainHttpServer")
const express = require("express")
const cors = require("cors");
const http = require("http")
const { typeDefs } = require("./schema/type-defs")
const { resolvers } = require("./schema/resolvers");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
require("dotenv").config()



const context = ({ req }) => {
    const { authorization } = req.headers
    if (authorization) {
        const { userId } = jwt.verify(authorization, process.env.JWT_SECRET)
        return { userId }
    }
}


const init = async () => {

    const app = express()
    const httpServer = http.createServer(app)

    const server = new ApolloServer({ typeDefs, resolvers, plugins: [ApolloServerPluginDrainHttpServer({ httpServer })] })
    await server.start()


    //connection to mongoDB(credentials are in .env file)
    const connect = async () => {
        try {
            await mongoose.connect(process.env.MONGO_URL);
        } catch (error) {
            throw error
        }
    };
    connect()

    //if connected to mongodb, this line will be shown
    mongoose.connection.on("connected", () => {
        console.log("mongoDB connected!")
    })

    // if disconnected from mongodb, this line will be shown
    mongoose.connection.on("disconnected", () => {
        console.log("mongoDB disconnected!")
    })


    app.use('/graphql', cors({origin: process.env.FRONTEND_URL}), express.json(), expressMiddleware(server, { context: context }))

    app.get('/', (req, res) => {
        res.send("Hello World")
    })

    await new Promise((resolve) => httpServer.listen({ port: process.env.PORT }, resolve))
    console.log(`🚀 Server ready at port ${process.env.PORT}`);

}
init()
