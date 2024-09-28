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

// PUT /envelopes/:name: Update a specific budget envelope
app.put("/envelopes/:name", (req, res) => {
  const envelope = envelopes.find((e) => e.name === req.params.name);
  if (envelope) {
    const { name, budget } = req.body;
    if (name) envelope.name = name;
    if (budget) {
      if (envelope.budget > budget) {
        envelope.budget -= budget;
        totalBudget -= budget;
      } else if (envelope.budget < budget) {
        envelope.budget = budget;
        totalBudget += budget - envelope.budget;
      }
    }

    res.status(200).send({ envelope, totalBudget });
  }
});

// DELETE /envelopes/:name: Delete a specific budget envelope
app.delete("/envelopes/:name", (req, res) => {
  const envelopeIndex = envelopes.findIndex((e) => e.name === req.params.name);
  if (envelopeIndex !== -1) {
    const [deletedEnvelope] = envelopes.splice(envelopeIndex, 1);
    totalBudget -= deletedEnvelope.budget;
    res.status(200).send({ envelopes, deletedEnvelope });
  } else {
    res.status(404).send("Envelope not found");
  }
});

// POST /envelopes/transfer/:from/:to: Transfer budget from one envelope to another
app.post("/envelopes/transfer/:from/:to", (req, res) => {
  const { from, to } = req.params;
  let { amount } = req.body;
  amount = parseInt(amount);
  const fromEnvelope = envelopes.find((e) => e.name === from);
  const toEnvelope = envelopes.find((e) => e.name === to);

  if (!fromEnvelope || !toEnvelope) {
    return res.status(404).send("Envelope not found");
  }

  if (fromEnvelope.budget < amount) {
    return res.status(400).send("Insufficient funds");
  } else {
    fromEnvelope.budget -= amount;
    toEnvelope.budget += amount;

    return res.status(200).send({ fromEnvelope, toEnvelope });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
