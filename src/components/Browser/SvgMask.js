import React from 'react';

class SvgMask extends React.Component {
  render() {
    return (
      <svg className='svg-mask'>
        <mask id='svg-mask__mask' className='svg-mask__mask'>
          <rect ref='mask-base' className='svg-mask__mask-base' x='0' y='0' fill='white' />
          <rect ref='mask-spot' className='svg-mask__mask-spot' fill='black' {...this.props} />
        </mask>
        <rect ref='base-rect'
            className='svg-mask__base-rect'
            width='100%' height='100%'
            fill='black' opacity='.2'
        ></rect>
      </svg>
    );
  }
  componentDidMount() {
    // Hack
    this.refs['base-rect'].setAttribute('mask', 'url(#svg-mask__mask)');
    setTimeout(() => {
      this.refs['mask-base'].setAttribute('height', '100%');
    }, 0);
  }
}

module.exports = SvgMask;
