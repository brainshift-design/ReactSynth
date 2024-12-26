import GraphView from './components/GraphView';
import Toolbar from './components/Toolbar';
import ToolbarButtons from './components/ToolbarButtons';

import styles from './App.module.css';



export default function App()
{
    return (
        <div className={styles.app}>
            <Toolbar>
                <ToolbarButtons />
            </Toolbar>
            <GraphView />
        </div>
    );
}