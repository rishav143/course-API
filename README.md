# Notice
Project is currently in the working stage.
# course-API
Design database and APIs for application based courses on Airtribe.
# Description
![d (1)](https://github.com/rishav143/course-API/assets/93703303/807488cb-2432-4d05-a59a-1e679840d6f6)
# Usage
1. Open project's configuration file, named nodemon.json.
2. Add the following environment variable with your MongoDB Atlas password:
```   
{
    "env": {
        "MONGO_ATLAS_PW": "node-api" // add your mongodb password here
    }
}
```
4. Save the changes to your configuration file.
Now, your Node.js application can access the MongoDB Atlas password securely through the process.env.MONGO_ATLAS_PW variable.
