// @flow

import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';

import { Document, Page } from 'react-pdf/build/entry.webpack';

import ElementPan from 'react-element-pan';
import sizeMe from 'react-sizeme';

type Props = {
  src: string,
  size: any
};

type State = {
  zoom: number,
  rotate: number
};

export class Preview extends PureComponent<Props, State> {
  static propTypes = {
    src: PropTypes.string
  };

  static defaultProps = {
    src: 'https://www.kathykuohome.com/Content/config/product/comp/zoom/product_9467_1.jpg'
  }

  state = {
    zoom: 1,
    rotate: 0
  }

  incZoom = () => {
    this.changeZoom(1.25);
  }

  decZoom = () => {
    this.changeZoom(0.8);
  }

  changeZoom = (factor: number) => {
    this.setState((prevState: State) => ({
      zoom: prevState.zoom * factor
    }));
  }


  posRotate = () => {
    this.rotate(90);
  }

  negRotate = () => {
    this.rotate(-90);
  }

  rotate = (deg: number) => {
    this.setState((prevState: State) => ({
      rotate: prevState.rotate + deg
    }));
  }


  render() {
    const { zoom, rotate } = this.state;
    const { src } = this.props;

    return (
      <div>
        <ElementPan style={{ width: '100%', height: '0', paddingBottom: '60%' }}>
          {
            isPdf(src) ?
              <Document file={src}>
                <Page pageNumber={1}
                  width={zoom * this.props.size.width}
                  rotate={betterModulus(rotate, 360)} />
              </Document>
              : <img src={src}
                style={{
                  minWidth: `${100 * zoom}%`,
                  minHeight: `${100 * zoom}%`,
                  transform: `rotate(${rotate}deg)`
                }} />
          }
        </ElementPan>
        <div className="row" style={{textAlign: 'center'}}>
          <div className="col-4" />
          <div className="col-4 d-flex justify-content-between">
            <a className="btn btn-round secondary-3 fa fa-plus" onClick={this.incZoom} />
            <a className="btn btn-round secondary-3 fa fa-minus" onClick={this.decZoom} />
            <a className="btn btn-round secondary-3 fa fa-undo fa-flip-horizontal" onClick={this.posRotate} />
            <a className="btn btn-round secondary-3 fa fa-undo" onClick={this.negRotate} />
            <a className="btn btn-round secondary-3" href={src} >Download</a>
          </div>
          <div className="col-4" />
        </div>
      </div>
    );
  }
}

function isPdf(url) {
  try {
    const ext = url.split('?')[0].split('.').pop();
    return ext === 'pdf';
  } catch(err) {
    return false;
  }
}

function betterModulus(x, y) {
  return ((x % y) + y) % y;
}

export default sizeMe()(Preview)

