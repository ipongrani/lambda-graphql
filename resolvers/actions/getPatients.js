
let model = (async (obj, args, ctx) => {
    let { put, jwtDecode, get, query, update } = ctx.config;
    let { authorization } = ctx.headers;
    let { Confirmation } = ctx.classes;
    let { _authToken } = args

    try {

      console.log("args: ", args);

    let params1 = (param) =>{
        return {
      TableName: 'BlueCare',
      KeyConditionExpression: "#KeyType = :kt",
      ExpressionAttributeNames:{
             "#KeyType": "KeyType"
         },
      ExpressionAttributeValues: {
             ":kt": param
         }
    }};


    let params2 = (param) => {
        let kt = param.kt === "Staff" ? "Facility" : "Member";
          return {
      TableName: 'BlueCare',
      KeyConditionExpression: "#KeyType = :kt AND #id = :ID",
      ExpressionAttributeNames:{
              "#KeyType": "KeyType",
              "#id": "id"
          },
      ExpressionAttributeValues: {
              ":kt": kt,
              ":ID": param.id
          }
    }};



    let params3 = (param) =>{
        return {
      TableName: 'BlueCare',
      KeyConditionExpression: "#KeyType = :kt",
      ExpressionAttributeNames:{
             "#KeyType": "KeyType"
         },
      ExpressionAttributeValues: {
             ":kt": param
         }
    }};


   let res1 = await query(params1("Facility"));
   let res2 = await query(params1("Member"));
   let filtered=[];
   
  

    [...res1.Items, ...res2.Items]
    .map((data,i) => {
        console.log("data devices", data.info.devices)
        data.info.devices.map((d) => 
         d.token === _authToken && d.status === "used" ?
         filtered.unshift(d): null
         );
    });

    
    console.log("filtered", filtered);

   
    


   let owners  = await query(params2({id: filtered[0].owner, kt: filtered[0].membership}));
   let ownerInfo = owners.Items[0].info;
   let deviceInfo = ownerInfo.devices.filter((data,i) => data.name === filtered[0].name)[0];
   let patientAccess = deviceInfo.patientAccess;
   let accessData = [];


   let params4 = (param) =>{
    return {
        TableName: 'BlueCare',
        KeyConditionExpression: "#KeyType = :kt",
        ExpressionAttributeNames:{
                "#KeyType": "KeyType",
            },
        ExpressionAttributeValues: {
                ":kt": param.kt
            },
        }};




        let res4 = await query(params4({kt: "Patient"}));
        let patientsProfiles = res4.Items;
        console.log("pR here: ", patientsProfiles);

        



        patientAccess.map(async (d1,i) => {

            let newD1 = d1.split(" ");

            let c = deviceInfo.membership === "Member" ? 
            ownerInfo.dependents.filter((d2,i) => d2.firstName === newD1[0] && d2.lastName === newD1[1]) :
            ownerInfo.applications.filter((d2,i) => d2.firstName === newD1[0] && d2.lastName === newD1[1]);

            let p = patientsProfiles.filter((d) => d.info.patientInfo.firstName === newD1[0]);
            if(p.length > 0) {
                console.log("reports: p",p[0].info);
            }
           

            c.length > 0 ? accessData.unshift(c.map((d3,i) => {
            return {
                firstName: d3.firstName,
                lastName: d3.lastName,
                age: d3.age,
                phoneNumber: d3.phoneNumber,
                birthDate: d3.birthDate,
                status: d3.status,
                conditions: d3.conditions,
                medicalBio: d3.medicalBio,
                reports: p.length > 0 ? p[0].info.reports : []
                }
            })[0]) : null;
        })



   
   let uParams = (params) => {
      let kt = params.kt === "Staff" ? "Facility" : "Member";      
      return {
      TableName:"BlueCare",
      Key: {
        "KeyType": kt,
        "id": params.id
      },
      UpdateExpression: "set info.devices = :devices",
      ExpressionAttributeValues:{
          ":devices": ownerDevices
      },
      ReturnValues:"UPDATED_NEW"
    }};
    


      return new Confirmation({msg: `get patients is live!`, patientRecords: accessData});
      

    } catch (err) {

      console.log(err)
      return new Confirmation({msg: "Something went wrong"});
    }
});


export default model
