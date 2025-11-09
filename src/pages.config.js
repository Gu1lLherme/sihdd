import Dashboard from './pages/Dashboard';
import NovoCaso from './pages/NovoCaso';
import DetalheCaso from './pages/DetalheCaso';
import Relatorios from './pages/Relatorios';
import ChatAssistente from './pages/ChatAssistente';
import Auditoria from './pages/Auditoria';
import Integracoes from './pages/Integracoes';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "NovoCaso": NovoCaso,
    "DetalheCaso": DetalheCaso,
    "Relatorios": Relatorios,
    "ChatAssistente": ChatAssistente,
    "Auditoria": Auditoria,
    "Integracoes": Integracoes,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};