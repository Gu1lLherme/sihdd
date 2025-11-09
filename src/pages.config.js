import Dashboard from './pages/Dashboard';
import NovoCaso from './pages/NovoCaso';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "NovoCaso": NovoCaso,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};