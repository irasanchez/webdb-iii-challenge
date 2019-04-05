const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const dbConfig = require("./knexfile.js");

const db = knex(dbConfig.development);

const server = express();

server.use(helmet());
server.use(express.json());

server.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await db("cohorts");
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.get("/api/cohorts/:id", async (req, res) => {
  try {
    const cohort = await db("cohorts")
      .where({ id: req.params.id })
      .first();
    res.status(200).json(cohort);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.post("/api/cohorts", async (req, res) => {
  try {
    const { id } = await db("cohorts").insert(req.body);

    const role = await db("cohorts")
      .where({ id })
      .first();

    res.status(201).json(role);
  } catch (err) {
    res.status(500).json(err);
  }
});

server.get("/api/cohorts/:id/students", (req, res) => {
  const cohortStudents = req.params.id;
  db.from("students")
    .where({ cohort_id: `${cohortStudents} ` })
    .then(students => {
      res.status(200).json(students);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.put("/api/cohorts/:id", async (req, res) => {
  try {
    const count = await db("cohorts")
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const cohort = await db("cohorts")
        .where({ id: req.params.id })
        .first();

      res.status(200).json(cohort);
    } else {
      res.status(404).json({ message: "Cohort not found" });
    }
  } catch (error) {}
});

server.delete("/api/cohorts/:id", async (req, res) => {
  try {
    const count = await db("cohorts")
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Cohort not found" });
    }
  } catch (error) {}
});

const port = process.env.PORT || 9090;
server.listen(port, () => console.log(`\n running on ${port} \n`));
