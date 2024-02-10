const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Error = require("../error")
const Article = require("../models/Article")


const resolvers = {
    Query: {

        //User Resolvers
        users: async () => {
            try {
                const users = await User.find({})
                return users;
            } catch (error) {
                Error({ error: 'Server Error', code: '500' })
            }

        },

        user: async (parent, args) => {
            try {
                const user = await User.findById({ _id: args.id })
                if (!user) {
                    Error({ error: 'User not Found', code: '404' })
                }
                return user
            } catch (error) {
                Error({ error: 'Server Error', code: '500' })
            }

        },


        articles: async () => {
            try {
                const articles = await Article.find({})
                return articles
            } catch (error) {
                Error({ error: 'Server Error', code: '500' })
            }
        },

        article: async (parent, args) => {
            try {
                const article = await Article.findById({ _id: args.id })
                if (!article) {
                    Error({ error: 'User not Found', code: '404' })
                }
                return article
            } catch (error) {
                Error({ error: 'Server Error', code: '500' })
            }

        },

    },



    //Mutation
    Mutation: {

        loginUser: async (parent, args) => {

            const user = await User.findOne({ email: args.input.email })

            if (!user) {
                Error({ error: 'Invalid Email', code: '404' })
            }

            const passMatch = await bcrypt.compare(args.input.password, user.password)
            if (!passMatch) {
                Error({ error: 'Invalid Password', code: '404' })
            }

            try {
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
                return { token: token, userId: user._id }
            } catch (error) {
                Error({ error: 'Server Error', code: '500' })
            }

        },


        createUser: async (parent, args) => {
            const user = await User.findOne({ email: args.input.email });
            // console.log(user);
            if (user) {
                Error({ error: 'User already Exists', code: '404' })
            }

            try {
                const hashedPassword = await bcrypt.hash(args.input.password, 12)

                const newUser = new User({
                    username: args.input.username,
                    email: args.input.email,
                    password: hashedPassword,
                    nationality: args.input.nationality,
                    age: args.input.age
                })

                await newUser.save();
                return "User created"
            } catch (error) {
                Error({ error: 'Server Error', code: '500' })
            }

        },

        updateUsername: async (parent, args) => {
            if (args.input.newPassword == "") {
                const { id, newUsername } = args.input
                try {
                    const updatedUser = await User.findByIdAndUpdate(id, { $set: { username: newUsername } }, { new: true })
                    return updatedUser
                } catch (error) {
                    Error({ error: 'Server Error', code: '500' })
                }
            } else {
                const { id, newUsername, newPassword } = args.input
                const hashedPassword = await bcrypt.hash(args.input.newPassword, 12)
                try {
                    const updatedUser = await User.findByIdAndUpdate(id, { $set: { username: newUsername, password: hashedPassword } }, { new: true })
                    return updatedUser
                } catch (error) {
                    Error({ error: 'Server Error', code: '500' })
                }
            }

        },


        deleteUser: async (parent, args) => {
            try {
                const user = await User.findByIdAndDelete({ _id: args.id })
                if (!user) {
                    return Error({ error: 'User not Found', code: '404' })
                }
                return "User Deleted"

            } catch (error) {
                Error({ error: 'User not Found', code: '404' })
            }
        },



        createArticle: async (parent, args) => {
            try {
                const newArticle = new Article({
                    author: args.input.author,
                    title: args.input.title,
                    description: args.input.description
                })

                await newArticle.save();
                return "Article created"
            } catch (error) {
                Error({ error: 'Server Error', code: '500' })
            }

        },

        updateArticle: async (parent, args) => {
            const { id, newTitle, newDescription } = args.input
            try {
                const updatedArticle = await Article.findByIdAndUpdate(id, { $set: { title: newTitle, description: newDescription } }, { new: true })
                return updatedArticle
            } catch (error) {
                Error({ error: 'Server Error', code: '500' })
            }
        },

        deleteArticle: async (parent, args) => {
            try {
                const article = await Article.findByIdAndDelete({ _id: args.id })
                if (!article) {
                    return Error({ error: 'Article not Found', code: '404' })
                }
                return "Article Deleted"

            } catch (error) {
                Error({ error: 'Article not Found', code: '404' })
            }
        }

    }
}

module.exports = { resolvers }
