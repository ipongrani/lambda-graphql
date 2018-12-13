import authUser from './actions/authUser';
import logoutKey from './actions/logoutKey';
import getPatients from './actions/getPatients';
import submitReport from './actions/submitReport';



const resolvers = {
  Query: {
    getPatients
  },

  Mutation: {
    submitReport
  },
}



export default resolvers
