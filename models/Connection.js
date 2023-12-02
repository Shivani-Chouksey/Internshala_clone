// const mongoose=require("mongoose")

// exports.connection=async()=>{
// try {
//    mongoose.set('strictQuery',false)

//    await mongoose.connect(process.env.MONGODB_URL) 
//    console.log("Database Connection Stablished")

// } catch (error) {
//     console.log(error.message)
// }
// }

const mongoose = require("mongoose");

exports.connection = async () => {
  try {
    mongoose.set('strictQuery', false);

    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database Connection Established");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
};
