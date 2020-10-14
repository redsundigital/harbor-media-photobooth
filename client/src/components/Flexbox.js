import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledFlex = styled.div`
  width: ${(props) => {
    if (props.fullscreen) {
      return '100vw';
    } else if (props.width) {
      return props.width;
    }
  }};
  height: ${(props) => {
    if (props.fullscreen) {
      return '100vh';
    } else if (props.height) {
      return props.height;
    }
  }};
  display: flex;
  flex: ${(props) => props.flex};
  flex-direction: ${(props) => (props.column ? 'column' : 'row')};
  align-items: ${(props) => (props.center ? 'center' : props.align)};
  justify-content: ${(props) => (props.center ? 'center' : props.justify)};
`;

function Flexbox(props) {
  return <StyledFlex {...props}>{props.children}</StyledFlex>;
}

Flexbox.propTypes = {
  align: PropTypes.string,
  justify: PropTypes.string,
  center: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  flex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  column: PropTypes.bool,
  fullscreen: PropTypes.bool,
};

export default Flexbox;
