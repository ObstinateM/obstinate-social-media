import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar, NavTitle, UserInfo, NavItem, NavSection } from 'Components/Navbar/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import { Feed } from './Components/Posts/Posts';
import { Register, Login } from './Components/Auth/Auth';
import './App.css';

function App() {
    return (
        <>
            <Toaster />
            <Login />
        </>
    );
}

// function App() {
//     return (
//         <>
//             <Router>
//                 <Navbar>
//                     <NavTitle icon="images/work-in-progress.png" title="Web Manager" />
//                     <UserInfo picture={''} name={'TEMP'} />
//                     <NavSection sectionName="MAIN NAVIGATION">
//                         <NavItem icon="images/dashboard.png" title="Dashboard" href="/" />
//                         <NavItem icon="images/server.png" title="Process" href="/process" />
//                         <NavItem icon="images/settings.png" title="Settings" href="/settings" />
//                         <NavItem icon="images/logout.png" title="Logout" />
//                     </NavSection>
//                 </Navbar>
//                 <main>
//                     <Switch>
//                         <Route path="/" exact component={Feed} />
//                         <Route path="/" component={() => <h1>404 Error</h1>} />
//                     </Switch>
//                 </main>
//             </Router>
//         </>
//     );
// }

export default App;
