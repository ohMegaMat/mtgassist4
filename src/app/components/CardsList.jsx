import React, { Component } from "react";
import CardsListItem from "./CardsListItem";

class CardsList extends Component {
  renderCards = (cards, view, id) => {
    let cardList = cards.map((card, i) => (
      <CardsListItem
        card={card}
        view={view}
        id={id + "_card_" + i}
        key={id + "_card_" + i}
        onCardClick={this.props.onCardClick}
      />
    ));
    return cardList;
  };

  render() {
    let { cards } = this.props;
    let { view } = this.props;
    let { id } = this.props;

    return (
      <ul id={id + "_cardsList"} className="cardsList">
        {this.renderCards(cards, view, id)}
      </ul>
    );
  }
}

export default CardsList;
