import express from "express";
import { Liquid } from "liquidjs";

// Vul hier jullie team naam in
const teamName = "Awesome";

const app = express();

app.use(express.static("public"));

const engine = new Liquid();
app.engine("liquid", engine.express());

app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));

app.get(["/", "/filter/:foodType"], async function (request, response) {
  const foodType = request.params.foodType || "all";

  let filterQuery = `{"_and":[{"squads":{"squad_id":{"tribe":{"name":"FDND Jaar 1"}}}},{"squads":{"squad_id":{"cohort":"2425"}}}]}`;

  if (foodType !== "all") {
    filterQuery = `{"_and":[{"fav_kitchen":"${foodType}"},{"squads":{"squad_id":{"tribe":{"name":"FDND Jaar 1"}}}},{"squads":{"squad_id":{"cohort":"2425"}}}]}`;
  }

  const allPeopleResponse = await fetch(`https://fdnd.directus.app/items/person/?fields=fav_kitchen&limit=-1`);
  const allPeopleJSON = await allPeopleResponse.json();

  let allFoods = [...new Set(allPeopleJSON.data.map((person) => person.fav_kitchen && person.fav_kitchen.trim()).filter(Boolean))].sort();

  const personResponse = await fetch(
    `https://fdnd.directus.app/items/person/?fields=*,squads.squad_id.name,squads.squad_id.cohort&filter=${encodeURIComponent(filterQuery)}`
  );
  const personResponseJSON = await personResponse.json();

  response.render("index.liquid", { pizzaLovers: personResponseJSON.data, foodOptions: allFoods });
});

app.get("/student/:id", async function (request, response) {
  const personDetailResponse = await fetch(`https://fdnd.directus.app/items/person/${request.params.id}`);
  const personDetailResponseJSON = await personDetailResponse.json();

  response.render("student.liquid", { person: personDetailResponseJSON.data });
});

app.post("/", async function (request, response) {
  await fetch("https://fdnd.directus.app/items/messages/", {
    method: "POST",
    body: JSON.stringify({
      for: `Team ${teamName}`,
      from: request.body.from,
      text: request.body.text,
    }),
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  response.redirect(303, "/");
});

app.set("port", process.env.PORT || 8000);
if (teamName == "") {
  console.log("Voeg eerst de naam van jullie team in de code toe.");
} else {
  app.listen(app.get("port"), function () {
    console.log(`Application started on http://localhost:${app.get("port")}`);
  });
}
