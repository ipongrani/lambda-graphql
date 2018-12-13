
let model = (async (obj, args, ctx) => {
    let { put, uIdv4, query, update, mailer, firebaseAdmin, serviceAccount1 } = ctx.config;
    let { authorization } = ctx.headers;
    let { Confirmation } = ctx.classes;
    let { _authKey, patientFirstName, patientLastName, patientReport, reportTopic } = args

    try {

      var payload = {
        notification: {
          title: reportTopic,
          body: patientReport
        },
        topic: patientFirstName+patientLastName
      };



      firebaseAdmin.messaging().send(payload)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });



        let today = new Date();

        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        
        if (dd < 10) {
        dd = '0' + dd;
        } 
        
        if (mm < 10) {
        mm = '0' + mm;
        } 

        today = dd + '/' + mm + '/' + yyyy;
        console.log("today: ", today);

        let params1 = (param) =>{
            return {
          TableName: 'BlueCare',
          KeyConditionExpression: "#KeyType = :kt",
          ExpressionAttributeNames:{
                 "#KeyType": "KeyType",
                 "#info": "info",
                 "#patientInfo": "patientInfo",
                 "#firstName": "firstName"
             },
          ExpressionAttributeValues: {
                 ":kt": param.kt,
                 ":pn": param.name
             },
          FilterExpression: "#info.#patientInfo.#firstName = :pn" 
        }};

        let res1 = await query(params1({kt: "Patient", name: patientFirstName}));

        console.log("res3: ",res1);


        let patientsProfiles = res1.Items;
        console.log("pR: ", patientsProfiles);
        console.log("patientFirstName: ", patientFirstName);



        if(patientsProfiles.length == 0) {
            return new Confirmation({msg: `Not Activated Yet`});
        } else {

            let patient = patientsProfiles[0]
            console.log("patient reports: ", patient.info.reports);
            
            let newReports = [...patient.info.reports, {"topic": reportTopic, "patientReport": patientReport, "datePublished": today}];

            let uParams1 = {
                TableName:"BlueCare",
                Key: {
                "KeyType": "Patient",
                "id": patient.id
                },
                UpdateExpression: "set info.reports = :reports",
                ExpressionAttributeValues:{
                    ":reports": newReports,
                },
                ReturnValues:"UPDATED_NEW"
            };
            
            let resU1 = await update(uParams1);
            console.log(resU1);

            return new Confirmation({msg: `Successfully Submitted`});
        }

       

    } catch (err) {

        console.log(err);
      return new Confirmation({msg: "Something went wrong"});

  }
});


export default model
