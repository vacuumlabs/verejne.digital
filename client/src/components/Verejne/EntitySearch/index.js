// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  Form,
  FormGroup,
  FormText,
} from 'reactstrap'
import {connect} from 'react-redux'
import {compose, withHandlers} from 'recompose'
import EntitySearchResult from '../EntitySearchResult'
import {
  entitySearchValueSelector,
  entitySearchModalOpenSelector,
  entitySearchEidsSelector,
  entitySearchForSelector,
} from '../../../selectors'
import {toggleModalOpen, setEntitySearchFor} from '../../../actions/verejneActions'
import {updateValue} from '../../../actions/sharedActions'
import {FIND_ENTITY_TITLE} from '../../../constants'
import './EntitySearch.css'

const EntitySearch = ({
  entitySearchModalOpen,
  toggleModalOpen,
  className,
  entitySearchValue,
  setEntitySearchValue,
  findEntities,
  entitySearchEids,
  entitySearchFor,
}) => {
  const plurality = (count) => {
    if (count === 1) {
      return `Nájdený ${count} výsledok`
    } else if (count > 1 && count < 5) {
      return `Nájdené ${count} výsledky`
    }
    return `Nájdených ${count} výsledkov`
  }

  return (
    <div className="search-results-panel">
      <button type="button" className="close" onClick={toggleModalOpen}>
        <span>&times;</span>
      </button>
      {entitySearchFor && `${plurality(entitySearchEids.length)} pre "${entitySearchFor}".`}
      <EntitySearchResult />
    </div>
  )
}

export default compose(
  connect(
    (state) => ({
      entitySearchValue: entitySearchValueSelector(state),
      entitySearchEids: entitySearchEidsSelector(state),
      entitySearchFor: entitySearchForSelector(state),
    }),
    {toggleModalOpen, setEntitySearchFor, updateValue}
  ),
  withHandlers({
    findEntities: ({setEntitySearchFor, entitySearchValue}) => (e) => {
      e.preventDefault()
      setEntitySearchFor(entitySearchValue)
    },
    setEntitySearchValue: ({updateValue}) => (e) =>
      updateValue(['publicly', 'entitySearchValue'], (e.target.value), 'Set entity search field value'),
  })
)(EntitySearch)
