import express from 'express'

import { Liquid } from 'liquidjs';


// Vul hier jullie team naam in
const teamName = 'Awesome';


const app = express()

app.use(express.static('public'))

const engine = new Liquid();
app.engine('liquid', engine.express()); 

app.set('views', './views')

app.use(express.urlencoded({extended: true}))


app.get('/', async function (request, response) {
  const personResponse = await fetch('https://fdnd.directus.app/items/person/?sort=name&fields=*,squads.squad_id.name,squads.squad_id.cohort&filter={%22_and%22:[{%22squads%22:{%22squad_id%22:{%22tribe%22:{%22name%22:%22FDND%20Jaar%201%22}}}},{%22squads%22:{%22squad_id%22:{%22cohort%22:%222425%22}}},{%22squads%22:{%22squad_id%22:{%22name%22:%221G%22}}}]}')
  const personResponseJSON = await messagesResponse.json()

  response.render('index.liquid',{persons: personResponseJSON.data, squads: squadResponseJSON.data})
    teamName: teamName,
    messages; messagesResponseJSON.data
  })

app.get('/landing', async function (request, response) {  
  response.render('landingpagina.liquid')
})

app.post('/', async function (request, response) {
  await fetch('https://fdnd.directus.app/items/messages/', {
    method: 'POST',
    body: JSON.stringify({
      for: `Team ${teamName}`,
      from: request.body.from,
      text: request.body.text
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });

  response.redirect(303, '/')
})

if (teamName == '') {
  console.log('Voeg eerst de naam van jullie team in de code toe.')
} else {
  app.listen(app.get('port'), function () {
    console.log(`Application started on http://localhost:${app.get('port')}`)
  })
}

app.get('/hobby/:hobby', async function (request, response) {
  console.log(request.params);
  const fav_hobby = request.params.hobby;

  if (fav_hobby === 'alle-hobbies') {
    const hobbies = await fetch('https://fdnd.directus.app/items/person/?sort=name&fields=*,squads.squad_id.name,squads.squad_id.cohort&filter={%22_and%22:[{%22squads%22:{%22squad_id%22:{%22tribe%22:{%22name%22:%22FDND%20Jaar%201%22}}}},{%22squads%22:{%22squad_id%22:{%22cohort%22:%222425%22}}},{%22squads%22:{%22squad_id%22:{%22name%22:%221G%22}}}]}&fields=id,name,avatar,bio,fav_book_genre');
    const hobbiesJSON = await hobbies.json();
    response.render('index.liquid', { persons: hobbiesJSON.data });
  }   else {

    const hobbies = await fetch(`https://fdnd.directus.app/items/person/?sort=name&fields=*,squads.squad_id.name,squads.squad_id.cohort&filter={"_and":[{"fav_book_genre":{"_icontains":"${favBook}"}},{"squads":{"squad_id":{"tribe":{"name":"FDND Jaar 1"}}}},{"squads":{"squad_id":{"cohort":"2425"}}},{"squads":{"squad_id":{"name":"1G"}}}]}&fields=id,name,avatar,bio,fav_book_genre`);
    const hobbiesJSON = await hobbies.json();
    response.render('index.liquid', { persons: hobbies.data });
  }
});

app.get('/student/:id', async function (request, response) {
  const personDetailResponse = await fetch('https://fdnd.directus.app/items/person/' + request.params.id)
  response.render('student.liquid', {person: personDetailResponseJSON.data, squads: squadResponseJSON.data})
})


app.set('port', process.env.PORT || 8000)
