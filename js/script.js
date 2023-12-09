// script.js

const FROMAGES = [
 { code: 48845, nom: "Appenzeller Extra Lustenberger",
    poids: 7, unite: "kg", cdt: 1, tarif: 22 },
 { code: 18718, nom: "Brezain Edelmont",
    poids: 5, unite: "kg", cdt: 1, tarif: 16 },
 { code: 22509, nom: "Camembert de Bufflonne Past.",
    poids: 0.25, unite: "pcs", cdt: 4, tarif: 4 },
 { code: 22432, nom: "Cheddar Bloc Mild Coloré WF",
    poids: 2.5, unite: "kg", cdt: 1, tarif: 10 },
 { code: 22728, nom: "Cheddar Red Storm Aff. 21 mois",
    poids: 0.2, unite: "pcs", cdt: 6, tarif: 5 },
 { code: 78808, nom: "Comté Grande Réserve Affinage en Grottes 26-32m 1/4 meule",
    poids: 10, unite: "kg", cdt: 1, tarif: 23 },
 { code: 18280, nom: "Époisses Berthaut Perrière AOP ",
    poids: 0.9, unite: "kg", cdt: 2, tarif: 21 },
 { code: 24733, nom: "Figuette Assortie Le Pic",
    poids: 0.065, unite: "pcs", cdt: 12, tarif: 2 },
 { code: 18535, nom: "Gorgonzola Cuillère AOP",
    poids: 6, unite: "kg", cdt: 1, tarif: 13 },
 { code: 77959, nom: "Gouda de Chèvre aux Truffes Affinage César Losfeld",
    poids: 4.5, unite: "kg", cdt: 1, tarif: 24 },
 { code: 18866, nom: "Gruyère Suisse Réserve Pointe",
    poids: 3, unite: "kg", cdt: 1, tarif: 26 },
 { code: 29749, nom: "Maroilles Bahardes Fermier AOC",
    poids: 0.72, unite: "pcs", cdt: 4, tarif: 13 },
 { code: 24802, nom: "Mimolette Vieille Réserve 24 mois C Losfeld",
    poids: 3.1, unite: "kg", cdt: 2, tarif: 24 },
 { code: 44121, nom: "Mozza Bufala AOP Tressée",
    poids: 0.25, unite: "pcs", cdt: 6, tarif: 4 },
 { code: 26924, nom: "Parmigiano Regiano Boni 1/8 15 mois AOP",
    poids: 4.5, unite: "kg", cdt: 2, tarif: 21 },
 { code: 18709, nom: "Raclette Lait Cru +8 sem Ermitage",
    poids: 5, unite: "kg", cdt: 1, tarif: 13 },
 { code: 18736, nom: "Reblochon AOP Fruitier Thones",
    poids: 0.55, unite: "pcs", cdt: 6, tarif: 14 },
 { code: 21472, nom: "Roquefort Vieux Berger 1/2",
    poids: 1.25, unite: "kg", cdt: 4, tarif: 23 },
 { code: 48932, nom: "Sablé de Wissant Gamme Crémier",
    poids: 0.4, unite: "pcs", cdt: 6, tarif: 9 },
 { code: 18422, nom: "St Nectaire Charrade Fermier Boite",
    poids: 1.65, unite: "kg", cdt: 1, tarif: 23 },
 { code: 22173, nom: "Tomme aux Fleurs Sauvages",
    poids: 6, unite: "kg", cdt: 1, tarif: 20 },
];

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

  let prix = fromage.unite == 'kg' ? input.value*0.001*fromage.tarif : input.value*fromage.tarif;
  // on ajoute la ligne dans la Commande
  var commandeLine = `
    <tr data-code="${fromage.code}">
      <td>${fromage.code}</td>
      <td>${fromage.nom.length > 25 ? fromage.nom.substring(0,24)+"..." : fromage.nom}</td>
      <td>${input.value} ${fromage.unite == 'kg' ? 'gr.' : 'pcs'}</td>
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

document.addEventListener("DOMContentLoaded", (event) => {
  for (let i = 0; i < FROMAGES.length; i++) {
    let fromage = FROMAGES[i];

    let col = document.getElementById('col'+(i%3+1));
    let stock = fromage.unite == 'pcs' ? `${fromage.cdt} pcs (${fromage.poids * 1000}g)` : `${fromage.poids * fromage.cdt}kg`;

    // On génère la carte qui correspond au fromage
    var fromageHTML = `
    <div class="w3-card w3-round w3-margin">
      <header class="w3-container w3-cell-row w3-padding">
        <h4 class="w3-cell">${fromage.nom}</h4>
        <h4 class="w3-cell">${fromage.tarif}€/${fromage.unite}</h4>
      </header>
      <div class="w3-container">
        <form onsubmit="return ajoutFromage(event, event.target);" data-code="${fromage.code}">
          <input type=number step=".01" class="w3-input w3-border" /> ${fromage.unite == 'kg' ? 'gr.' : 'pcs'}
          <a type="submit"
            onclick="return ajoutFromage(event, this.parentElement);"
            class="ajout w3-button w3-circle w3-ripple w3-deep-orange w3-hover-teal">+</a>
          <p class="stock"> Stock total: ${stock}</p>
          </form>
      </div>
    </div>
    `;
    col.innerHTML += fromageHTML;
  }

});

console.log('La vérité se trouve dans le fromage.');
