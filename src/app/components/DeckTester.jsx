import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.css'
import CardsList from "./CardsList";
import CardsListDropdown from "./CardsListDropdown";
import { VIEW_STANDARD, VIEW_IMAGEONLY } from "../components/CardsListItem";

class DeckTester extends Component {
  constructor(props) {
    super(props);
    let { deck } = props;
    let deckCopy = Object.assign({}, deck);
    deckCopy.mainboard = deck.mainboard.slice();
    deckCopy.sideboard = deck.sideboard.slice();
    this.state = {
      deck: deckCopy,
      library: [],
      hand: [],
      battlefield: [],
      graveyard: [],
      exile: [],
      life: 20,
      cardsMenu: { isOpen: false, card: null, zone: -1 }
    };
  }

  componentWillReceiveProps(nextProps) {
    let { deck } = nextProps;
    let deckCopy = Object.assign({}, deck);
    deckCopy.mainboard = deck.mainboard.slice();
    deckCopy.sideboard = deck.sideboard.slice();
    // PARA CADA CARTA EN mainboard CREA UNA COPIA POR count PARA library
    var cards = [];
    deckCopy.mainboard.forEach(card => {
      for (let i = 0; i < card.count; ++i) {
        var cardCopy = Object.assign({}, card);
        cardCopy.count = 1;
        cardCopy.indexInDeck = cards.length;
        cards.push(cardCopy);
      }
    });
    this.setState({ deck: deckCopy, library: cards });
  }

  updateState = state => {
    let stateUpdated = Object.assign({}, state);
    stateUpdated.library = state.library.slice();
    stateUpdated.hand = state.hand.slice();
    stateUpdated.battlefield = state.battlefield.slice();
    stateUpdated.graveyard = state.graveyard.slice();
    stateUpdated.exile = state.exile.slice();
    //		console.log( "stateUpdated "+ JSON.stringify(stateUpdated) );
    this.setState(stateUpdated);
  };

  fold = (state, shouldSetState) => {
    let foldedState = Object.assign({}, state);
    foldedState.library = state.library
      .slice()
      .concat(state.hand.slice())
      .concat(state.battlefield.slice())
      .concat(state.graveyard.slice())
      .concat(state.exile.slice());
    foldedState.hand = [];
    foldedState.battlefield = [];
    foldedState.graveyard = [];
    foldedState.exile = [];
    if (shouldSetState) this.setState(foldedState);
    return foldedState;
  };

  restart() {
    // METE TODAS LAS CARTAS EN library
    let stateUpdated = this.fold(this.state);
    // MEZCLA Y ROBA 7 CARTAS
    stateUpdated = this.shuffleLibrary(stateUpdated);
    stateUpdated = this.drawCards(stateUpdated, false, 7);
    this.setState(stateUpdated);
  }

  mulligan() {
    var mulliganSize =
      this.state.hand.length > 0 ? this.state.hand.length - 1 : 0;
    // METE TODAS LAS CARTAS EN library
    let stateUpdated = this.fold(this.state);
    // MEZCLA Y ROBA mulliganSize CARTAS
    stateUpdated = this.shuffleLibrary(stateUpdated);
    stateUpdated = this.drawCards(stateUpdated, false, mulliganSize);
    this.setState(stateUpdated);
  }

  drawCards = (state, shouldSetState, nCards) => {
    let stateUpdated = Object.assign({}, state);
    // TOMA LAS n CARTAS DEL FINAL DEL ARRAY library Y LAS PONE EN EL ARRAY hand
    stateUpdated.library = state.library.slice(0, -nCards);
    stateUpdated.hand = state.hand.slice();
    stateUpdated.hand = stateUpdated.hand.concat(state.library.slice(-nCards));
    if (shouldSetState) this.setState(stateUpdated);
    return stateUpdated;
  };

  shuffleLibrary = (state, shouldSetState) => {
    let stateUpdated = Object.assign({}, state);
    stateUpdated.library = state.library.slice();
    var i, j, temp;
    for (i = stateUpdated.library.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = stateUpdated.library[i];
      stateUpdated.library[i] = stateUpdated.library[j];
      stateUpdated.library[j] = temp;
    }
    if (shouldSetState) this.setState(stateUpdated);
    return stateUpdated;
  };

