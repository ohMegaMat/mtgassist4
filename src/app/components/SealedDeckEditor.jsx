import React, { Component } from "react";
import CardsList from "./CardsList";
import DeckStats from "./DeckStats";
import { VIEW_STANDARD, VIEW_IMAGEONLY } from "../components/CardsListItem";

const LANDS_DEFINITION = [
  { id: 250, types: ["Land"], imageUrl: "/db/cards/Lands/plains.jpg", name: "Plains" },
  { id: 253, types: ["Land"], imageUrl: "/db/cards/Lands/island.jpg", name: "Island" },
  { id: 256, types: ["Land"], imageUrl: "/db/cards/Lands/swamp.jpg", name: "Swamp" },
  { id: 259, types: ["Land"], imageUrl: "/db/cards/Lands/mountain.jpg", name: "Mountain" },
  { id: 262, types: ["Land"], imageUrl: "/db/cards/Lands/forest.jpg", name: "Forest" }
];

class SealedDeckEditor extends Component {
  onMainBoardCardClick = cardParam => {
    //		console.log( "onMainBoardCardClick" );

    let { deck } = this.props;
    let deckCopy = Object.assign({}, deck);

    // SI ES LA UNICA CARTA, ELIMINARLA
    deckCopy.mainboard = deck.mainboard.slice();
    let cardInMainBoard = deckCopy.mainboard.find(
      card => card.id === cardParam.id
    );
    if (cardInMainBoard.count > 1) {
      cardInMainBoard.count--;
    } else {
      deckCopy.mainboard = deckCopy.mainboard.filter(
        card => card.id !== cardParam.id
      );
    }

    // SI NO ES TIERRA BASICA, PASAR LA CARTA AL SIDEBOARD
    let landCard = LANDS_DEFINITION.find(card => card.id === cardParam.id);
    if (landCard === undefined) {
      deckCopy.sideboard = deck.sideboard.slice();
      let cardInSideBoard = deckCopy.sideboard.find(
        card => card.id === cardParam.id
      );
      if (cardInSideBoard !== undefined) {
        cardInSideBoard.count++;
      } else {
        let newCard = Object.assign({}, cardInMainBoard);
        newCard.count = 1;
        deckCopy.sideboard.push(newCard);
      }
    }

    // ACTUALIZAR EL DECK
    this.props.onUpdateDeck(deckCopy);
  };

  onSideBoardCardClick = cardParam => {
    //		console.log( cardId );

    let { deck } = this.props;
    let deckCopy = Object.assign({}, deck);

    // SI ES LA UNICA CARTA, ELIMINARLA
    deckCopy.sideboard = deck.sideboard.slice();
    let cardInSideBoard = deckCopy.sideboard.find(
      card => card.id === cardParam.id
    );
    //		console.log( "cardInSideBoard "+ cardInSideBoard );
    if (cardInSideBoard.count > 1) {
      cardInSideBoard.count--;
    } else {
      deckCopy.sideboard = deckCopy.sideboard.filter(
        card => card.id !== cardParam.id
      );
    }
    //		console.log( "deckCopy "+ JSON.stringify(deckCopy) );

    // SI NO ES TIERRA BASICA, PASAR LA CARTA AL MAINBOARD
    deckCopy.mainboard = deck.mainboard.slice();
    let cardInMainBoard = deckCopy.mainboard.find(
      card => card.id === cardParam.id
    );
    //		console.log( "cardInMainBoard "+ cardInMainBoard );
    if (cardInMainBoard !== undefined) {
      cardInMainBoard.count++;
    } else {
      let newCard = Object.assign({}, cardInSideBoard);
      newCard.count = 1;
      deckCopy.mainboard.push(newCard);
    }

    //		console.log( "deckCopy "+ JSON.stringify(deckCopy) );
    // ACTUALIZAR EL DECK
    this.props.onUpdateDeck(deckCopy);
  };

