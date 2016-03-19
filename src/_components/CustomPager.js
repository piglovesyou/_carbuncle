const _ = require('underscore');
const React = require('react');
// const {PER_PAGE} = require('../constants');
// const {Link} = require('react-router');

const OtherPager = React.createClass({
  getDefaultProps: function() {
    return {
      'maxPage': 0,
      'nextText': '',
      'previousText': '',
      'currentPage': 0
    };
  },
  render: function() {
    const pageCount = this.props.maxPage;
    const pageEnd = pageCount - 1;
    if (pageEnd <= 0) return <div></div>;
    const margin = 5; // TODO: Const
    const isLeftEdge = this.props.currentPage === 0;
    const isRightEdge = this.props.currentPage === pageEnd;
    const rangeStart = Math.max(0, this.props.currentPage - margin);
    const rangeEnd = Math.min(this.props.currentPage + margin, pageEnd);
    let leftskip;
    let rightskip;
    if (rangeStart > 1) {
      leftskip = <li>
        <a href='#' onClick={goTo.bind(this, rangeStart - 1)}>...</a>
      </li>;
    }
    if (rangeEnd < pageEnd) {
      rightskip = <li>
        <a href='#' onClick={goTo.bind(this, rangeEnd + 1)}>...</a>
      </li>;
    }
    return (
      <nav className='text-center'>
        <ul className='pagination'>
          <li className={isLeftEdge ? 'disabled' : null}>
            <a href='#' onClick={goTo.bind(this, 0)} className='fa fa-angle-double-left'></a>
          </li>
          {leftskip}
          {_.map(_.range(rangeStart, rangeEnd + 1), page =>
            <li key={page} className={this.props.currentPage === page ? 'active' : null}>
              <a href='#' onClick={goTo.bind(this, page)}>{page + 1}</a>
            </li>
          )}
          {rightskip}
          <li className={isRightEdge ? 'disabled' : null}>
            <a href='#' onClick={goTo.bind(this, pageEnd)} className='fa fa-angle-double-right'></a>
          </li>
        </ul>
      </nav>
    );

    function goTo(page, e) {
      e.preventDefault();
      this.props.setPage(page);
    }
  }
});

module.exports = OtherPager;
