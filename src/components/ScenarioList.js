const React = require('react');
const assert = require('assert');
const Griddle = require('griddle-react');
const {PER_PAGE} = require('../constants');
const {Navigation, State} = require('react-router');
const componentHelper = require('../components/helper');
const Actions = require('../actions');
const CustomPager = require('./CustomPager');
const _ = require('underscore');
const {getAncestorFromEventTargetByClass} = require('../tools/dom');


const Entries = React.createClass({
  render() {
    if (!this.props.data) return <div></div>;
    return (
      <div>
        {this.props.data.map(entry => {
          const tooltip = entry.title + (entry.title && entry.css ? '\n\n' : '') + entry.css;
          return (
            <div className='paged-table--scenario-list__entry' title={tooltip} key={entry._id}>
              {componentHelper.renderIcon(entry.isBlock, entry.mode, entry.type)}
            </div>
          );
        })}
      </div>
    );
  }
});

const IsBlock = React.createClass({
  render() {
    return (<div>
      {this.props.data ? <i className='fa fa-cube'></i> : ''}
    </div>);
  }
});

const Buttons = React.createClass({
  render() {
    return (<div>
      <button className='btn btn-xs btn-link fa fa-trash' onClick={this.onDeleteClick}></button>
    </div>);
  },
  onDeleteClick(e) {
    e.stopPropagation();
    e.preventDefault();
    Actions.deleteScenario(this.props.rowData);
  }
});

const Columns = ['title', 'entries', 'updatedBy', 'isBlock', 'buttons'];
const ColumnMetadata = [
  {
    'columnName': 'title',
    'displayName': 'タイトル',
    'visible': true,
    'cssClassName': 'cell cell--title'
  },
  {
    'columnName': 'entries',
    'displayName': 'ステップ',
    'visible': true,
    'customComponent': Entries,
    'cssClassName': 'cell cell--entries'
  },
  {
    'columnName': 'updatedBy',
    'displayName': '更新者',
    'visible': true,
    'cssClassName': 'cell cell--updatedBy'
  },
  {
    'columnName': 'isBlock',
    'displayName': 'ブロック',
    'visible': true,
    'customComponent': IsBlock,
    'cssClassName': 'cell cell--isBlock'
  },
  {
    'columnName': 'buttons',
    'displayName': '',
    'visible': true,
    'customComponent': Buttons,
    'cssClassName': 'cell cell--buttons'
  }
];

const ScenarioListComponent = React.createClass({

  getInitialState() {
    return _.extend({
      currentPage: 0
    }, this.createState());
  },

  componentDidMount() {
    this.props.store.addChangeListener(this.onChange);
    this.syncPage();
  },

  componentDidUpdate() {
    this.syncPage();
  },

  componentWillUnmount() {
    this.props.store.removeChangeListener(this.onChange);
  },

  syncPage() {
    this.props.store.sync(this.state.currentPage);
  },

  onChange() {
    this.setState(this.createState());
  },

  createState() {
    return this.props.store.get();
  },

  mixins: [Navigation, State],

  setPage: function(index) {
    const currentPage = goog.math.clamp(index, 0, this.getMaxPage());
    this.setState({ currentPage });
  },
  setPageSize: function() {
  },
  getMaxPage() {
    return Math.ceil(this.state.total / PER_PAGE);
  },
  getSlicedList() {
    return this.state.list.slice(this.state.currentPage * PER_PAGE, this.state.currentPage * PER_PAGE + PER_PAGE);
  },
  render: function() {
    return (
        <div ref='root' onClick={this.handleClick}>
          <Griddle gridClassName={'paged-table paged-table--' + this.props.cssModifier}
            enableSort={false}
            columns={Columns}
            columnMetadata={ColumnMetadata}
            useExternal={true}
            externalSetPage={this.setPage}
            externalMaxPage={this.getMaxPage()}
            externalChangeSort={function() {}}
            externalSetFilter={function() {}}
            externalCurrentPage={this.state.currentPage}
            externalSetPageSize={this.setPageSize}
            results={this.getSlicedList()}
            tableClassName='table'
            resultsPerPage={PER_PAGE}
            externalSortColumn={null}
            externalSortAscending={true}
            useGriddleStyles={false}
            useCustomPagerComponent={true}
            customPagerComponent={CustomPager} />
        </div>
      );
  },
  handleClick(e) {
    const rowEl = getAncestorFromEventTargetByClass(
        this.refs.root.getDOMNode(), 'standard-row', e.target);
    if (rowEl) {
      const index = _.indexOf(rowEl.parentNode.childNodes, rowEl);
      assert(index >= 0);
      const rowData = this.getSlicedList()[index];
      assert(rowData);
      if (this.props.onClickRow) {
        this.props.onClickRow(rowData);
      }
    }
  }
});

module.exports = ScenarioListComponent;
