const typeDefs = [`
  type Query {
    getPatients(_authToken: String!): Confirmation!
  }

  type Mutation {
    submitReport(_authToken: String!, patientFirstName: String!, 
                 patientLastName: String!, patientReport: String!,
                 reportTopic: String!): Confirmation!
  }


  type Confirmation {
    msg: String
    token: String
    membership: String
    patientAccess: [String]
    patientRecords: [PatientRecords]
  }

  type PatientRecords {
    firstName: String
    lastName: String
    age: String
    phoneNumber: String
    birthDate: String
    status: String
    conditions: [Conditions]
    medicalBio: [MedicalBio]
    reports: [Reports]
  }


  type MedicalBio {
    medicalId: String
    bloodType: String
    bloodPressure: String
    allergies: String
    diet: String
    pill: String
    timePill: String
    medicalIssue: String
  }


  type Reports {
    datePublished: String
    patientReport: String
    topic: String
  }


  type Conditions {
    name: String
    status: String
  }
  

  `]


  export default typeDefs;
