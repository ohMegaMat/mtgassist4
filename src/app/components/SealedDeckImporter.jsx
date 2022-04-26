import React, { Component } from "react";

//const CARDS_DEFINITION = [
//	{ id: 1, count: 1, imageUrl: "/db/cards/WAR/001.jpg", name: "Karn, the Great Creator" },
//	{ id: 2, count: 1, imageUrl: "/db/cards/WAR/002.jpg", name: "Ugin, the Ineffable" },
//	{ id: 3, count: 1, imageUrl: "/db/cards/WAR/003.jpg", name: "Ugin's Conjurant" },
//	{ id: 4, count: 3, imageUrl: "/db/cards/WAR/004.jpg", name: "Ajani's Pridemate" }
//  ];

//var path = require("path");
var CARDS_DEFINITION = require("../db/sets/snc.json");

class SealedDeckImporter extends Component {
  constructor() {
    super();
    this.deckToImport = React.createRef();
  }

  importDeck = () => {
    let deck = { mainboard: [], sideboard: [] };

    // OBTIENE LA LISTA DE CARTAS DEL TEXTAREA
    let importPure = this.deckToImport.current.value;
    let lines = importPure.split("\n");
    let cards = lines.map(line => {
      let indexOfCardName = line.indexOf(" ");
      let cardCount = parseInt(line.slice(0, indexOfCardName), 10);
      let cardName = line.slice(indexOfCardName + 1);
      return { cardCount: cardCount, cardName: cardName };
    });
    cards = cards.filter(card => !isNaN(card.cardCount));
    // MATCH CADA CARTA DEL TEXTAREA CON LA CARTA DE LA DB Y LA AGREGA AL SIDEBOARD
    deck.sideboard = cards.map(card => {
      let cardDefinition = CARDS_DEFINITION.find(
        cardDefinition => cardDefinition.name === card.cardName
      );
      // console.log(card.cardName);
      let newCard = Object.assign({}, cardDefinition);
      newCard.count = card.cardCount;
      //newCard.manaWeight = this.getManaWeight(cardDefinition);
      newCard = this.setManaDetails(newCard, cardDefinition);
      newCard = this.setTypeDetails(newCard, cardDefinition);
      console.log(newCard);
      return newCard;
    });
    // CREAR EL DECK CORRESPONDIENTE
    this.props.onImportedDeck(deck);
  };

  /** The manaWeight defines de position in the cards list when orderer by color
   * A=Black, B=Green, C=Red, D=White, E=Blue, M=Multicolor, V=Colorless, Z=Land
   * followed by the total CMC number
   */
/*  getManaWeight = card => {
    let manaWeight = 0;
    let splitValue = card.manaCost
      .replace(/{/g, "")
      .replace(/}/g, "")
      .split("");
    splitValue.map(manaSymbol => {
      if (!isNaN(manaSymbol)) manaWeight += parseInt(manaSymbol, 10);
      else manaWeight += 1;
      return manaSymbol;
    });

    if (card.colors.length < 1) {
      if (card.types.includes("Land")) {
        manaWeight = "Z";
      }
      else {
        manaWeight = "V" + manaWeight;
      }
    } else if (card.colors.length > 1) {
      manaWeight = "M" + manaWeight;
    } else {
      switch (card.colors[0]) {
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
    return manaWeight;
  };
*/

  setManaDetails = (card, cardDefinition) => {
    let manaWeight = 0;
    let manaCost = 0;
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

//    let splitValue = cardDefinition.manaCost
//      .replace(/{/g, "")
//      .replace(/}/g, "")
//      .split("");
    let splitValue = cardDefinition.manaCost
      .split("}{");
    splitValue.map(manaSymbol => {
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

    // Determine manaWeight
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
          <select id="setToImport">
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