  onHandCardClick = cardParam => {
    let stateUpdated = Object.assign({}, this.state);

    // SI ES LA UNICA CARTA, ELIMINARLA
    stateUpdated.hand = this.state.hand.slice();
    let cardInHand = stateUpdated.hand.find(
      card => card.indexInDeck === cardParam.indexInDeck
    );
    stateUpdated.hand = stateUpdated.hand.filter(
      card => card.indexInDeck !== cardParam.indexInDeck
    );

    // PASAR LA CARTA AL BATTLEFIELD
    stateUpdated.battlefield = this.state.battlefield.slice();
    let newCard = Object.assign({}, cardInHand);
    stateUpdated.battlefield.push(newCard);

    // ACTUALIZAR EL DECK
    this.setState(stateUpdated);
  };

  /** zone => 0: hand, 1: battlefield, 2: graveyard, 3: exile, 4: deck */
  onCardClickShowMenu = (cardParam, cardRenderId) => {
    let stateUpdated = Object.assign({}, this.state);
    let zone = -1;
    let zoneId = cardRenderId.split("_")[0];
    switch(zoneId)
    {
      case "hand": zone = 0; break;
      case "bf": zone = 1; break;
      case "graveyard": zone = 2; break;
      case "exile": zone = 3; break;
      case "library": zone = 4; break;
      default: zone = -1; break;
    }
    stateUpdated.cardsMenu = { isOpen: true, card: cardParam, zone: zone };
    this.setState(stateUpdated);
  };

  onCloseCardsMenuClick = () => {
    let stateUpdated = Object.assign({}, this.state);
    stateUpdated.cardsMenu = { isOpen: false, card: null, zone: -1 };
    this.setState(stateUpdated);
  };

  onMoveCardZoneMenuClick = (cardParam, currentZone, newZone, setFirst) => {
    let stateUpdated = Object.assign({}, this.state);
    stateUpdated = this.moveCardZone(stateUpdated, false, cardParam, currentZone, newZone, setFirst);
    stateUpdated.cardsMenu = { isOpen: false, card: null, zone: -1 };
    this.setState(stateUpdated);
  }

  moveCardZone = (state, shouldSetState, cardParam, currentZone, newZone, setFirst) => {
    let stateUpdated = Object.assign({}, state);

    // SI ES LA UNICA CARTA, ELIMINARLA
    let cardInZone = cardParam;
    switch(currentZone) {
      case 0: {
        stateUpdated.hand = state.hand.slice();
        cardInZone = stateUpdated.hand.find(
          card => card.indexInDeck === cardParam.indexInDeck
        );
        stateUpdated.hand = stateUpdated.hand.filter(
          card => card.indexInDeck !== cardParam.indexInDeck
        );
        
        break;
      }
      case 1: {
        stateUpdated.battlefield = state.battlefield.slice();
        cardInZone = stateUpdated.battlefield.find(
          card => card.indexInDeck === cardParam.indexInDeck
        );
        stateUpdated.battlefield = stateUpdated.battlefield.filter(
          card => card.indexInDeck !== cardParam.indexInDeck
        );
        
        break;
      }
      case 2: {
        stateUpdated.graveyard = state.graveyard.slice();
        cardInZone = stateUpdated.graveyard.find(
          card => card.indexInDeck === cardParam.indexInDeck
        );
        stateUpdated.graveyard = stateUpdated.graveyard.filter(
          card => card.indexInDeck !== cardParam.indexInDeck
        );
        
        break;
      }
      case 3: {
        stateUpdated.exile = state.exile.slice();
        cardInZone = stateUpdated.exile.find(
          card => card.indexInDeck === cardParam.indexInDeck
        );
        stateUpdated.exile = stateUpdated.exile.filter(
          card => card.indexInDeck !== cardParam.indexInDeck
        );
        
        break;
      }
      case 4: {
        stateUpdated.library = state.library.slice();
        cardInZone = stateUpdated.library.find(
          card => card.indexInDeck === cardParam.indexInDeck
        );
        stateUpdated.library = stateUpdated.library.filter(
          card => card.indexInDeck !== cardParam.indexInDeck
        );
        
        break;
      }
      default: break;
    }

    // PASAR LA CARTA A LA OTRA ZONA
    switch(newZone) {
      case 0: {
        stateUpdated.hand = state.hand.slice();
        let newCard = Object.assign({}, cardInZone);
        setFirst ? stateUpdated.hand.unshift(newCard) : stateUpdated.hand.push(newCard);
            
        break;
      }
      case 1: {
        stateUpdated.battlefield = state.battlefield.slice();
        let newCard = Object.assign({}, cardInZone);
        setFirst ? stateUpdated.battlefield.unshift(newCard) : stateUpdated.battlefield.push(newCard);
            
        break;
      }
      case 2: {
        stateUpdated.graveyard = state.graveyard.slice();
        let newCard = Object.assign({}, cardInZone);
        setFirst ? stateUpdated.graveyard.unshift(newCard) : stateUpdated.graveyard.push(newCard);
            
        break;
      }
      case 3: {
        stateUpdated.exile = state.exile.slice();
        let newCard = Object.assign({}, cardInZone);
        setFirst ? stateUpdated.exile.unshift(newCard) : stateUpdated.exile.push(newCard);
            
        break;
      }
      case 4: {
        stateUpdated.library = state.library.slice();
        let newCard = Object.assign({}, cardInZone);
        setFirst ? stateUpdated.library.unshift(newCard) : stateUpdated.library.push(newCard);
            
        break;
      }
      default: break;
    }

    // ACTUALIZAR EL DECK
    if (shouldSetState) this.setState(stateUpdated);
    return stateUpdated;
  }

