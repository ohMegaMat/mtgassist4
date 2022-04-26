import React, { Component } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

class DeckStats extends Component {
  renderManaCostsStats = deck => {
    let cmcs = [];
    let cmcsCreats = [];
    deck.mainboard.forEach(card => {
//      console.log(card);
      if (card.types.includes("Creature")) {
        let cmcItemCreat = cmcsCreats.find(item => item.cmc === card.manaCost);
        if (cmcItemCreat) {
          cmcItemCreat.count = cmcItemCreat.count + card.count;
        } else {
          cmcItemCreat = { cmc: card.manaCost, count: card.count };
          cmcsCreats.push(cmcItemCreat);
        }
      }
      else {
        let cmcItem = cmcs.find(item => item.cmc === card.manaCost);
        if (cmcItem) {
          cmcItem.count = cmcItem.count + card.count;
        } else {
          cmcItem = { cmc: card.manaCost, count: card.count };
          cmcs.push(cmcItem);
        }
      }
    });
    /*    let cardList = [];
    for (let i = 0; i < 10; ++i) {
      let cmcItem = cmcs.find(item => item.cmc === i);
      if (cmcItem)
        cardList.push(
          <span>
            {i}: {cmcItem.count} -
          </span>
        );
      else cardList.push(<span key={"cmc_" + i}>- {i}: 0 - </span>);
    }
    return cardList;
    */
    let options = {
      chart: { type: "column" },
      title: { text: "" },
      xAxis: { categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
      series: [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }]
    };
    let newData = [];
    for (let i = 0; i < 10; ++i) {
      let cmcItem = cmcs.find(item => item.cmc === i);
      if (cmcItem) newData.push(cmcItem.count);
      else newData.push(0);
    }
    let newDataCreats = [];
    for (let i = 0; i < 10; ++i) {
      let cmcItemCreat = cmcsCreats.find(item => item.cmc === i);
      if (cmcItemCreat) newDataCreats.push(cmcItemCreat.count);
      else newDataCreats.push(0);
    }
    options.series = [{ name: "NonCreatures", data: newData }, { name: "Creatures", data: newDataCreats }];
    options.plotOptions = {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    };
    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { width: "300px", height: "150px" } }}
        />
      </div>
    );
  };

  renderManaWeightStats = deck => {
    let manaDetailsSum = {
      u: 0,
      b: 0,
      w: 0,
      r: 0,
      g: 0,
      explicitC: 0,
      h: 0  // not yet supported
    };
    deck.mainboard.forEach(card => {
//      console.log(card);
      if( !card.types.includes("Land") ) {
        manaDetailsSum.u += card.manaDetails.u;
        manaDetailsSum.b += card.manaDetails.b;
        manaDetailsSum.w += card.manaDetails.w;
        manaDetailsSum.r += card.manaDetails.r;
        manaDetailsSum.g += card.manaDetails.g;
        manaDetailsSum.explicitC += card.manaDetails.explicitC;
      }
    });
    let newData = [];
    let newColors = [];
    if (manaDetailsSum.u > 0 ) {
      newData.push( { name: "Blue", y: manaDetailsSum.u } );
      newColors.push( "#0000FF" );
    }
    if (manaDetailsSum.b > 0 ) {
      newData.push( { name: "Black", y: manaDetailsSum.b } );
      newColors.push( "#000000" );
    }
    if (manaDetailsSum.g > 0 ) {
      newData.push( { name: "Green", y: manaDetailsSum.g } );
      newColors.push( "#00FF00" );
    }
    if (manaDetailsSum.r > 0 ) {
      newData.push( { name: "Red", y: manaDetailsSum.r } );
      newColors.push( "#FF0000" );
    }
    if (manaDetailsSum.w > 0 ) {
      newData.push( { name: "White", y: manaDetailsSum.w } );
      newColors.push( "#FFFFFF" );
    }

    let options = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: { text: "" },
      series: [{ data: newData }],
      colors: newColors
    };
    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { width: "300px", height: "150px" } }}
        />
      </div>
    );
  };

  renderCardsTypeStats = deck => {
    //console.log(deck);
    let mainboard = deck.mainboard;
    let creatures = 0;
    let artifacts = 0;
    let enchantments = 0;
    let sorceries = 0;
    let instants = 0;
    let pws = 0;
    let lands = 0;
    mainboard.forEach(card => {
      console.log(card);
      for (let i = 0; i < card.types.length; ++i) {
        switch (card.types[i]) {
          case "Creature":
            creatures += card.count;
            break;
          case "Artifact":
            artifacts += card.count;
            break;
          case "Enchantment":
            enchantments += card.count;
            break;
          case "Sorcery":
            sorceries += card.count;
            break;
          case "Instant":
            instants += card.count;
            break;
          case "Planeswalker":
            pws += card.count;
            break;
          case "Land":
            lands += card.count;
            break;
          default:
            break;
        }
      }
    });

    return (
      <div id="divDeckStats">
        <div>Creatures: {creatures}</div>
        <div>Artifacts: {artifacts}</div>
        <div>Enchantments: {enchantments}</div>
        <div>Sorceries: {sorceries}</div>
        <div>Instants: {instants}</div>
        <div>Planeswalkers: {pws}</div>
        <div>Lands: {lands}</div>
      </div>
    );
  };

  render() {
    let { deck } = this.props;

    return (
      <div id="deckStats">
        {this.renderManaCostsStats(deck)}
        {this.renderManaWeightStats(deck)}
        {this.renderCardsTypeStats(deck)}
      </div>
    );
  }
}

export default DeckStats;
