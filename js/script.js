// script.js

let FROMAGES = [];

// Met a jour le total de la commande
function calcTotal() {
  let prix = document.querySelectorAll("#commandeTable .prix");
  let total = 0;

  prix.forEach(function (pri, i) {
      total += Number(pri.innerHTML);
  });
  total = total.toFixed(2);
  document.getElementById("total").innerHTML = total+" €"

  // Set le nombre de fromages dans la commande
  document.getElementById("nbcmd").innerHTML = prix.length ? ` (${prix.length})` : "";
}

function ajoutFromage(event, form) {
  event.preventDefault();

  // capte le nombre dans le input
  let input = form.querySelector('input');
  if (input.value <= 0){
    input.value = "";
    return;
  }

  let button = form.querySelector('.ajout');

  // on bloque le input et le bouton
  input.disabled = true;
  button.classList.add('w3-disabled', 'w3-teal');
  button.classList.remove('w3-deep-orange');
  button.innerHTML = "✓";

  // capte le fromage
  let fromage = FROMAGES.find((fromage) => fromage.code==form.dataset.code);

  let prix = input.value*fromage.tarif;
  // on ajoute la ligne dans la Commande
  var commandeLine = `
    <tr data-code="${fromage.code}">
      <td>${fromage.code}</td>
      <td>${fromage.nom.length > 25 ? fromage.nom.substring(0,24)+"..." : fromage.nom}</td>
      <td>${input.value} ${fromage.unite}</td>
      <td class="prix">${prix.toFixed(2)}</td>
      <td><a class="suppr w3-button w3-hover-white w3-text-grey w3-large material-symbols-outlined"
        onclick="return supprFromage(event, this.parentElement.parentElement)">delete</a></td>
    </tr>
  `
  commandeTable.innerHTML += commandeLine;

  // on met a jour le total
  calcTotal();
}

function supprFromage(event, line) {
  let code = line.dataset.code;
  line.remove();

  let form = document.querySelector(`form[data-code="${code}"]`);
  // reactive le form de ce fromage
  let input = form.querySelector('input');
  let button = form.querySelector('.ajout');
  input.disabled = false;
  input.value = "";
  button.classList.remove('w3-disabled', 'w3-teal');
  button.classList.add('w3-deep-orange');
  button.innerHTML = "+"

  calcTotal();
}

// Screen width
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

// Charger les prix
fetch('prix.json')
.then(response => response.json())
.then(data => {

  FROMAGES = data;
  let froLength = FROMAGES.length;

  for (let i = 0; i < froLength; i++) {
    let fromage = FROMAGES[i];

    let col = document.getElementById('col'+(i%3+1));

    // Mobile display
    if (width <= 600){
      col = document.getElementById('col'+(Math.floor(i/(Math.floor(froLength/3))+1)));
    }

    // On génère la carte qui correspond au fromage
    var fromageHTML = `
    <div class="fromage-card w3-card w3-round w3-margin">
      <header class="w3-container w3-cell-row w3-padding">
        <h4 class="w3-cell">${fromage.nom}</h4>
        <h4 class="w3-cell">${fromage.tarif}€/${fromage.unite}</h4>
      </header>
      <div class="w3-container w3-padding">
        <form onsubmit="return ajoutFromage(event, event.target);" data-code="${fromage.code}">
          <input type=number name="poids" step=".01" class="w3-input w3-border" /> ${fromage.unite}
          <a type="submit"
            onclick="return ajoutFromage(event, this.parentElement);"
            class="ajout w3-button w3-circle w3-ripple w3-deep-orange w3-hover-teal">+</a>
          </form>
      </div>
    </div>
    `;
    col.innerHTML += fromageHTML;
  }

  console.log('La vérité se trouve dans le fromage.');

})
.catch(error => console.error('Erreur lors du chargement du fichier JSON : ', error));
