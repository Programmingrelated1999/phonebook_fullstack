const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://khmyat1999:${password}@phonebook.cs1mg.mongodb.net/?retryWrites=true&w=majority`;

const phoneSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

const Phone = mongoose.model("Phone", phoneSchema);

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
