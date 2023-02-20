let M = {};

let C = {};

let V = {};

// M.data représente le tableau d'objets

let load = async function(){
  let response = await fetch("../bdd/data.json");
  M.data = await response.json(); // M.data est notre tableau de valeurs
  C.init();
};

load();

// -------------------------------- MODULE ------------------------------------ //


// RENVOIE TOUTES LES INFOS D'UN POINT
M.getInfosAllPoints = function(debut, fin){
  let data = M.data
  let infos = [];
  for (const elt of data) {
    if ((elt.year > debut) && (elt.year < fin)) {
      let lat = elt.reclat
      let long = elt.reclong
      let annee = elt.year
      let nom = elt.name
      let type = ""
      if (elt.recclass == "") {
        type = "none"
      }
      else{
        type = elt.recclass
      }
      let obj = {
        latitude: lat,
        longitude: long,
        year: annee,
        nom: nom,
        class: type
      };
      infos.push(obj);  
    }
  }
  return infos

}

// RETOURNE LE NOMBRE DE M POUR UNE ANNEE DONNEE
M.getAllByYear = function(annee){
  let year = annee;
  let data = M.data;
  let number = 0;
  for (const elt of data) {
    if (elt.year == year) {
      number = number + 1;
    }    
  }
  return number;
}

// RETOURNE TOUTES LES ANNÉES OU AU MOINS UNE MÉTÉORITE EST TOMBÉE (sans doublon)
M.getAllYear = function(){
  let trueData = [];
  let data = M.data;
  for (const elt of data) {
    if (elt.year !== "") {
      trueData.push(elt.year)
    }
  }
  let trueDataUnique = trueData.filter((x, i) => trueData.indexOf(x) === i);
  trueDataUnique.sort()
  return trueDataUnique; 
}


// CREE UN TABLEAU DE TOUT LES NOMBRES DE LA VALEUR FIRST A LAST
M.createArrayYears = function(first, last){
  let arr = [];
  let beg = first - 1
  let calc = last - (first - 1)
  for (let i = 0; i < calc; i++) {
    beg = beg + 1
    arr.push(beg)
  }
  return arr
}


// RETOURNE UN TABLEAU DE TOUTES LES ANNEES ET LE NOMBRE DE M TOMBEES
M.getDrops = function(){
  let arr = M.getAllYear();
  let year = 0;
  let number = 0;
  let tab = [];

  for (const elt of arr) {
    number = M.getAllByYear(elt);
    year = elt;
    let obj = {
      annee: year,
      amount: number
    };
    tab.push(obj);
  }

  return tab;
}

// RETOURNE UN TABLEAU AVEC LES ANNEES OU LE PLUS GRAND NOMBRE DE M SONT TOMBEES
M.sortDrops = function(){
  function sortFloat(a,b) { return b - a; };
  let data = M.getDrops();
  let result = [];
  for (const elt of data){
    let nombre = elt.amount;
    result.push(nombre);
  }
  let sorted = result.sort(sortFloat);

  return sorted;
}


// RETOURNE UN TABLEAU CONTENTANT LE NOMBRE DE METEORITES TOMBEES PAR ANNEES
M.sortDropsByYear = function (){
  let drops = M.getDrops();
  let amount = M.sortDrops();
  let result = [];
  for (const year of drops){
    for (let i = 0; i < 5; i++){
      if (amount[i] == year.amount){
        // let obj = {
        //   annee: year,
        //   amount: year.amount,
        // }
        result.push(year);
      }
    }
  }
  return result;
}




// RETOURNE UN TABLEAU AVEC L'ANNEE AVC LE PLUS DE M ET LE NBR DE M
M.getHighestDrop = function(){
  let arr = M.getAllYear();
  let max = 0;
  let year = 0;
  let number = 0;

  for (const elt of arr) {
    number = M.getAllByYear(elt);
    if (number > max) {
      max = number;
      year = elt
    }
  }

  let obj = {
    annee: year,
    amount: max
  };

  return obj;
}

// RETOURNE UN TABLEAU AVEC L'ANNEE AVC LE PLUS DE M ET LE NBR DE M POUR UNE PERIODE DONNEE
M.getHighestDropByYear = function(first, last){
  let arr = M.createArrayYears(first, last);
  let max = 0;
  let year = 0;
  let number = 0;

  for (const elt of arr) {
    number = M.getAllByYear(elt);
    if (number > max) {
      max = number;
      year = elt
    }
  }

  let obj = {
    annee: year,
    amount: max
  };

  return obj;
}


// RETOURNE UN TABLEAU AVEC LE NBR DE M TROUVEES ET TOMBEES
M.getFellFound = function() {
  let data = M.data;
  let fell = 0;
  let found = 0;
  for (const elt of data) {
    if (elt.fall == "Fell") {
      fell = fell + 1;  
    }
    else if (elt.fall == "Found"){
      found = found + 1;
    }
  }

  let obj = {
    found: found,
    fell: fell,
  }

  return obj;
}

// -------------------------------- VUE ------------------------------------ //

V.init = function(){
  let surv = doucment.querySelector('.explore__content--map');
  surv.addEventListener("click", C.handler_clickOnMarker);
}



////////////// MAP //////////////////

