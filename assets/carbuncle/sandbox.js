goog.require('app.socket');
goog.require('app.ui.SlickGrid');

var grid;
var columns = [
  {id: "id", name: "ID", field: "id"},
  {id: "title", name: "Title", field: "title", width: 200},
  {id: "entries", name: "Number of Entries", field: "entries", formatter: entriesFormatter},
  {id: "createdAt", name: "createdAt", field: "createdAt", formatter: app.ui.SlickGrid.dateFormatter, width: 170},
  {id: "updatedAt", name: "updatedAt", field: "updatedAt", formatter: app.ui.SlickGrid.dateFormatter, width: 170}
];







var options = {
  enableCellNavigation: true,
  enableColumnReorder: false,
  rowHeight: 41
};





var s = new app.ui.SlickGrid([], columns, options);
s.decorate(goog.dom.getElement('myGrid'));

app.socket().then(function(socket) {

  socket.get('/carbuncle/scenario', function(res) {

    s.slickgrid.setData(res);
    s.slickgrid.render();

  });

});
