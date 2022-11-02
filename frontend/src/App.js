import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';
import { ConfirmProvider } from 'material-ui-confirm';
import './App.css';
import Login from './pages/Login';
import LocationScreen from './pages/LocationScreen';
import IDScreen from './pages/IDScreen';
import IDDetailScreen from './pages/IDDetailScreen';
import SKUDetailScreen from './pages/SKUDetailScreen';
import Main from './pages/Main';
import ToteDetail from './pages/ToteDetail';
import WarehouseCreate from './pages/Warehouse/Create';
import WarehouseList from './pages/Warehouse/List';
import WarehouseEdit from './pages/Warehouse/Edit';
import LocnPrinterMapCreate from './pages/LocnPrinterMap/Create';
import LocnPrinterMapList from './pages/LocnPrinterMap/List';
import LocnPrinterMapEdit from './pages/LocnPrinterMap/Edit';

function App() {
  return (
    <ConfirmProvider>
      <React.Fragment>
        <main className="w-full h-full" style={{ minHeight: "100vh" }}>
          <Switch>
            <Redirect from="/" exact to="/login" />
            <Route path="/login" component={Login} />
            <Route path="/main" component={Main} />
            <Route path="/tote_detail" component={ToteDetail} />
            <Route path="/warehouse/list" component={WarehouseList} />
            <Route path="/warehouse/create" component={WarehouseCreate} />
            <Route path="/warehouse/edit" component={WarehouseEdit} />
            <Route path="/locnprintermap/list" component={LocnPrinterMapList} />
            <Route path="/locnprintermap/create" component={LocnPrinterMapCreate} />
            <Route path="/locnprintermap/edit" component={LocnPrinterMapEdit} />

            <Route path="/location" component={LocationScreen} />
            <Route path="/id" component={IDScreen} />
            <Route path="/iddetail" component={IDDetailScreen} />
            <Route path="/sku" component={SKUDetailScreen} />
          </Switch>
        </main>
      </React.Fragment>
    </ConfirmProvider>
  );
}

export default App;
