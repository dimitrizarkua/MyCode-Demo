
// @flow

import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';

import { Document, Page } from 'react-pdf/build/entry.webpack';

type Props = {
  src: string,
  zoom: number,
  rotate: number
};

class PreviewPdf extends PureComponent<Props> {
  static propTypes = {
    src: PropTypes.string.isRequired,
    zoom: PropTypes.number.isRequired,
    rotate: PropTypes.number.isRequired
  }


  render() {
    const { src, zoom, rotate } = this.props;

    return (
      <Document
        file={src}>
        <Page
          pageNumber={1}
          width={700 * zoom}
          rotate={betterModulus(rotate, 360)} />
      </Document>
    );
  }
}

export default PreviewPdf;

function betterModulus(x, y) {
  return ((x % y) + y) % y;
}
