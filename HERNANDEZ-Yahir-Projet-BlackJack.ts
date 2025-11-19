// valeurs possibles pour les cartes
let valores: (number | string)[] = [2,3,4,5,6,7,8,9,10,"J","Q","K","A"];

// mise de base et solde de départ
let apuestaIni: number = 9;
let saldoIni: number = 102;

//Efface l'écran
console.clear();
// Main
iniciarSimulacion(saldoIni, apuestaIni);

// carte aléatoire
function obtenerCarta(): number | string {
  let indice: number = Math.floor(Math.random() * valores.length);
  return valores[indice];
}

// distribue deux cartes
function repartirMano(): (number | string)[] {
  let mano: (number | string)[] = [];
  mano.push(obtenerCarta());
  mano.push(obtenerCarta());
  return mano;
}

// valeur numérique d'une carte alphabétique
function valorDeCarta(carta: number | string): number {
  if (carta === "J" || carta === "Q" || carta === "K") { return 10; }
  else if (carta === "A") { return 11; }
  else { return carta as number; }
}

// calcule la valeur totale d'une main
function valorDeMano(mano: (number | string)[]): number {
  let total: number = 0;
  let cantidadAs: number = 0;
  for (let i = 0; i < mano.length; i++) {
    const carta = mano[i];
    total += valorDeCarta(carta);
    if (carta === "A") { cantidadAs++; }
  }

  // ajuste les As de 11 à 1 s'il est nécessaire
  while (total > 21 && cantidadAs > 0) {
    total -= 10;
    cantidadAs--;
  }
  return total;
}

// vérifie si la main est un Blackjack (21)
function esBlackjack(mano: (number | string)[]): boolean {
  if (mano.length !== 2) { return false; }
  let total = valorDeMano(mano);
  if (total !== 21) { return false; }
  let carta1 = mano[0];
  let carta2 = mano[1];

  let asCarta1 = (carta1 === "A");
  let asCarta2 = (carta2 === "A");
  let diezCarta1 = (valorDeCarta(carta1) === 10);
  let diezCarta2 = (valorDeCarta(carta2) === 10);

  if ((asCarta1 && diezCarta2) || (asCarta2 && diezCarta1)) { return true; }
  return false;
}

// valeur de la carte visible du croupier pour la stratégie
function valorCroupier(carta: number | string): number {
  if (carta === "A")  return 11;
  else { return valorDeCarta(carta); }
}

// stratégie de base
function estrategiaJugador(totalJugador: number, cartaCroupier: number | string): string {
  let cartaArriba: number = valorCroupier(cartaCroupier);

  // "T" (tirer), "R" (rester), "D" (doubler)
  if (totalJugador <= 8) { return "T"; }
  if (totalJugador === 9) {
    if (cartaArriba >= 3 && cartaArriba <= 6) { return "D"; }
    else { return "T"; }
  }
  if (totalJugador === 10) {
    if (cartaArriba >= 2 && cartaArriba <= 9) { return "D"; }
    else { return "T"; }
  }
  if (totalJugador === 11) {
    if (cartaArriba >= 2 && cartaArriba <= 10) { return "D"; }
    else { return "T"; }
  }
  if (totalJugador === 12) {
    if (cartaArriba >= 4 && cartaArriba <= 6) { return "R"; }
    else { return "T"; }
  }
  if (totalJugador >= 13 && totalJugador <= 16) {
    if (cartaArriba >= 2 && cartaArriba <= 6) { return "R"; }
    else { return "T"; }
  }
  if (totalJugador >= 17) {
    return "R";
  }
  return "R";
}

// joue le tour du joueur en suivant la stratégie
function jugarConEstrategia(
  mano: (number | string)[], cartaVisibleCroupier: number | string): number {
  let seguir: boolean = true;

  while (seguir) {
    let total = valorDeMano(mano);
    console.log("Main actuelle:", mano, "Total:", total);

    if (total > 21) {
      console.log("Plus de 21");
      return total;
    }
    let decision: string;

    // choix de la stratégie selon main
    if (mano.length === 2 && esManoSuave(mano)) { decision = estrategiaConAs(total, cartaVisibleCroupier);}
    else { decision = estrategiaJugador(total, cartaVisibleCroupier);}

    if (decision === "R") {
      console.log("Rester avec:", total);
      seguir = false;
      return total;
    }
    else if (decision === "D") {
      mano.push(obtenerCarta());
      total = valorDeMano(mano);
      console.log("Main aprés du doubler:", mano, "Total:", total);
      return total;
    }
    else if (decision === "T") {
      mano.push(obtenerCarta());
    }
  }
  return valorDeMano(mano);
}

