import Dashboard from './pages/Dashboard';
import NovoCaso from './pages/NovoCaso';
import DetalheCaso from './pages/DetalheCaso';
import Relatorios from './pages/Relatorios';
import ChatAssistente from './pages/ChatAssistente';
import Auditoria from './pages/Auditoria';
import Integracoes from './pages/Integracoes';
import DetalhesCaso from './pages/DetalhesCaso';
import Inventarios from './pages/Inventarios';
import Modulos from './pages/Modulos';
import Administracao from './pages/Administracao';
import PortalCliente from './pages/PortalCliente';
import Configuracoes from './pages/Configuracoes';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
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
    "Inventarios": Inventarios,
    "Modulos": Modulos,
    "Administracao": Administracao,
    "PortalCliente": PortalCliente,
    "Configuracoes": Configuracoes,
    "Tasks": Tasks,
    "Calendar": Calendar,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};