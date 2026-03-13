import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
    en: {
        translation: {
            login: 'Login',
            register: 'Register',
            email: 'Email',
            password: 'Password',
            name: 'Name',
            dashboard: 'Dashboard',
            createTask: 'Create Task',
            title: 'Title',
            description: 'Description',
            priority: 'Priority',
            status: 'Status',
            dueDate: 'Due Date',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            logout: 'Logout',
            noTasks: 'No tasks found',
            suggestPriority: 'Suggest Priority',
            suggestDescription: 'Suggest Description',
            welcome: 'Welcome back'
        }
    },
    es: {
        translation: {
            login: 'Iniciar sesión',
            register: 'Registrarse',
            email: 'Correo',
            password: 'Contraseña',
            name: 'Nombre',
            dashboard: 'Panel',
            createTask: 'Crear Tarea',
            title: 'Título',
            description: 'Descripción',
            priority: 'Prioridad',
            status: 'Estado',
            dueDate: 'Fecha límite',
            save: 'Guardar',
            cancel: 'Cancelar',
            delete: 'Eliminar',
            edit: 'Editar',
            logout: 'Cerrar sesión',
            noTasks: 'No se encontraron tareas',
            suggestPriority: 'Sugerir Prioridad',
            suggestDescription: 'Sugerir Descripción',
            welcome: 'Bienvenido'
        }
    },
    fr: {
        translation: {
            login: 'Connexion',
            register: "S'inscrire",
            email: 'Email',
            password: 'Mot de passe',
            name: 'Nom',
            dashboard: 'Tableau de bord',
            createTask: 'Créer une tâche',
            title: 'Titre',
            description: 'Description',
            priority: 'Priorité',
            status: 'Statut',
            dueDate: 'Date limite',
            save: 'Sauvegarder',
            cancel: 'Annuler',
            delete: 'Supprimer',
            edit: 'Modifier',
            logout: 'Déconnexion',
            noTasks: 'Aucune tâche trouvée',
            suggestPriority: 'Suggérer une priorité',
            suggestDescription: 'Suggérer une description',
            welcome: 'Bienvenue'
        }
    }
}

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    })

export default i18next