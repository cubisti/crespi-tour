import React, { Component } from 'react';
import { Description, Container, Box, Title, Subtitle } from '../style/toast';
import { Exit, Top } from '../style/common';
import { connect } from 'react-redux';
import { HIDE_INFO, DONT_LOOK } from '../redux/actions/actions';
import { bindActionCreators } from 'redux';
import ReactMarkdown from 'react-markdown';

const mapStateToProps = state => ({
  info: state.info,
  lookingAt: state.looking,
});
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      DONT_LOOK,
    },
    dispatch,
  ),
});
class Toast extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container>
        <Description lookingAt={this.props.lookingAt.status}>
          <Top>
            <Exit
              onTouchStart={this.props.DONT_LOOK}
              onPointerDown={this.props.DONT_LOOK}
            >
              X
            </Exit>
          </Top>
          <Title>{this.props.lookingAt.title}</Title>
          <Subtitle>{this.props.lookingAt.subtitle}</Subtitle>
          <ReactMarkdown source={this.props.lookingAt.description} />
        </Description>
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Toast);
