const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
const client = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use("/src",express.static(__dirname+"/src"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

  app.get('/', (req, res) => {
    res.sendFile(__dirname+"/signup.html");
  });

  client.setConfig({
    apiKey: "65638b53051875e3cf694b6dc1b0393a-us9",
    server: "us9",
  });

  app.post('/', (req, res) => {

    const fname = req.body.fName;
    const lname = req.body.lName;
    const email = req.body.email;

    const listId="2cb89ce8c4";

    const subscribingUser = {
      firstName: fname,
      lastName: lname,
      email: email
     };

     const run = async () => {
      try{
          const response = await client.lists.batchListMembers(listId, {
            members: [{
              email_address: subscribingUser.email,
              status: "subscribed",
              merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
              }
            }],
          });
          
          if (response.errors && response.errors.length > 0) {
            const error = response.errors[0]; // Access the first error object
            const errorCode = error.error_code;
            console.log("Error code:", errorCode);
            console.log("Error message:", error.error);
            console.log("Email address:", error.email_address);
            res.sendFile(__dirname+"/failure.html");
          }
           else {
            // Success: no errors
            // console.log("Successfully added member to the list");
            res.sendFile(__dirname+"/success.html");
          }
          // console.log(response);
      } 
      catch (error) {
          // Handle any other errors
          console.error("An error occurred:", error);
          res.sendFile(__dirname+"/failure.html");
        }   
    };
    run();
     
    //depricated code
    // var data = {
    //   members:[
    //     {
    //       email_address: email,
    //       status: "subscribed",
    //       merge_fields: {
    //         FNAME: fname,
    //         LNAME: lname
    //       }
    //     }
    //   ]
    // };

    // var jsonData = JSON.stringify(data);

    // const url = "https://us9.api.mailchimp.com/3.0/lists/2cb89ce8c4";

    // const options = {
    //   method:"POST",
    //   auth: "Ferg:65638b53051875e3cf694b6dc1b0393a-us9"
    // }

    // const request = https.request(url,options,function (response) {
    //   response.on("data",(data)=>{
    //     console.log(JSON.parse(data));

    //     if ((JSON.parse(data)).error_count === 0) {
    //       console.log(response.statusCode);
    //       res.sendFile(__dirname + '/success.html');
    //     } 
    //     else if ((JSON.parse(data)).errors[0].error_code === 'ERROR_CONTACT_EXISTS' || (JSON.parse(data)).errors[0].error_code === 'ERROR_GENERIC'){
    //       res.sendFile(__dirname + '/failure.html');
    //     };

    //   });
    // });

    // request.write(jsonData);
    // request.end();
    
  });

  app.post('/failure', (req, res) => {
    res.redirect("/");
  });

  app.post('/success', (req, res) => {
    res.redirect("/");
  });

  app.listen(process.env.PORT || 3000,  () => {
    console.log("Listening on port 3000");
  });
  
  
  // app.listen(3000, () => {
  //   console.log("Listening on port 3000");
  // });

  //API KEY MAILCHIMP
  //65638b53051875e3cf694b6dc1b0393a-us9

  //LIST ID MAILCHIMP
  //2cb89ce8c4

  //Server
  //us9
