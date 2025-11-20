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
import Documentacao from './pages/Documentacao';
import ModelagemPartilha from './pages/ModelagemPartilha';
import SimuladorPlanejamento from './pages/SimuladorPlanejamento';
import ArvoreGenealogica from './pages/ArvoreGenealogica';
import BotCNDs from './pages/BotCNDs';
import AvaliacaoBens from './pages/AvaliacaoBens';
import CofreDigital from './pages/CofreDigital';
import __Layout from './Layout.jsx';


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
    "Documentacao": Documentacao,
    "ModelagemPartilha": ModelagemPartilha,
    "SimuladorPlanejamento": SimuladorPlanejamento,
    "ArvoreGenealogica": ArvoreGenealogica,
    "BotCNDs": BotCNDs,
    "AvaliacaoBens": AvaliacaoBens,
    "CofreDigital": CofreDigital,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};