import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from 'material-ui/Table';
import {Container} from 'flux/utils';
import Store from '../../stores/testcases';
import {dispatch, dispatchBrowserStateChange, loadTestCases} from '../../action';
import {getRecordKeyForDisplay} from '../../util';

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
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Title</TableHeaderColumn>
              <TableHeaderColumn>Steps</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.state.testCases.map(testCase =>
              <TableRow key={testCase.key}>
                <TableRowColumn>{getRecordKeyForDisplay(testCase.key)}</TableRowColumn>
                <TableRowColumn>{testCase.title}</TableRowColumn>
                <TableRowColumn>{testCase.steps.length}</TableRowColumn>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
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

module.exports = Container.create(TestCases);
