
// @flow

import React from 'react';
import PropTypes from 'prop-types';

type Props = {
  src: string,
  zoom: number,
  rotate: number
};

const propTypes = {
  src: PropTypes.string.isRequired,
  zoom: PropTypes.number.isRequired,
  rotate: PropTypes.number.isRequired
};

const PreviewImage = ({ src, zoom, rotate }: Props) => (
  <img src={src} style={{minWidth: `${100*zoom}%`, minHeight: `${100*zoom}%`, transform: `rotate(${rotate}deg)`}} />
);
PreviewImage.propTypes = propTypes;

export default PreviewImage;
