import React, { Component } from "react";

var CARDS_DEFINITION; // = require("../db/sets/dmu.json");

class SealedDeckImporter extends Component {
  constructor() {
    super();
    this.setToImport = React.createRef();
    this.deckToImport = React.createRef();
  }

  importSetDefinition = async () => {
    let selectedSet = this.setToImport.current.value;
    let path = "../db/sets/"+ selectedSet +".json";
    return fetch(path, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
      .then(function(response){
        return response.json();
      })
      .then(function(myJson) {
        CARDS_DEFINITION = myJson;
      });
  };

  importDeck = () => {
    if( !CARDS_DEFINITION )
    {
      this.importSetDefinition()
        .then( () => { this.importDeck() } );
      return;
    }

    let deck = { mainboard: [], sideboard: [] };

    // OBTIENE LA LISTA DE CARTAS DEL TEXTAREA
    let importPure = this.deckToImport.current.value;
    let lines = importPure.split("\n");
    let cards = lines.map(line => {
      let indexOfCardName = line.indexOf(" ");
      let cardCount = parseInt(line.slice(0, indexOfCardName), 10);
      let cardName = line.slice(indexOfCardName + 1);
      // REMOVER SET CODE SI ESTA PRESENTE (" [SET]")
      let splitSet1 = cardName.split("[");
      if( splitSet1.length > 1 )
      {
        let splitSet2 = splitSet1[1].split("]");
        cardName = splitSet1[0].trim() + splitSet2[1].trim();
      }
      // REMOVER SET CODE SI ESTA PRESENTE (" (SET) Numero") (MTG Arena)
      splitSet1 = cardName.split("(");
      if( splitSet1.length > 1 )
      {
        let splitSet2 = splitSet1[1].split(")");
        cardName = splitSet1[0].trim() + splitSet2[1].trim();
      }
      return { cardCount: cardCount, cardName: cardName };
    });
    cards = cards.filter(card => !isNaN(card.cardCount));
    // MATCH CADA CARTA DEL TEXTAREA CON LA CARTA DE LA DB Y LA AGREGA AL SIDEBOARD
    deck.sideboard = cards.map(card => {
      let cardDefinition = CARDS_DEFINITION.find(
        cardDefinition => cardDefinition.name === card.cardName
      );
      console.log(card.cardName +" "+ cardDefinition.manaCost);
      let newCard = Object.assign({}, cardDefinition);
      newCard.count = card.cardCount;
      newCard = this.setManaDetails(newCard, cardDefinition);
      newCard = this.setTypeDetails(newCard, cardDefinition);
//      console.log(newCard);
      console.log(newCard.name +" "+ JSON.stringify(newCard.manaDetails) +" "+ newCard.manaWeight +" "+ newCard.manaCost);
      return newCard;
    });
    // CREAR EL DECK CORRESPONDIENTE
    this.props.onImportedDeck(deck);
  };

  setManaDetails = (card, cardDefinition) => {
    let manaWeight = 0;
    let manaCost = 0;
    // manaDetails -> u: blue symbols, b: black, w: white, r: red, g: green, explicitC: wastes, x: , c: colorless, h:
    let manaDetails = {
      u: 0,
      b: 0,
      w: 0,
      r: 0,
      g: 0,
      explicitC: 0,
      x: 0,
      c: 0,
      h: 0
    };

    // Double cards have double mana cost, separated by " // "
    let splitCosts = cardDefinition.manaCost.split(" // ");

    // Determine main spell mana details
    let mainSpell = splitCosts[0];
    let mainSpellSplitValue = mainSpell.split("}{");
    mainSpellSplitValue.map(manaSymbol => {
      manaSymbol = manaSymbol.replace(/{/g, "").replace(/}/g, "");
      if (!isNaN(manaSymbol)) {
        manaWeight += parseInt(manaSymbol, 10);
        manaCost += parseInt(manaSymbol, 10);
        manaDetails.c += parseInt(manaSymbol, 10);
      } else if (manaSymbol !== "") {
        manaWeight += 1;
        manaCost += 1;
        if (manaSymbol.includes("/")) {
          manaDetails.h += 1;
        }
        else {
          switch (manaSymbol) {
            case "B": {
              manaDetails.b += 1;
              break;
            }
            case "G": {
              manaDetails.g += 1;
              break;
            }
            case "R": {
              manaDetails.r += 1;
              break;
            }
            case "W": {
              manaDetails.w += 1;
              break;
            }
            case "U": {
              manaDetails.u += 1;
              break;
            }
            default: {
              break;
            }
          }
        }
      }
      return manaSymbol;
    });

    // Determine secondary spell mana details if exists
//    if( splitCosts.length > 1 ) {
//      let secondarySpell = splitCosts[1];
//      let secondarySpellSplitValue = secondarySpell.split("}{");
//      secondarySpellSplitValue.map(manaSymbol => {
//        manaSymbol = manaSymbol.replace(/{/g, "").replace(/}/g, "");
//        return manaSymbol;
//      });
//    }

    // Determine manaWeight
    /** The manaWeight defines de position in the cards list when orderer by color
     * A=Black, B=Green, C=Red, D=White, E=Blue, M=Multicolor, V=Colorless, Z=Land
     * followed by the total CMC number
     */
    if (cardDefinition.colors.length < 1) {
      if (cardDefinition.type.split(" ").includes("Land")) {
        manaWeight = "Z";
      }
      else {
        manaWeight = "V" + manaWeight;
      }
    } else if (cardDefinition.colors.length > 1) {
      manaWeight = "M" + manaWeight;
    } else {
      switch (cardDefinition.colors[0]) {
        case "B": {
          manaWeight = "A" + manaWeight;
          break;
        }
        case "G": {
          manaWeight = "B" + manaWeight;
          break;
        }
        case "R": {
          manaWeight = "C" + manaWeight;
          break;
        }
        case "W": {
          manaWeight = "D" + manaWeight;
          break;
        }
        case "U":
        default: {
          manaWeight = "E" + manaWeight;
          break;
        }
      }
    }

    card.manaWeight = manaWeight;
    card.manaCost = manaCost;
    card.manaDetails = manaDetails;

    return card;
  };

  setTypeDetails = (card, cardDefinition) => {
    let splitValue = cardDefinition.type.split(" ");
    let isSubType = false;
    let types = [];
    let subTypes = [];
    splitValue.forEach(type => {
      if (isSubType === true) {
        subTypes.push(type);
      } else if (type === "—") {
        isSubType = true;
      } else {
        types.push(type);
      }
    });

    card.types = types;
    card.subTypes = subTypes;

    return card;
  };

  render() {
    return (
      <div id="sealedDeckImporter">
        <div className="divLeft">
          <span>Expansion</span>
          <select id="setToImport" ref={this.setToImport} onChange={this.importSetDefinition}>
            <option value="woe">Wilds of Eldraine</option>
            <option value="one">Phyrexia, All will be One</option>
            <option value="dmu">Dominaria United</option>
            <option value="thb">Theros Beyond Death</option>
            <option value="m20">Core Set 2020</option>
            <option value="war">War of the Spark</option>
            <option value="snc">Streets of New Capenna</option>
          </select>
        </div>
        <div className="divRight">
          <textarea id="deckToImport" ref={this.deckToImport} />
          <button onClick={this.importDeck}>Search</button>
        </div>
      </div>
    );
  }
}

export default SealedDeckImporter;
