exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("students")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("students").insert([
        { cohort_id: 3, name: "Ira Sanchez" },
        { cohort_id: 2, name: "Name" },
        { cohort_id: 3, name: "Person" }
      ]);
    });
};
