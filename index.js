const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Global variables to store envelopes and total budget
let envelopes = [];
let totalBudget = 0;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// POST /envelopes: create a new budget envelope
app.post("/envelopes", (req, res) => {
  const { name, budget } = req.body;

  if (!name || !budget) {
    return res.status(400).send("Name and budget are required");
  }

  const newEnvelope = { name, budget };
  envelopes.push(newEnvelope);
  totalBudget += budget;

  res.status(201).send(newEnvelope);
});

// GET /envelopes: get all budget envelopes
app.get("/envelopes", (req, res) => {
  res.status(200).send(envelopes);
});

// GET /envelopes/:name: get a specific budget envelope
app.get("/envelopes/:name", (req, res) => {
  const envelope = envelopes.find(
    (envelope) => envelope.name === req.params.name
  );

  if (envelope) {
    res.status(200).send(envelope);
  } else {
    res.status(404).send("Envelope not found");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
