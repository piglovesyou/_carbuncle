import React from 'react';
import { hashHistory } from 'react-router';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import {Container} from 'flux/utils';
import Store from '../../stores/testcases';
import {dispatch, dispatchBrowserStateChange, loadTestCases, loadTestCase} from '../../action';
import {getRecordKeyForDisplay} from '../../util';
import Moment from 'moment';

class TestCases extends React.Component {
  static getStores() {
    return [Store];
  }
  static calculateState(prevState) {
    return Store.getState();
  }
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='dashboard__body dashboard__body--testcases'>
        <h2>Testcases</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Title</TableHeaderColumn>
              <TableHeaderColumn>Steps</TableHeaderColumn>
              <TableHeaderColumn>ModifiedAt</TableHeaderColumn>
              <TableHeaderColumn> </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.state.testCases.map(testCase =>
              <TableRow key={testCase.key}>
                <TableRowColumn>{getRecordKeyForDisplay(testCase.key)}</TableRowColumn>
                <TableRowColumn>{testCase.title}</TableRowColumn>
                <TableRowColumn>{testCase.steps.length}</TableRowColumn>
                <TableRowColumn>{Moment(testCase.modifiedAt).startOf('minute').fromNow()}</TableRowColumn>
                <TableRowColumn style={{textAlign: 'right'}}>
                  <FlatButton onTouchTap={handleEditClick.bind(null, testCase)}>edit</FlatButton>
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableRowColumn colSpan='5' style={{textAlign: 'center'}}>
                All test cases are displayed.
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
  componentDidMount() {
    loadTestCases(0);
  }
};

function handleEditClick(testCase, e) {
  e.preventDefault();
  e.stopPropagation();
  loadTestCase(testCase.key);
  hashHistory.push('/');
}

module.exports = Container.create(TestCases);
