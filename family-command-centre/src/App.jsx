import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAlerts } from './hooks/useAlerts';
import Dashboard from './components/Dashboard';
import PersonView from './components/PersonView';
import MorningRoutine from './components/MorningRoutine';
import AfterSchoolRoutine from './components/AfterSchoolRoutine';
import WeeklySchedule from './components/WeeklySchedule';
import JobsList from './components/JobsList';
import GirlsRooms from './components/GirlsRooms';
import Gamification from './components/Gamification';
import CheckIn from './components/CheckIn';
import BedtimeRoutine from './components/BedtimeRoutine';
import FoodPlanner from './components/FoodPlanner';
import Alert from './components/Alert';

const INITIAL_STORE = {
  points: {}, streaks: {}, completedTasks: {}, routineSteps: {},
  screenTime: {}, jobsDone: {}, jobsDoneBy: {}, girlsDone: {}, familyStreak: 0,
  taskRunnerIdx: 0, taskRunnerStarted: null, taskRunnerDate: null,
};

export default function App() {
  const [store, setStore] = useLocalStorage('family-command-centre', INITIAL_STORE);
  const [screen, setScreen] = useState('home');
  const [activePerson, setActivePerson] = useState(null);
  const { activeAlert, dismissAlert } = useAlerts();

  function goHome() { setScreen('home'); setActivePerson(null); }
  function handlePersonTap(id) { setActivePerson(id); setScreen('person'); }

  function renderScreen() {
    switch (screen) {
      case 'home': return <Dashboard store={store} setStore={setStore} onPersonTap={handlePersonTap} onNavigate={setScreen} />;
      case 'person': return <PersonView personId={activePerson} store={store} setStore={setStore} onBack={goHome} />;
      case 'morning': return <MorningRoutine store={store} setStore={setStore} onBack={goHome} />;
      case 'afterschool': return <AfterSchoolRoutine store={store} setStore={setStore} onBack={goHome} />;
      case 'schedule': return <WeeklySchedule onBack={goHome} />;
      case 'jobs': return <JobsList store={store} setStore={setStore} onBack={goHome} />;
      case 'girlsrooms': return <GirlsRooms store={store} setStore={setStore} onBack={goHome} />;
      case 'gamification': return <Gamification store={store} onBack={goHome} />;
      case 'checkin': return <CheckIn store={store} setStore={setStore} onBack={goHome} />;
      case 'bedtime': return <BedtimeRoutine store={store} setStore={setStore} onBack={goHome} />;
      case 'food': return <FoodPlanner onBack={goHome} />;
      default: return <Dashboard store={store} setStore={setStore} onPersonTap={handlePersonTap} onNavigate={setScreen} />;
    }
  }

  return (
    <div className="app-shell">
      <Alert alert={activeAlert} onDismiss={dismissAlert} />
      <div className="screen-wrapper">{renderScreen()}</div>
    </div>
  );
}