  renderCardsMenu = () => {
    if (this.state.cardsMenu.isOpen) {
      let card = this.state.cardsMenu.card;
      let zone = this.state.cardsMenu.zone;
      return (
        <Modal id="cardsMenu" isOpen={true}>
          <ModalHeader>
            {card.name}
          </ModalHeader>
          <ModalBody>
            <ul className="list-group">
              { zone !== 0 ? <li className="list-group list-group-item-action"><button onClick={e => this.onMoveCardZoneMenuClick(card, zone, 0, false, e)}>Hand</button></li> : null }
              { zone !== 1 ? <li className="list-group list-group-item-action"><button onClick={e => this.onMoveCardZoneMenuClick(card, zone, 1, false, e)}>Battlefield</button></li> : null }
              { zone !== 2 ? <li className="list-group list-group-item-action"><button onClick={e => this.onMoveCardZoneMenuClick(card, zone, 2, false, e)}>Graveyard</button></li> : null }
              { zone !== 3 ? <li className="list-group list-group-item-action"><button onClick={e => this.onMoveCardZoneMenuClick(card, zone, 3, false, e)}>Exile</button></li> : null }
              <li className="list-group list-group-item-action"><button onClick={e => this.onMoveCardZoneMenuClick(card, zone, 4, false, e)}>Top</button></li>
              <li className="list-group list-group-item-action"><button onClick={e => this.onMoveCardZoneMenuClick(card, zone, 4, true, e)}>Bottom</button></li>
            </ul>
          </ModalBody>
          <ModalFooter>
            <button onClick={e => this.onCloseCardsMenuClick(e)}>Close</button>
          </ModalFooter>
        </Modal>
      );
    }
    return "";
  };

  render() {
    return (
      <div id="deckTester">
        <ul className="buttonsListHorizontal">
          <li>
            <button onClick={e => this.restart(e)}>Restart</button>
          </li>
          <li>
            <button onClick={e => this.mulligan(e)}>Mulligan</button>
          </li>
          <li>
            <button onClick={e => this.drawCards(this.state, true, 1, e)}>
              Draw
            </button>
          </li>
          <li>
            <button onClick={e => this.shuffleLibrary(this.state, true, e)}>
              Shuffle
            </button>
          </li>
          <li>
          </li>
        </ul>
            <CardsListDropdown 
              id="library" 
              cards={this.state.library}
              onCardClick={this.onCardClickShowMenu}
            />
        { this.renderCardsMenu() }
        <p>Hand ({this.state.hand.length})</p>
        <CardsList
          id="hand"
          cards={this.state.hand}
          onCardClick={this.onCardClickShowMenu}
          view={VIEW_IMAGEONLY}
        />
        <p>Battlefield ({this.state.battlefield.length})</p>
        <CardsList
          id="bf"
          cards={this.state.battlefield}
          onCardClick={this.onCardClickShowMenu}
          view={VIEW_IMAGEONLY}
        />
        <p>Graveyard ({this.state.graveyard.length})</p>
        <CardsList
          id="graveyard"
          cards={this.state.graveyard}
          onCardClick={this.onCardClickShowMenu}
          view={VIEW_IMAGEONLY}
        />
        <p>Exile ({this.state.exile.length})</p>
        <CardsList
          id="exile"
          cards={this.state.exile}
          onCardClick={this.onCardClickShowMenu}
          view={VIEW_IMAGEONLY}
        />
      </div>
    );
  }
}

export default DeckTester;
