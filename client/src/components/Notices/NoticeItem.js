import React, {Fragment} from 'react'
import './LegendSymbols.css'
import {getWarning, getTitle} from './utilities'
import {formatSimilarCount, formatSimilarPercent} from './LegendSymbols'
import CompanyDetails from '../shared/CompanyDetails'
import {Link} from 'react-router-dom'
import {compose, withState, withHandlers} from 'recompose'
import './NoticeItem.css'

const _NoticeItem = ({item, toggledOn, toggle}) => {
  const {kandidati} = item
  const similarity = kandidati.length > 0 ? Math.round(kandidati[0].score * 100) : '?'
  const showCompanyDetail = toggledOn && kandidati[0].eid

  return (
    <Fragment>
      <tr title={getTitle(item)} className="notice-item">
        <td className="text-right notice-item-count">{formatSimilarCount(kandidati.length)}</td>
        <td className="notice-item-title">
          <Link title={item.title} className="nowrap-ellipsis" to={`/obstaravania/${item.id}`}>
            {item.title}
          </Link>{' '}
          {getWarning(item)}
        </td>
        <td>{item.customer}</td>
        <td>
          <a className="notice-item-link" onClick={toggle}>
            {showCompanyDetail ? <span>[&minus;]</span> : '[+]'}{' '}
            {kandidati[0].name ? kandidati[0].name : '?'}
          </a>
        </td>
        <td className="text-right">{formatSimilarPercent(similarity)}</td>
      </tr>
      {showCompanyDetail && (
        <tr>
          <td colSpan={5}>
            <CompanyDetails eid={kandidati[0].eid} />
          </td>
        </tr>
      )}
    </Fragment>
  )
}

export default compose(
  withState('toggledOn', 'toggle', false),
  withHandlers({
    toggle: ({toggle}) => (e) => toggle((current) => !current),
  })
)(_NoticeItem)
