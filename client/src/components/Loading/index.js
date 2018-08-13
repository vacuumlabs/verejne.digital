// @flow
import React from 'react'
import LoadingComponent from 'react-loading-components'
import './Loading.css'
import {defaultProps} from 'recompose'
import {ListGroupItem} from 'reactstrap'

type Props = {
  width: number,
  height: number,
}

const Loading = ({width, height}: Props) => (
  <div className="loading">
    <LoadingComponent type="tail_spin" width={width} height={height} fill="#0062db" />
  </div>
)
export const ListGroupLoadingComponent = ({width, height}: Props) => (
  <ListGroupItem className="list-row">
    <span className="loadingsmall">
      <LoadingComponent type="tail_spin" width={width} height={height} fill="#0062db" />
    </span>
    <span> &nbsp; </span>
  </ListGroupItem>
)

export default defaultProps({
  width: 250,
  height: 250,
})(Loading)

