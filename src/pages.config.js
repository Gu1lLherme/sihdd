/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Administracao from './pages/Administracao';
import ArvoreGenealogica from './pages/ArvoreGenealogica';
import Auditoria from './pages/Auditoria';
import Calendar from './pages/Calendar';
import ChatAssistente from './pages/ChatAssistente';
import Configuracoes from './pages/Configuracoes';
import Dashboard from './pages/Dashboard';
import DetalheCaso from './pages/DetalheCaso';
import DetalheDivorcio from './pages/DetalheDivorcio';
import DetalheDoacao from './pages/DetalheDoacao';
import Divorcios from './pages/Divorcios';
import Doacoes from './pages/Doacoes';
import FatoJuridico from './pages/FatoJuridico';
import GestaoPrazos from './pages/GestaoPrazos';
import Integracoes from './pages/Integracoes';
import InteligenciaFerramentas from './pages/InteligenciaFerramentas';
import Inventarios from './pages/Inventarios';
import LegislacaoAdmin from './pages/LegislacaoAdmin';
import ModelagemPartilha from './pages/ModelagemPartilha';
import NovaDoacao from './pages/NovaDoacao';
import NovoCaso from './pages/NovoCaso';
import NovoDivorcio from './pages/NovoDivorcio';
import PortalCliente from './pages/PortalCliente';
import Relatorios from './pages/Relatorios';
import RelatoriosAuditoria from './pages/RelatoriosAuditoria';
import Tasks from './pages/Tasks';
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
    "DetalheDivorcio": DetalheDivorcio,
    "DetalheDoacao": DetalheDoacao,
    "Divorcios": Divorcios,
    "Doacoes": Doacoes,
    "FatoJuridico": FatoJuridico,
    "GestaoPrazos": GestaoPrazos,
    "Integracoes": Integracoes,
    "InteligenciaFerramentas": InteligenciaFerramentas,
    "Inventarios": Inventarios,
    "LegislacaoAdmin": LegislacaoAdmin,
    "ModelagemPartilha": ModelagemPartilha,
    "NovaDoacao": NovaDoacao,
    "NovoCaso": NovoCaso,
    "NovoDivorcio": NovoDivorcio,
    "PortalCliente": PortalCliente,
    "Relatorios": Relatorios,
    "RelatoriosAuditoria": RelatoriosAuditoria,
    "Tasks": Tasks,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};