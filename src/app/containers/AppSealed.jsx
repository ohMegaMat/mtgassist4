import React, { Component } from "react";
import SealedDeckImporter from "../components/SealedDeckImporter";
import SealedDeckEditor from "../components/SealedDeckEditor";
import DeckTester from "../components/DeckTester";

class AppSealed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: {
        mainboard: [
/*          {
            id: 1,
            count: 1,
            imageUrl: "/db/cards/WAR/001.jpg",
            name: "Karn, the Great Creator",
            types: ["Planeswalker"],
            manaWeight: "A2"
          },
          {
            id: 2,
            count: 1,
            imageUrl: "/db/cards/WAR/002.jpg",
            name: "Ugin, the Ineffable",
            types: ["Planeswalker"],
            manaWeight: "A2"
          }*/
        ],
        sideboard: [
/*          {
            id: 3,
            count: 1,
            imageUrl: "/db/cards/WAR/003.jpg",
            name: "Ugin's Conjurant",
            types: ["Creature"],
            manaWeight: "A2"
          },
          {
            id: 4,
            count: 3,
            imageUrl: "/db/cards/WAR/004.jpg",
            name: "Ajani's Pridemate",
            types: ["Creature"],
            manaWeight: "A2"
          }*/
        ]
      }
    };
  }

  updateDeck = deck => {
    let deckUpdated = Object.assign({}, deck);
    deckUpdated.mainboard = deck.mainboard.slice();
    deckUpdated.sideboard = deck.sideboard.slice();
    //	  console.log( "deckUpdated "+ JSON.stringify(deckUpdated) );
    this.setState({ deck: deckUpdated });
  };

  onImportedDeck = deck => {
    //	let deckCopy = Object.assign({}, this.state.deck);
    //    deckCopy.mainboard = deck.mainboard.slice();
    //    deckCopy.sideboard = deck.sideboard.slice();
    //    this.setState({ deck: deckCopy });
    this.updateDeck(deck);
  };

  onUpdateDeck = deck => {
    //	let deckCopy = Object.assign({}, this.state.deck);
    //    deckCopy.mainboard = deck.mainboard.slice();
    //    deckCopy.sideboard = deck.sideboard.slice();
    //    this.setState({ deck: deckCopy });
    this.updateDeck(deck);
  };

  render() {
    return (
      <div id="sealedDeckContainer">
        <SealedDeckImporter onImportedDeck={this.onImportedDeck} />
        <SealedDeckEditor
          onUpdateDeck={this.onUpdateDeck}
          deck={this.state.deck}
        />
        <DeckTester deck={this.state.deck} />
      </div>
    );
  }
}

export default AppSealed;
