const mongoose = require("mongoose");

//if the process arguement length is less than 3 then there is no sufficient data since it will be node mongo.js password
if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

//set the password with value of 3rd arguement in command line
const password = process.argv[2];

//create a url with the password
const url = `mongodb+srv://khmyat1999:${password}@phonebook.cs1mg.mongodb.net/?retryWrites=true&w=majority`;

//create phoneSchema
const phoneSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});
//create a phone model
const Phone = mongoose.model("Phone", phoneSchema);

//if more than 3 arguements then it is adding the data node mongo.js password name number
if (process.argv.length > 3) {
  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");
      const phone = new Phone({
        name: process.argv[3],
        number: process.argv[4],
      });
      return phone.save();
    })
    .then(() => {
      console.log("Phone Number saved!");
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
} else {
  //if not more than 3 arguements nor less than 3 arguements, it is exactly 3 arguements. Then it is going to show a list of persons
  mongoose.connect(url).then(
    Phone.find({}).then((result) => {
      result.forEach((note) => {
        console.log(note);
      });
      mongoose.connection.close();
      console.log("Connection closed");
    })
  );
}
