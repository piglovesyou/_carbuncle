var _ = require('underscore');
var React = require('react');
// var {PER_PAGE} = require('../constants');
// var {Link} = require('react-router');

var OtherPager = React.createClass({
  getDefaultProps: function(){
    return {
      'maxPage': 0,
      'nextText': '',
      'previousText': '',
      'currentPage': 0
    };
  },
  render: function(){
    var pageCount = this.props.maxPage;
    var pageEnd = pageCount - 1;
    if (pageEnd <= 0) return <div></div>;
    var margin = 5; // TODO: Const
    var isLeftEdge = this.props.currentPage === 0;
    var isRightEdge = this.props.currentPage === pageEnd;
    var rangeStart = Math.max(0, this.props.currentPage - margin);
    var rangeEnd = Math.min(this.props.currentPage + margin, pageEnd);
    var leftskip;
    var rightskip;
    if (rangeStart > 1) {
      leftskip = <li>
        <a href="#" onClick={goTo.bind(this, rangeStart - 1)}>...</a>
      </li>;
    }
    if (rangeEnd < pageEnd) {
      rightskip = <li>
        <a href="#" onClick={goTo.bind(this, rangeEnd + 1)}>...</a>
      </li>;
    }
    return (
      <nav className="text-center">
        <ul className="pagination">
          <li className={isLeftEdge ? 'disabled' : null}>
            <a href="#" onClick={goTo.bind(this, 0)}>&laquo;</a>
          </li>
          {leftskip}
          {_.map(_.range(rangeStart, rangeEnd + 1), page =>
            <li key={page} className={this.props.currentPage === page ? 'active' : null}>
              <a href="#" onClick={goTo.bind(this, page)}>{page + 1}</a>
            </li>
          )}
          {rightskip}
          <li className={isRightEdge ? 'disabled' : null}>
            <a href="#" onClick={goTo.bind(this, pageEnd)}>&raquo;</a>
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
