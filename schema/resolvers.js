const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Error = require("../error")


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
                if(!user){
                    Error({ error: 'User not Found', code: '404' })
                }
                return user
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
                Error({ error: 'Invalid Username', code: '404' })
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
            console.log(user);
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
                return newUser
            } catch (error) {
                Error({ error: 'Server Error', code: '500' })
            }

        },

        updateUsername: async (parent, args) => {
            const { id, newUsername } = args.input
            try {
                const updatedUser = await User.findByIdAndUpdate(id, { $set: { username: newUsername } }, { new: true })
                return updatedUser
            } catch (error) {
                Error({ error: 'Server Error', code: '500' })
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
        }
    }
}

module.exports = { resolvers }


// const { UserList } = require("../fakeData")
// const _ = require("lodash")
// const bcrypt = require("bcryptjs")
// const jwt = require("jsonwebtoken")
// require("dotenv").config()

// const resolvers = {
//     Query: {

//         //User Resolvers
//         users: () => {
//             return UserList;
//         },
//         user: (parent, args, {userId}) => {
//             const id = args.id
//             const user = _.find(UserList, { id: Number(id) })
//             console.log({userId})
//             return user
//         },


//     //Mutation
//     Mutation: {

//         loginUser: (parent, args) => {
//             let loginUser = args.input
//             const user = _.find(UserList, (user) => user.username === loginUser.username)
//             if (!user) {
//                 throw new Error("invalid username")
//             }
//             const passMatch = bcrypt.compare(loginUser.password, user.password)
//             if (!passMatch) {
//                 throw new Error("password is invalid")
//             }
//             const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
//             return { token }
//         },

//         createUser: async (parent, args) => {
//             let user = args.input
//             const lastId = UserList[UserList.length - 1].id
//             user.id = lastId + 1

//             const hashedPassword = await bcrypt.hash(user.password, 12)
//             user.password = hashedPassword

//             UserList.push(user)
//             console.log(user)
//             return user
//         },

//         updateUsername: (parent, args) => {
//             const { id, newUsername } = args.input
//             let updatedUser;
//             UserList.forEach((user) => {
//                 if (user.id === Number(id)) {
//                     user.username = newUsername
//                     updatedUser = user
//                 }
//             })
//             return updatedUser
//         },

//         deleteUser: (parent, args) => {
//             const id = args.id
//             _.remove(UserList, (user) => user.id === Number(id))
//             return "User Deleted"
//         }
//     }
// }

// module.exports = { resolvers }