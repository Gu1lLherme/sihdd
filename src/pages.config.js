import Administracao from './pages/Administracao';
import ArvoreGenealogica from './pages/ArvoreGenealogica';
import Auditoria from './pages/Auditoria';
import Calendar from './pages/Calendar';
import ChatAssistente from './pages/ChatAssistente';
import Configuracoes from './pages/Configuracoes';
import Dashboard from './pages/Dashboard';
import DetalheCaso from './pages/DetalheCaso';
import DetalhesCaso from './pages/DetalhesCaso';
import Divorcios from './pages/Divorcios';
import Doacoes from './pages/Doacoes';
import Documentacao from './pages/Documentacao';
import Home from './pages/Home';
import Integracoes from './pages/Integracoes';
import Inventarios from './pages/Inventarios';
import ModelagemPartilha from './pages/ModelagemPartilha';
import Modulos from './pages/Modulos';
import NovaDoacao from './pages/NovaDoacao';
import NovoCaso from './pages/NovoCaso';
import NovoDivorcio from './pages/NovoDivorcio';
import PortalCliente from './pages/PortalCliente';
import Relatorios from './pages/Relatorios';
import Tasks from './pages/Tasks';
import DetalheDoacao from './pages/DetalheDoacao';
import DetalheDivorcio from './pages/DetalheDivorcio';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Administracao": Administracao,
    "ArvoreGenealogica": ArvoreGenealogica,
    "Auditoria": Auditoria,
    "Calendar": Calendar,
    "ChatAssistente": ChatAssistente,
    "Configuracoes": Configuracoes,
    "Dashboard": Dashboard,
    "DetalheCaso": DetalheCaso,
    "DetalhesCaso": DetalhesCaso,
    "Divorcios": Divorcios,
    "Doacoes": Doacoes,
    "Documentacao": Documentacao,
    "Home": Home,
    "Integracoes": Integracoes,
    "Inventarios": Inventarios,
    "ModelagemPartilha": ModelagemPartilha,
    "Modulos": Modulos,
    "NovaDoacao": NovaDoacao,
    "NovoCaso": NovoCaso,
    "NovoDivorcio": NovoDivorcio,
    "PortalCliente": PortalCliente,
    "Relatorios": Relatorios,
    "Tasks": Tasks,
    "DetalheDoacao": DetalheDoacao,
    "DetalheDivorcio": DetalheDivorcio,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};