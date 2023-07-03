require('dotenv').config();

const {
  readInput,
  inquirerMenu,
  pause,
  listPlaces,
} = require('./helpers/inquirer');
const Searches = require('./models/searches');

const main = async () => {
  const searches = new Searches();
  let opt;

  do {
    opt = await inquirerMenu();
    switch (opt) {
      case 1:
        // show message
        const term = await readInput('City: ');

        // search places
        const places = await searches.city(term);

        // select place
        const id = await listPlaces(places);
        if (id === '0') continue;
        const selectedPlace = places.find(p => p.id === id);

        // save in DB
        searches.addHistory(selectedPlace.name);

        // climate
        const climate = await searches.climatePlace(
          selectedPlace.lat,
          selectedPlace.lng
        );

        // show results
        console.clear();
        console.log('\nCity information\n'.blue);
        console.log('City:', selectedPlace.name.red);
        console.log('Lat:', selectedPlace.lat);
        console.log('Lng:', selectedPlace.lng);
        console.log('Temp:', climate.temp);
        console.log('Min:', climate.min);
        console.log('Max:', climate.max);
        console.log('Description:', climate.desc.red);
        break;

      case 2:
        searches.capitalizedHistory.forEach((place, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${place}`);
        });
        break;
    }

    if (opt !== 0) await pause();
  } while (opt !== 0);
};
main();