//joue le tour du croupier
function turnoCroupier(mano: (number | string)[]): number {
  console.log("Joue du croupier ");
  let seguir: boolean = true;

  while (seguir) {
    let total = valorDeMano(mano);
    console.log("Main croupier:", mano, "Total:", total);

    if (total <= 16) {
      mano.push(obtenerCarta());
    } else {
      console.log("Croupier reste avec:", total);
      seguir = false;
      return total;
    }
  }
  return valorDeMano(mano);
}

// détermine le résultat de la partie (victoire, défaite, nulle)
function resultadoDePartida(
  totalJugador: number,
  totalCroupier: number
): string {
  if (totalJugador > 21 && totalCroupier > 21) { return "nulle"; }
  if (totalJugador > 21) { return "defaite"; }
  if (totalCroupier > 21) { return "victoire"; }

  if (totalJugador > totalCroupier) { return "victoire"; }
  else if (totalJugador < totalCroupier) { return "defaite"; }
  else { return "nulle"; }
}

function esManoSuave(mano: (number | string)[]): boolean {
  let total: number = 0;
  let cantidadAs: number = 0;

  for (let i = 0; i < mano.length; i++) {
    const carta = mano[i];
    total += valorDeCarta(carta);
    if (carta === "A") {
      cantidadAs++;
    }
  }
  while (total > 21 && cantidadAs > 0) {
    total -= 10;
    cantidadAs--;
  }
  return cantidadAs > 0;
}

// stratégie spécifique pour les mains contenant un As
function estrategiaConAs(totalJugador: number, cartaCroupier: number | string): string {
  let cartaArriba: number = valorCroupier(cartaCroupier);

  if (totalJugador === 13 || totalJugador === 14) {
    if (cartaArriba >= 5 && cartaArriba <= 6) { return "D"; }
    else { return "T"; }
  }
  if (totalJugador === 15 || totalJugador === 16) {
    if (cartaArriba >= 4 && cartaArriba <= 6) { return "D"; }
    else { return "T"; }
  }
  if (totalJugador === 17) {
    if (cartaArriba >= 3 && cartaArriba <= 6) { return "D"; }
    else { return "T"; }
  }
  if (totalJugador === 18) {
    if (cartaArriba >= 3 && cartaArriba <= 6) { return "D"; }
    else if (cartaArriba === 2 || cartaArriba === 7 || cartaArriba === 8) { return "R"; }
    else { return "T"; }
  }
  if (totalJugador >= 19) {
    return "R";
  }
  return "T";
}

// identifie le type de paire
function tipoDePar(mano: (number | string)[]): string | number | null {
  if (mano.length < 2) { return null; }

  let carta1 = mano[0];
  let carta2 = mano[1];

  if (carta1 === "A" && carta2 === "A") { return "A"; }
  if (typeof carta1 === "number" && typeof carta2 === "number" && carta1 === carta2) { return carta1; }
  if (valorDeCarta(carta1) === 10 && valorDeCarta(carta2) === 10 && carta1 === carta2) { return 10; }
  return null;
}

// indique si la main est une paire ou non
function tienePar(mano: (number | string)[]): boolean {
  return tipoDePar(mano) !== null;
}

// stratégie dédiée aux paires
function estrategiaPares(par: string | number, cartaCroupier: number | string): string {
  let cartaArriba: number = valorCroupier(cartaCroupier);
  if (par === "A") { return "P"; }
  if (par === 10) { return "R"; }
  if (par === 9) {
    if (cartaArriba >= 2 && cartaArriba <= 6) { return "P"; }
    if (cartaArriba === 8 || cartaArriba === 9) { return "P"; }
    return "R";
  }
  if (par === 8) { return "P"; }
  if (par === 7) {
    if (cartaArriba >= 2 && cartaArriba <= 7) { return "P"; }
    else { return "T"; }
  }
  if (par === 6) {
    if (cartaArriba >= 2 && cartaArriba <= 6) { return "P"; }
    else { return "T"; }
  }
  if (par === 5) {
    if (cartaArriba >= 2 && cartaArriba <= 9) { return "D"; }
    else { return "T"; }
  }
  if (par === 4) {
    if (cartaArriba === 5 || cartaArriba === 6) { return "P"; }
    else { return "T"; }
  }
  if (par === 2 || par === 3) {
    if (cartaArriba >= 2 && cartaArriba <= 7) { return "P"; }
    else { return "T"; }
  }
  return "T";
}

