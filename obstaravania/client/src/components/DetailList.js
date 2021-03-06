import React, { Component } from 'react';
import DetailItem from './DetailItem';
import './DetailList.css';

export default class DetailList extends Component {

  render() {
    if (this.props.item === null) {
      return null;
    }

    let items = <tr><td colSpan={6} className="text-center">Žiadni kandidáti</td></tr>;

    if (this.props.item.kandidati.length > 0) {
      items = this.props.item.kandidati.map(
            item => <DetailItem key={item.id} item={item} />,
        );
    }

    return (
      <div className="section">
        <table className="dataTable table table-responsive table-condensed">
          <thead>
            <tr>
              <td>Kto by sa mal prihlásiť</td>
              <td>Čo podobné vyhral</td>
              <td>Objednávateľ</td>
              <td>Cena €</td>
              <td>Pod.</td>
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </table>
      </div>
    );
  }
}
