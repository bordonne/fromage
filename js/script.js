// script.js

let FROMAGES = [];

const contactEmail = "fromage2024@bordonne.com";

// Met a jour le total de la commande
function calcTotal() {
  let prix = document.querySelectorAll("#commande-table .prix");
  let total = 0;

  prix.forEach(function (pri, i) {
      total += Number(pri.innerHTML);
  });
  total = total.toFixed(2);
  document.getElementById("total").innerHTML = total+" €"

  // Set le nombre de fromages dans la commande
  document.getElementById("nbcmd").innerHTML = prix.length ? ` (${prix.length})` : "";
}

function sortCommand() {
  const tbody = document.querySelector('#commande-table tbody');

  const rows = Array.from(tbody.querySelectorAll('tr.command-line'));

  // Trie les lignes par le texte de la 2ème colonne (le nom du fromage)
  rows.sort((rowA, rowB) => {
    const fromageA = rowA.children[1].textContent.trim().toLowerCase();
    const fromageB = rowB.children[1].textContent.trim().toLowerCase();
    
    return fromageA.localeCompare(fromageB);
  });

  tbody.innerHTML = '';
  rows.forEach(row => tbody.appendChild(row));
}

function ajoutFromage(event, form) {
  event.preventDefault();

  // capte le nombre dans le input
  let input = form.querySelector('input');
 
  // capte le fromage
  let fromage = FROMAGES.find((fromage) => fromage.code==form.dataset.code);

  let commandLine = document.querySelector(`.command-line[data-code='${fromage.code}']`);

  let prix = input.value*fromage.tarif;

  if (input.value === "" || input.value === "0" || input.value === "0."){
    if (commandLine) {
      supprFromage(event, commandLine);
    } else {
      return;
    }
  } else {
    if (commandLine) {
      commandLine.querySelector('.quantite').innerHTML = input.value+" "+fromage.unite;
      commandLine.querySelector('.prix').innerHTML = prix.toFixed(2);
    } else {
      // On ajoute la ligne dans la Commande
      var commandeLine = `
        <tr class="command-line" data-code="${fromage.code}">
          <td>${fromage.code}</td>
          <td>${fromage.nom.length > 25 ? fromage.nom.substring(0,24)+"..." : fromage.nom}</td>
          <td class="quantite">${input.value} ${fromage.unite}</td>
          <td class="prix">${prix.toFixed(2)}</td>
          <td><a class="suppr w3-button w3-hover-white w3-text-grey w3-large material-symbols-outlined"
            onclick="return supprFromage(event, this.parentElement.parentElement)">delete</a></td>
        </tr>
      `
      let commandeTable = document.querySelector("#commande-table tbody");
      commandeTable.innerHTML += commandeLine;

    }
    // on met a jour le total
    calcTotal();
    sortCommand();
  }
}

function supprFromage(event, line) {
  let code = line.dataset.code;
  line.remove();

  let form = document.querySelector(`form[data-code="${code}"]`);
  // reactive le form de ce fromage
  let input = form.querySelector('input');
  input.disabled = false;
  input.value = "";

  calcTotal();
}

function sendByMail() {
  var info = document.getElementById("commande-info");
  var nom = info.querySelector("input[name=nom]").value;
  var subject = `Commande fromage ${nom}`;

  var body = `<!DOCTYPE html>
  <html>
  <div>
    <div>Nom : ${nom}</div>
    <div>Email : ${info.querySelector("input[name=email]").value}</div>
    <div>Moyen de paiement : ${info.querySelector("select[name=payment]").value}</div>
    <div>Total : ${document.getElementById("total").innerHTML}</div>
  </div>`;
  body += "<table>";
  body += document.getElementById('commande-table').innerHTML;
  body += "</table></html>";

  // Send email
  window.location = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
}

// Screen width
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

// Charger les prix
fetch('prix.json')
.then(response => response.json())
.then(data => {

  FROMAGES = data;

  for (let i = 0; i < FROMAGES.length; i++) {
    let fromage = FROMAGES[i];

    let col = document.getElementById('col'+(i%3+1));
    let divider = Math.floor(FROMAGES.length/3);

    if (i == (FROMAGES.length - 1)) {
      col = document.getElementById('col3');
    } else if (width <= 600){
      col = document.getElementById('col'+(Math.floor(i/divider)+1));
    }

    // On génère la carte qui correspond au fromage
    var fromageHTML = `
    <div class="fromage-card w3-card w3-round w3-margin">
        <div class="img-fromage">
          <img src="img/${fromage.code}.png" alt="${fromage.nom}">
        </div>

        <div class="form-fromage">
          <header>
            <h4 class="nom">${fromage.nom}</h4>
            <h4 class="prix">${fromage.tarif}€/${fromage.unite}</h4>
          </header>
          <form onsubmit="return ajoutFromage(event, event.target);" data-code="${fromage.code}">
            <input type=number name="poids" step=".001" class="w3-input w3-border"
              oninput="return ajoutFromage(event, this.parentElement);" /> ${fromage.unite}
          </form>
      </div>
    </div>
    `;
    col.innerHTML += fromageHTML;
  }

  console.log('La vérité se trouve dans le fromage.');

})
.catch(error => console.error('Erreur lors du chargement du fichier JSON : ', error));
