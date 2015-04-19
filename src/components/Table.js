var React = require('react');
var _ = require('underscore');
// var Link = require('./Link');
var {Link} = require('react-router');

var PER_PAGE = 20; // TODO: Const

var Table = React.createClass({

  // TODO: Impl sort function.

  render() {

    var start = (this.props.currPage) * PER_PAGE;
    var end = Math.min(start + PER_PAGE, this.props.total);
    var rows = this.props.rows.slice(start, end).filter(row => row);

    return (
      <div className={'paged-table ' + (this.props.cssModifier ? 'paged-table--' + this.props.cssModifier : '')}>
        <table className="table table-hover">
          <thead>
            <tr>
              {_.map(this.props.columns, column =>
                <th onClick={column.onClick || function(){}}
                    className={getCellCssName(column, true)}
                    key={column.id}>{column.label}</th>)}
            </tr>
          </thead>
        </table>
        <div className="paged-table__canvas">
          <table className="table table-hover">
            <tbody>{this.renderRows()}</tbody>
          </table>
        </div>
        {this.renderPagination()}
      </div>
    );
  },

  renderRows() {
    if (this.props.total >= 0) {
      if (this.props.rows.length) {
        return this.props.rows.map((row, i) =>
          (<tr key={(this.props.currPage * PER_PAGE - 1) + i}>
            {_.map(this.props.columns, column =>
              <td className={getCellCssName(column)} key={column.id}>{column.formatter.call(this, row)}</td>
            )}
          </tr>)
        );
      } else {
        return <tr className="active"><td className="text-center"><em>No document stored.</em></td></tr>;
      }
    }
    return [];
  },

  renderPagination() {
    if (this.props.total <= PER_PAGE) return;
    var margin = 5; // TODO: Const
    var maxPage = Math.ceil(this.props.total / PER_PAGE);
    var isLeftEdge = this.props.currPage === 1;
    var isRightEdge = this.props.currPage === maxPage;
    var rangeStart = Math.max(1, this.props.currPage - margin);
    var rangeEnd = Math.min(this.props.currPage + margin, maxPage);
    var leftskip;
    var rightskip;
    if (rangeStart > 1) {
      leftskip = <li><Link to={this.props.urlBase} query={{page: rangeStart - 1}}>...</Link></li>;
    }
    if (rangeEnd < maxPage) {
      rightskip = <li><Link to={this.props.urlBase} query={{page: rangeEnd + 1}}>...</Link></li>;
    }
    return (
      <nav className="text-center">
        <ul className="pagination">
          <li className={isLeftEdge ? 'disabled' : null}>
            <Link to={this.props.urlBase} query={{page: 1}}>&laquo;</Link>
          </li>
          {leftskip}
          {_.map(_.range(rangeStart, rangeEnd + 1), page =>
            <li key={page} className={this.props.currPage === page ? 'active' : null}>
              <Link to={this.props.urlBase} query={{page: page}}>{page}</Link>
            </li>
          )}
          {rightskip}
          <li className={isRightEdge ? 'disabled' : null}>
            <Link to={this.props.urlBase} query={{page: maxPage}}>&raquo;</Link>
          </li>
        </ul>
      </nav>
    );
  }
});

function getCellCssName(column, isHeader) {
  return 'cell ' +
         'cell--' + column.id +
         (isHeader && column.onClick ? ' cell--clickable' : '') +
         (column.cssModifier ? ' cell--' + column.cssModifier : '');
}

module.exports = Table;
