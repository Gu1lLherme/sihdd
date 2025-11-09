import Dashboard from './pages/Dashboard';
import NovoCaso from './pages/NovoCaso';
import DetalheCaso from './pages/DetalheCaso';
import Relatorios from './pages/Relatorios';
import ChatAssistente from './pages/ChatAssistente';
import Auditoria from './pages/Auditoria';
import Integracoes from './pages/Integracoes';
import DetalhesCaso from './pages/DetalhesCaso';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "NovoCaso": NovoCaso,
    "DetalheCaso": DetalheCaso,
    "Relatorios": Relatorios,
    "ChatAssistente": ChatAssistente,
    "Auditoria": Auditoria,
    "Integracoes": Integracoes,
    "DetalhesCaso": DetalhesCaso,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};