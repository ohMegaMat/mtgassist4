import React, { Component } from "react";

export const VIEW_STANDARD = 0;
export const VIEW_IMAGEONLY = 1;

class CardsListItem extends Component {
  getPower = card => {
    if (typeof card !== "undefined" && typeof card.types !== "undefined") {
      if (card.types[0] === "Creature") {
        return (
          <span class="cardStrenght">
            {card.power}/{card.toughness}
          </span>
        );
      } else if (card.types[0] === "Planeswalker") {
        return <span class="cardStrenght">{card.loyalty}</span>;
      }
    }
    return "";
  };

  renderStandard = (id, card) => {
    // todo: DIBUJAR CANTIDAD DE COPIAS DE ESTA CARTA
    return (
      <li
        id={id}
        key={id}
        class="cardResult border border-light"
        onClick={e => this.props.onCardClick(card, id, e)}
      >
        <img src={card.imageUrl} alt={card.name} width="55" height="75" />
        <div class="cardHeader">
          <span className="cardName">{card.name}</span>
          <span className="cardCost">{card.manaCost}</span>
        </div>
        <div className="cardFooter">
          <span className="cardExpansion">{card.set}</span>
          <span className="cardType">{card.type}</span>
          {this.getPower(card)}
        </div>
      </li>
    );
  };

  renderImageOnly = (id, card) => {
    return (
      <li
        id={id}
        key={id}
        className="cardResult imageOnly border border-light"
        onClick={e => this.props.onCardClick(card, id, e)}
      >
        <div>
          <img src={card.imageUrl} alt={card.name} width="110" height="150" />
            { card.count > 1 && 
            <span className="cardCount">{card.count}</span> 
            }
        </div>
      </li>
    );
  };

  render() {
    let { card } = this.props;
    let { view } = this.props;
    let { id } = this.props;
    switch (view) {
      case VIEW_IMAGEONLY: {
        return this.renderImageOnly(id, card);
      }
      default: {
        return this.renderStandard(id, card);
      }
    }
  }
}

export default CardsListItem;