  onClearMainBoardClick = () => {
    let { deck } = this.props;
    let deckCopy = Object.assign({}, deck);
    deckCopy.mainboard = deck.mainboard.slice();
    deckCopy.sideboard = deck.sideboard.slice();
    
    deckCopy.mainboard.forEach(cardInMainBoard => {
      // SI NO ES TIERRA BASICA, PASAR LA CARTA AL SIDEBOARD
      let landCard = LANDS_DEFINITION.find(card => card.id === cardInMainBoard.id);
      if (landCard === undefined) {
        let cardInSideBoard = deckCopy.sideboard.find(
          card => card.id === cardInMainBoard.id
        );
        if (cardInSideBoard !== undefined) {
          cardInSideBoard.count += cardInMainBoard.count;
        } else {
          let newCard = Object.assign({}, cardInMainBoard);
          newCard.count = cardInMainBoard.count;
          deckCopy.sideboard.push(newCard);
        }
      }
    });

    // LIMPIAR MAINBOARD
    deckCopy.mainboard = [];

    // ACTUALIZAR EL DECK
    this.props.onUpdateDeck(deckCopy);
  }

  addCard = cardId => {
    let { deck } = this.props;
    let deckCopy = Object.assign({}, deck);

    // AGREGAR LA CARTA AL MAINBOARD
    deckCopy.mainboard = deck.mainboard.slice();
    let cardInMainBoard = deckCopy.mainboard.find(card => card.id === cardId);
    //		console.log( "cardInMainBoard "+ cardInMainBoard );
    if (cardInMainBoard !== undefined) {
      cardInMainBoard.count++;
    } else {
      let landCard = LANDS_DEFINITION.find(card => card.id === cardId);
      let newCard = Object.assign({}, landCard);
      newCard.count = 1;
      deckCopy.mainboard.push(newCard);
    }

    //		console.log( "deckCopy "+ JSON.stringify(deckCopy) );
    // ACTUALIZAR EL DECK
    this.props.onUpdateDeck(deckCopy);
  };

  getBoardSize = board => {
    let boardSize = 0;
    board.map(card => (boardSize += card.count));
    return boardSize;
  };

  render() {
    let { deck } = this.props;
    return (
      <div id="sealedDeckEditor">
        <p>SideBoard ({this.getBoardSize(deck.sideboard)})</p>
        <CardsList
          id="sb"
          cards={deck.sideboard}
          onCardClick={this.onSideBoardCardClick}
          view={VIEW_IMAGEONLY}
        />
        <ul id="basicLandsList" className="cardsList">
          <li>Lands:</li>
          <li className="cardResult imageOnly border border-light">
            <img
              alt="Plains"
              src="/db/cards/Lands/plains.jpg"
              onClick={e => this.addCard(250, e)}
            />
          </li>
          <li className="cardResult imageOnly border border-light">
            <img
              alt="Island"
              src="/db/cards/Lands/island.jpg"
              onClick={e => this.addCard(253, e)}
            />
          </li>
          <li className="cardResult imageOnly border border-light">
            <img
              alt="Swamp"
              src="/db/cards/Lands/swamp.jpg"
              onClick={e => this.addCard(256, e)}
            />
          </li>
          <li className="cardResult imageOnly border border-light">
            <img
              alt="Mountain"
              src="/db/cards/Lands/mountain.jpg"
              onClick={e => this.addCard(259, e)}
            />
          </li>
          <li className="cardResult imageOnly border border-light">
            <img
              alt="Forest"
              src="/db/cards/Lands/forest.jpg"
              onClick={e => this.addCard(262, e)}
            />
          </li>
        </ul>
        <p>MainBoard ({this.getBoardSize(deck.mainboard)})</p>
        <ul className="list-group">
          <li className="list-group list-group-item-action"><button onClick={e => this.onClearMainBoardClick(e)}>Clear</button></li>
        </ul>
        <DeckStats deck={deck} />
        <CardsList
          id="mb"
          cards={deck.mainboard}
          onCardClick={this.onMainBoardCardClick}
          view={VIEW_IMAGEONLY}
        />
      </div>
    );
  }
}

export default SealedDeckEditor;
