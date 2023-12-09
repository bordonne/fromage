// script.js

const FROMAGES = [
 { code: 48845, nom: "Appenzeller Extra Lustenberger",
   unite: "kg", tarif: 22 },
 { code: 18718, nom: "Brezain Edelmont",
   unite: "kg", tarif: 16 },
 { code: 22509, nom: "Camembert de Bufflonne Past.",
   unite: "pcs", tarif: 4 },
 { code: 22432, nom: "Cheddar Bloc Mild Coloré WF",
   unite: "kg", tarif: 10 },
 { code: 22728, nom: "Cheddar Red Storm Aff. 21 mois",
   unite: "pcs", tarif: 5 },
 { code: 78808, nom: "Comté Grande Réserve Affinage en Grottes 26-32m 1/4 meule",
   unite: "kg", tarif: 23 },
 { code: 18280, nom: "Époisses Berthaut Perrière AOP ",
   unite: "kg", tarif: 21 },
 { code: 24733, nom: "Figuette Assortie Le Pic",
   unite: "pcs", tarif: 2 },
 { code: 18535, nom: "Gorgonzola Cuillère AOP",
   unite: "kg", tarif: 13 },
 { code: 77959, nom: "Gouda de Chèvre aux Truffes Affinage César Losfeld",
   unite: "kg", tarif: 24 },
 { code: 18866, nom: "Gruyère Suisse Réserve Pointe",
   unite: "kg", tarif: 26 },
 { code: 29749, nom: "Maroilles Bahardes Fermier AOC",
   unite: "pcs", tarif: 13 },
 { code: 24802, nom: "Mimolette Vieille Réserve 24 mois C Losfeld",
   unite: "kg", tarif: 24 },
 { code: 44121, nom: "Mozza Bufala AOP Tressée",
   unite: "pcs", tarif: 4 },
 { code: 26924, nom: "Parmigiano Regiano Boni 1/8 15 mois AOP",
   unite: "kg", tarif: 21 },
 { code: 18709, nom: "Raclette Lait Cru +8 sem Ermitage",
   unite: "kg", tarif: 13 },
 { code: 18736, nom: "Reblochon AOP Fruitier Thones",
   unite: "pcs", tarif: 14 },
 { code: 21472, nom: "Roquefort Vieux Berger 1/2",
   unite: "kg", tarif: 23 },
 { code: 48932, nom: "Sablé de Wissant Gamme Crémier",
   unite: "pcs", tarif: 9 },
 { code: 18422, nom: "St Nectaire Charrade Fermier Boite",
   unite: "kg", tarif: 23 },
 { code: 22173, nom: "Tomme aux Fleurs Sauvages",
   unite: "kg", tarif: 20 },
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

document.addEventListener("DOMContentLoaded", (event) => {
  for (let i = 0; i < FROMAGES.length; i++) {
    let fromage = FROMAGES[i];

    let col = document.getElementById('col'+(i%3+1));

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

});

console.log('La vérité se trouve dans le fromage.');
