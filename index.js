//import express and initialize app
//import morgan, cors, dotenv to create phoneNumber which is the models
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PhoneNumber = require("./models/phonenumber");
const phonenumber = require("./models/phonenumber");

//using build which stores front-end information
app.use(express.static("build"));

//turns json into an object and place it in req.body for use
app.use(express.json());

//allows cross origin resource sharing with cors library
app.use(cors());

//unknown Endpoint which shows an error
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

//initialize PORT
const PORT = process.env.PORT || 3001;

//create morgan token to add a person token which is person object from incoming req body
morgan.token("person", (req) => {
  const person = JSON.stringify(req.body);
  return person;
});

//use person object and other predefined tokens
//morgan to log info to console
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);

//initialize data persons
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

//routes get persons list
app.get("/api/persons", (request, response) => {
  PhoneNumber.find({}).then((notes) => {
    response.status(200).json(notes);
  });
});

//routes get a person id
app.get("/api/persons/:id", (request, response, next) => {
  PhoneNumber.findById(request.params.id)
    .then((number) => {
      if (number) {
        response.status(200).json(number);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

//routes get an info
app.get("/info", (request, response) => {
  PhoneNumber.find({}).then((number) => {
    const length = number.length;
    const date = new Date();
    response
      .status(200)
      .send(
        `<p>Phonebook has info for ${length} people. <br/> The date is ${date} </p>`
      );
  });
});

//delete a person
app.delete("/api/persons/:id", (request, response, next) => {
  PhoneNumber.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//post a person. generate a random Number large enough to not be duplicate
//set a new person based on req.body and check if person is not already on the list
//check to make sure user enter all fields and then add person to the list
app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const phoneNumber = new PhoneNumber({
    name: body.name,
    number: body.number,
  });

  phoneNumber
    .save()
    .then((number) => {
      response.status(200).json(number);
    })
    .catch((error) => next(error));
});

//update person by entering the same name
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    number: body.number,
  };

  PhoneNumber.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

//using the unknown endpoints to display unknown endpoint object
app.use(unknownEndpoint);

//error handlers
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

//listen on port
app.listen(PORT, () => {
  console.log(`Server Successful! Listening on Port ${PORT}`);
});
