import Header from './components/Header/Header';
import ProjectBoard from './components/ProjectBoard/ProjectBoard';
import Sidebar from './components/Sidebar/Sidebar';
import { GlobalStateProvider } from './lib/context/globalState';

/**
 * Application component that wraps the main layout.
 * @returns {eny} The application component.
 */

function App() {
  return (
    <GlobalStateProvider>
      <div className="container h-screen m-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(900px,_1fr)] md:min-h-screen">
          <Sidebar />
          <div className="flex flex-col">
            <Header />
            <ProjectBoard />
          </div>
        </div>
      </div>
    </GlobalStateProvider>
  );
}
export default App;
