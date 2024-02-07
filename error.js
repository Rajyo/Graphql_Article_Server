const {GraphQLError} = require('graphql');

const Error = ({error, code}) => {
    throw new GraphQLError(error, {
        extensions: {
          code: code,
        },
      });;
}

module.exports = Error