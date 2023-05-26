import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import NotFound from 'views/pages/NotFound';
import ProjectsPage from 'views/pages/ProjectsPage';
import LeadersPage from 'views/dashboard/members/LeadersPage';
import BlogsPage from 'views/pages/blog/BlogsPage';
import AddBlogForm from 'components/blog/AddBlogForm';
import EditBlog from 'views/pages/blog/EditBlog';
import TestimonialsPage from 'views/utilities/TestimonialsPage';
import FathersPage from 'views/dashboard/members/FathersPage';
import MessagesPage from 'views/utilities/MessagesPage';
import NewsPage from 'views/utilities/NewsPage';
import AnnouncementsPage from 'views/utilities/AnnouncementsPage';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'home',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'members',
            children: [
                {
                    path: 'leaders',
                    element: <LeadersPage />
                },
                {
                    path: 'fathers',
                    element: <FathersPage />
                }
            ]
        },

        {
            path: 'activities',
            children: [
                {
                    path: 'testimonials',
                    element: <TestimonialsPage />
                },
                {
                    path: 'messages',
                    element: <MessagesPage />
                },
                {
                    path: 'news',
                    element: <NewsPage />
                },
                {
                    path: 'announcements',
                    element: <AnnouncementsPage />
                }
            ]
        },

        {
            path: 'icons',
            children: [
                {
                    path: 'tabler-icons',
                    element: <UtilsTablerIcons />
                },
                {
                    path: 'material-icons',
                    element: <UtilsMaterialIcons />
                }
            ]
        },
        {
            path: 'content',
            children: [
                {
                    path: 'blogs',
                    children: [
                        { path: '', element: <BlogsPage /> },
                        { path: 'new', element: <AddBlogForm /> },
                        { path: 'edit', children: [{ path: ':slug', element: <EditBlog /> }] }
                    ]
                },
                {
                    path: 'projects',
                    element: <ProjectsPage />
                }
            ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        },
        {
            path: '*',
            element: <NotFound />
        }
    ]
};

export default MainRoutes;
