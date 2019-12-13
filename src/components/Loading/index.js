import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps } from '../../redux/mapStateToProps';

import { Root } from '../../common/style/style';
import { Container, Element } from './style';
class Loading extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Root>
        <Container status={this.props.loading}>
          <Element>crespi</Element>
        </Container>
      </Root>
    );
  }
}

export default connect(mapStateToProps)(Loading);
