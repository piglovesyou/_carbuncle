var React = require('react');
var Griddle = require('griddle-react');
var {PER_PAGE} = require('../constants');
var {Navigation, State} = require('react-router');
var componentHelper = require('../components/helper');
var Actions = require('../actions');
var CustomPager = require('../components/CustomPager');



var Entries = React.createClass({
  render() {
    if (!this.props.data) return null;
    return (
      <div>
        {this.props.data.map(entry => {
          var tooltip = entry.title + (entry.title && entry.css ? '\n\n' : '') + entry.css;
          return (
            <div className="paged-table--scenario-list__entry" title={tooltip}>
              {componentHelper.renderIcon(entry.mode, entry.type)}
            </div>
          );
        })}
      </div>
    );
  }
});

var Buttons = React.createClass({
  render() {
    return (<div>
      <button className="btn btn-xs btn-success" onClick={Actions.startEditScenario.bind(this, this.props.rowData)}>view</button>
      <button className="btn btn-xs btn-danger" onClick={Actions.deleteScenario.bind(null, this.props.rowData)}>delete</button>
    </div>);
  }
});

var Columns = ['title', 'entries', 'updatedBy', 'buttons'];
var ColumnMetadata = [
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
    'columnName': 'buttons',
    'displayName': '',
    'visible': true,
    'customComponent': Buttons,
    'cssClassName': 'cell cell--buttons'
  }
];

var ScenarioList = React.createClass({
    mixins: [Navigation, State],
    getInitialState: function(){
      var initial = {
        'externalSortColumn': null,
        'externalSortAscending': true
      };
      return initial;
    },
    setPage: function(index){
      var page = goog.math.clamp(index, 0, this.props.maxPage);
      this.transitionTo('scenario-list', {}, {page});
    },
    setPageSize: function() {
    },
    render: function(){
      return <Griddle gridClassName={'paged-table paged-table--' + this.props.cssModifier} useExternal={true} externalSetPage={this.setPage} enableSort={false}
          columns={Columns}
          columnMetadata={ColumnMetadata}
          externalMaxPage={this.props.maxPage}
          externalChangeSort={function(){}}
          externalSetFilter={function(){}}
          externalCurrentPage={this.props.currentPage}
          externalSetPageSize={this.setPageSize}
          results={this.props.results}
          tableClassName="table"
          resultsPerPage={PER_PAGE}
          externalSortColumn={this.state.externalSortColumn}
          externalSortAscending={this.state.externalSortAscending}
          useGriddleStyles={false}
          useCustomPagerComponent={true}
          customPagerComponent={CustomPager}
          urlBase={this.props.urlBase} />;
    }
});

module.exports = ScenarioList;
