var React = require('react');
var Griddle = require('griddle-react');
var {PER_PAGE} = require('../constants');
var {Navigation, State} = require('react-router');
var componentHelper = require('../components/helper');
var Actions = require('../actions');



var Persist = require('../persist');



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
    )
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

var Columns = ["title", "entries", "updatedBy", "buttons"];
var ColumnMetadata = [
  {
    'columnName': 'title',
    'displayName': 'タイトル',
    // 'locked': true,
    'visible': true,
    'cssClassName': 'cell cell--title'
  },
  {
    'columnName': 'entries',
    'displayName': 'ステップ',
    // 'locked': true,
    'visible': true,
    'customComponent': Entries,
    'cssClassName': 'cell cell--entries'
  },
  {
    'columnName': 'updatedBy',
    'displayName': '更新者',
    // 'locked': true,
    'visible': true,
    'cssClassName': 'cell cell--updatedBy'
  },
  {
    'columnName': 'buttons',
    'displayName': '',
    // 'locked': true,
    'visible': true,
    'customComponent': Buttons,
    'cssClassName': 'cell cell--buttons'
  },
];

var ExternalSwapiComponent = React.createClass({
    mixins: [Navigation, State],
    getInitialState: function(){
      var initial = {
        "externalSortColumn": null,
        "externalSortAscending": true,
      };
      return initial;
    },
    componentWillMount: function(){
    },
    componentDidMount: function(){
      // this.getExternalData();
    },
    // getExternalData: function(page){
    //   var that = this;
    //   page = page || 0;
    //   Persist.getScenarios(page)
    //   .then(data=> {
    //     console.log(data.page)
    //     this.setState({
    //     });
    //   });
    // },
    setPage: function(index){
      var page = goog.math.clamp(index, 0, this.props.maxPage);
      this.transitionTo('scenario-list', {}, {page})
    },
    setPageSize: function(size){
    },
    render: function(){
      return <Griddle gridClassName={'paged-table paged-table--' + this.props.cssModifier} useExternal={true} externalSetPage={this.setPage} enableSort={false}
          columns={Columns}
          columnMetadata={ColumnMetadata}
          externalSetPageSize={this.setPageSize}
          externalMaxPage={this.props.maxPage}
          externalChangeSort={function(){}}
          externalSetFilter={function(){}}
          externalCurrentPage={this.props.currentPage}
          results={this.props.results}
          tableClassName="table"
          resultsPerPage={PER_PAGE}
          externalSortColumn={this.state.externalSortColumn}
          externalSortAscending={this.state.externalSortAscending}
          useGriddleStyles={false} />
    }
});

module.exports = ExternalSwapiComponent;