var map = L.map('map').setView([46.729699, 7.742685],  3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/*
var marker = L.marker([50.775, 6.08333]).addTo(map);
marker.bindPopup("<b>Je suis AACHEN!</b><br>Je suis tombée en 1991").openPopup();
*/ 
// ce qui met un marqueur

V.placeMarqueur = function(lat, long, name, year){
  var marker = L.marker([lat, long]).addTo(map).on('click', function(e) {
  C.getInfoByGeoloc(e.latlng);
  });;
  marker.bindPopup("<b>Je suis "+ name +"!</b><br>Je suis tombée en " + year).openPopup();
}


V.formatSelected = function(name, id, mass, fell, geoloc, year, recclass){
  // Ajouter vos instructions ici (voir la question 1)
  let template = document.querySelector(".template__selected");
  let html = template.innerHTML;
  html = html.replaceAll("{{name}}", name);
  html = html.replaceAll("{{id}}", id);
  html = html.replaceAll("{{mass}}", mass);
  html = html.replaceAll("{{fell}}", fell);
  html = html.replaceAll("{{geoloc}}", geoloc);
  html = html.replaceAll("{{year}}", year);
  html = html.replaceAll("{{recclass}}", recclass);
  return html;
}




V.renderSelected = function(data){
  let where= document.querySelector(".selected__list--template");
  let visible = document.querySelector(".selected__content")
  visible.style.setProperty("visibility", "visible")
  let html = "";
  html += V.formatSelected(data.name, data.id, data.mass, data.fall, data.GeoLocation, data.year, data.recclass);   
  where.innerHTML = html;
}






// -------------------------------- CONTROLLER ------------------------------------ //


//////////////// SEARCH BAR /////////////////////////

const meteorsList = document.querySelector('.suggestion--list');
const searchBar = document.querySelector('.searchBar');

searchBar.addEventListener('keyup', (e) => {
    let data = M.data;
    const searchString = e.target.value.toLowerCase();
    console.log(e.target.value)
    const filteredMeteors = data.filter((meteor) => {
        return meteor.name.toLowerCase().includes(searchString); 
    });
    displayList(filteredMeteors);
});



const displayList = (meteorsResult) => {
    const htmlString = meteorsResult.map((data) => {
            return `
            <li class="suggestion--list_item">
                <h2>${data.name}</h2>
                <p>Year: ${data.year}</p>
                <p>Location: ${data.GeoLocation}</p>
                <p>Mass (g): ${data.mass}</p>
            </li>
        `;
        })
        .join('');
    meteorsList.innerHTML = htmlString;
};


////////////////// MAP ///////////////////////////////////

C.placeAllMarqueur = function(debut, fin) {
  let points = M.getInfosAllPoints(debut, fin)
  for (const elt of points) {
    V.placeMarqueur(elt.latitude, elt.longitude, elt.nom, elt.year)
  }
}

//////////////// GRAPH PARAMETERS ////////////////////////

Chart.defaults.color = '#fff';
Chart.defaults.plugins.legend.reverse = true;

// Chart.defaults.plugins.legend.display = false;




//////////////// DONUT GRAPH ////////////////////////
C.createDonutGraph = function(){
  const donut = document.querySelector('.donutGraph');
	let stats = M.getFellFound()  
  new Chart(donut, {
      type: 'doughnut',
      data: {
          labels: ['Fell', 'Found'],
          datasets: [{
              label: 'Number',
              data: [stats.fell, stats.found],
              borderWidth: 1.5,
              tension: 0.3,
              backgroundColor: [
                'rgb(66,106,140)',
                'rgb(81, 157, 234)'
              ]
          }]
      },
  });
}


//////////////// POLAR AREA GRAPH ////////////////////////
C.createPolarGraph = function (){
  const polar = document.querySelector('.polarGraph');
  let data = M.sortDropsByYear();
  let year = [];
  let amount = [];
  for (const elt of data) {
    let annee = elt.annee;
    year.push(annee);
  }
  for (const elt of data) {
    let nombre = elt.amount;
    amount.push(nombre);
  }
  new Chart(polar, {
      type: 'polarArea',
      data: {
          labels: [year[0],year[1],year[2],year[3],year[4]],
          datasets: [{
              label: 'Number of meteors fallen',
              data: [amount[0], amount[1], amount[2], amount[3], amount[4]],
              borderWidth: 0,
              backgroundColor: [
                  'rgb(66,106,140)',
                  'rgb(115,162,191)',
                  'rgb(208, 229, 242)',
                  'rgb(81, 157, 234)',
                  'rgb(96, 140, 206)'
              ]       
          }]
      },
  });
}

    


//////////////// LINE GRAPH ////////////////////////
C.createLineGraph = function (debut, fin){
  const line = document.querySelector('.lineGraph');
  let abscisse = M.createArrayYears(debut, fin)
  let ordonnee = []
  data = function(){
    for (const elt of abscisse) {
      let value = M.getAllByYear(elt)
      ordonnee.push(value)
    }
    return ordonnee
  }
  new Chart(line, {
      type: 'line',
      data: {
          labels: abscisse,
          datasets: [{
              label: 'number of falls',
              data: data(),
              borderWidth: 1,
              fill: true,
              pointBackgroundColor: 'white',
              pointBorderColor: 'white',
              tension: 0.3,
              pointStyle: 'dot',
              color:'#fff',
          }]
      },
  });
}



C.getInfoByGeoloc = function(latlong){
  let data = M.data;
  let obj = latlong;
  let lat = obj.lat;
  let long = obj.lng;
  for (const elt of data) {
    if ((lat == elt.reclat) && (long == elt.reclong)) {
      V.renderSelected(elt);
    }
  }
}



C.init = function(){
  C.placeAllMarqueur(1900, 1920);
  C.createLineGraph(1972, 2013);
  C.createDonutGraph();
  C.createPolarGraph();
}