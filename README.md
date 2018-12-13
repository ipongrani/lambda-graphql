# lambda-graphql-open_endpoint

## Sample Code Structure and Open endpoint available for demo

### graphiql can be accessed at
 - https://of9bca1n83.execute-api.us-east-1.amazonaws.com/dev/OpenBlueCare
 
### please use this token to explore
 - $2a$10$FpTmRu0L/2vUBEV8pqAe/urn0faL4b98kQReNEMivhDPSWNoORrRy
 
 
### Sample Query

query getPatients ($_authToken: String!){
  getPatients (_authToken: $_authToken){
    msg
    patientRecords {
     firstName
     lastName
     birthDate
     age
     status
     conditions{
       name
       status
     }
     medicalBio {
       medicalId
       bloodType
       bloodPressure
       allergies
       diet
       pill
       timePill
       medicalIssue
     }
     reports {
       datePublished
       patientReport
       topic
     }
    }
  }
}

### variables

{
  "_authToken": "$2a$10$FpTmRu0L/2vUBEV8pqAe/urn0faL4b98kQReNEMivhDPSWNoORrRy"
}
