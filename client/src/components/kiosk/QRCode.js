import React from 'react';
import PropTypes from 'prop-types';
import ReactQR from 'qrcode.react';

function QRCode(props) {
  return (
    <ReactQR value={props.code} size={500} style={{ padding: '0.5rem' }} bgColor="transparent" />
  );
}

QRCode.propTypes = {
  code: PropTypes.string,
};

export default QRCode;