// calcule la gain en fonction du résultat et du type de main
function gananciaSegunResultado(resultado: string, esBlackjack: boolean, apuesta: number): number {
  if (resultado === "defaite") { return 0; }
  if (resultado === "nulle") { return apuesta; }
  if (resultado === "victoire") {
    if (esBlackjack) { return apuesta * 2.5; }
    else { return apuesta * 2; }
  }
  return 0;
}

// simule une main complète du jouer et le croupier
function simularMano(apuesta: number): { ganancia: number, resultado: string } {
  let manoJugador: (number | string)[] = repartirMano();
  let manoCroupier: (number | string)[] = repartirMano();

  console.log("Cartes du jugador:", manoJugador);
  console.log("Cartes du croupier:", manoCroupier, " (visible:", manoCroupier[0], ")");

  let bjJugador = esBlackjack(manoJugador);
  let bjCroupier = esBlackjack(manoCroupier);

  if (bjJugador) { console.log("Blackjack du jugador"); }
  if (bjCroupier) { console.log("Blackjack du croupier"); }

  // Blackjack au début
  if (bjJugador || bjCroupier) {
    let resultado: string;
    let ganancia: number;

    if (bjJugador && !bjCroupier) {
      resultado = "victoire";
      ganancia = gananciaSegunResultado(resultado, true, apuesta);
    } else if (!bjJugador && bjCroupier) {
      resultado = "defaite";
      ganancia = gananciaSegunResultado(resultado, false, apuesta);
    } else {
      resultado = "nulle";
      ganancia = gananciaSegunResultado(resultado, false, apuesta);
    }

    console.log("C'est blackjack (resultado:", resultado, ", ganancia:", ganancia, ")");
    return { ganancia, resultado };
  }

  // split si le joueur a une paire
  if (tienePar(manoJugador)) {
    let tipoParJugador = tipoDePar(manoJugador);
    let accionPar = estrategiaPares(tipoParJugador as any, manoCroupier[0]);

    console.log("Pair detected! Tipo de par:", tipoParJugador);
    console.log("Selon le tableau de paires, acción:", accionPar, "(P=Split, R=Rester, T=Tirer, D=Doubler)");

    if (accionPar === "P") {
      console.log("Hacemos SPLIT real");
      let apuestaPorMano = apuesta / 2;

      let totalFinalCroupier = turnoCroupier(manoCroupier);
      console.log("Total final del croupier:", totalFinalCroupier);

      let gananciaTotal = 0;

      // au cas de split des As
      if (tipoParJugador === "A") {
        let mano1: (number | string)[] = ["A", obtenerCarta()];
        let mano2: (number | string)[] = ["A", obtenerCarta()];

        let total1 = valorDeMano(mano1);
        let total2 = valorDeMano(mano2);

        console.log("Main  1 (split As):", mano1, "Total:", total1);
        console.log("Main 2 (split As):", mano2, "Total:", total2);

        let res1 = resultadoDePartida(total1, totalFinalCroupier);
        let res2 = resultadoDePartida(total2, totalFinalCroupier);

        console.log("Resultat main 1:", res1);
        console.log("Resultat main 2:", res2);

        let g1 = gananciaSegunResultado(res1, false, apuestaPorMano);
        let g2 = gananciaSegunResultado(res2, false, apuestaPorMano);

        gananciaTotal = g1 + g2;

      } else {
        // au cas général des split des autres paires
        let carta1 = manoJugador[0];
        let carta2 = manoJugador[1];

        let mano1: (number | string)[] = [carta1, obtenerCarta()];
        let mano2: (number | string)[] = [carta2, obtenerCarta()];

        console.log("Mano 1 inicial (split):", mano1);
        console.log("Mano 2 inicial (split):", mano2);

        let totalFinalJugador1 = jugarConEstrategia(mano1, manoCroupier[0]);
        let totalFinalJugador2 = jugarConEstrategia(mano2, manoCroupier[0]);

        console.log("Total final jugador mano 1:", totalFinalJugador1);
        console.log("Total final jugador mano 2:", totalFinalJugador2);

        let res1 = resultadoDePartida(totalFinalJugador1, totalFinalCroupier);
        let res2 = resultadoDePartida(totalFinalJugador2, totalFinalCroupier);

        console.log("resultat main 1:", res1);
        console.log("resultat main 2:", res2);

        let g1 = gananciaSegunResultado(res1, false, apuestaPorMano);
        let g2 = gananciaSegunResultado(res2, false, apuestaPorMano);

        gananciaTotal = g1 + g2;
      }

      console.log("Ganancia total del split:", gananciaTotal);
      return { ganancia: gananciaTotal, resultado: "split" };
    }
  }

  // jeuu normal sans split
  let totalFinalJugador = jugarConEstrategia(manoJugador, manoCroupier[0]);
  console.log("Total final du jugador:", totalFinalJugador);

  let totalFinalCroupier = turnoCroupier(manoCroupier);
  console.log("Total final du croupier:", totalFinalCroupier);

  let resultado = resultadoDePartida(totalFinalJugador, totalFinalCroupier);
  let ganancia = gananciaSegunResultado(resultado, false, apuesta);

  console.log("Resultat final:", resultado, "Ganancia:", ganancia);

  return { ganancia, resultado };
}

