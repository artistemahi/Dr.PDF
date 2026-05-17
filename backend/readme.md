# initializing the app
- npm init 
- npm install 
- npm install express cors dotenv mongoose
- npm install -D typescript ts-node-dev @types/node @types/express
- npx tsc --init

# seting up the structure
- imported express 
- const app = express();
- app.listen(port,callback funtion for displaying the message)

# creating .env
- mongourl 
- no need to export any variable you can directly use using the process.env.variable_name

# creating server.tx/database.ts
- npm i mongoose 
- import mongoose from mongoose
- imported dotenv from "dotenv"
- dotenv.config()
- then uing the mongourl using process.env.mongourl
- connecDB arrow  async function 
- await mongoose.connect(string/mongourl)

# gitignore 
- adding node_module
- .env
- dist
- builds, etc 