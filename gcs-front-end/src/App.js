import './App.css';
import ArmButton from './components/armButton';
import DisarmButton from './components/disarmButton';
import TakeoffButton from './components/takeoffButton';
import LandButton from './components/landButton';
import GpsCoords from './components/gpsCoords';
import Indicators from './components/indicators';
import Hud from './components/hud';
import EsriMap from './components/esriMap';

function App() {
  return (
    <div className="App">
      <ArmButton/>
      <DisarmButton/>
      <TakeoffButton/>
      <LandButton/>
      <GpsCoords/>
      <Indicators/>
      <Hud/>
      <EsriMap/>
    </div>
  );
}

export default App;