// simulacion avec mise constante
function simulacionApuestaConstante(saldoInicial: number, apuesta: number): void {
  let saldo: number = saldoInicial;
  let contadorManos: number = 0;

  console.log("Solde initial:", saldo, "Mise constante:", apuesta);

  while (saldo >= apuesta && saldo < saldoInicial * 3) {
    console.log("Nueva mano. Solde actual:", saldo);

    saldo -= apuesta;
    console.log("Payer la mise:", apuesta, " -> solde aprés de payer:", saldo);

    let resultado = simularMano(apuesta);

    saldo += resultado.ganancia;
    contadorManos++;

    console.log("resultat main:", resultado.resultado, "Ganancia:", resultado.ganancia);
    console.log("Solde después de la mano:", saldo);
  }

  console.log("Total des mains jouée:", contadorManos);
  console.log("Solde final:", saldo);
}

// simulation d'une séquence avec mise variable
function simulacionApuestaVariable(saldo: number, apuestaBase: number): { saldo: number, exito: boolean } {
  let multiplicadores = [1, 2, 3];
  let exito = false;

  console.log("Solde au début de la séquence:", saldo);

  for (let i = 0; i < multiplicadores.length; i++) {
    let apuesta = apuestaBase * multiplicadores[i];

    if (saldo < apuesta) {
      console.log("Solde insuffisant pour miser", apuesta, "→ fin de séquence.");
      break;
    }

    console.log("Étape", i + 1, "- Mise:", apuesta, "Solde avant payer:", saldo);
    saldo -= apuesta;
    console.log("Solde après payer la mise:", saldo);
    let resultadoMano = simularMano(apuesta);

    saldo += resultadoMano.ganancia;
    console.log("Résultat de la main:", resultadoMano.resultado, "Gain:", resultadoMano.ganancia);
    console.log("Solde après la main:", saldo);
    if (
      multiplicadores[i] === 3 &&
      (resultadoMano.resultado === "victoire" || resultadoMano.resultado === "split")
    ) {
      exito = true;
      console.log("Séquence réussie (victoire avec une mise à 3x)!");
      break;
    }
  }

  console.log("Solde de fin de séquence:", saldo, "Succès:", exito);

  return { saldo, exito };
}

// simulation de 100 séquences à mise variable
function iniciarSimulacion(saldoInicial: number, apuestaBase: number): void {
  let saldo = saldoInicial;
  let contadorExitos = 0;
  let secuenciasJugadas = 0;

  console.log("Simulation de 100 séquences (mise variable)");
  console.log("Solde initial:", saldoInicial, "Mise de base:", apuestaBase);

  for (let i = 0; i < 100; i++) {
    console.log("\nSéquence", i + 1);
    // Arrêt si le solde a triplé
    if (saldo >= saldoInicial * 3) {
      console.log("Solde triplé, fin des séquences.");
      break;
    }

    if (saldo < apuestaBase) {
      console.log("Solde insuffisant pour commencer une nouvelle séquence.");
      break;
    }

    let resultadoSecuencia = simulacionApuestaVariable(saldo, apuestaBase);
    saldo = resultadoSecuencia.saldo;
    secuenciasJugadas++;

    if (resultadoSecuencia.exito) {
      contadorExitos++;
    }
  }

  console.log("-");
  console.log("Fin de la simulation.\nSéquences jouées:", secuenciasJugadas,"\nSéquences réussies:", contadorExitos,"\nSolde final:", saldo);
}
