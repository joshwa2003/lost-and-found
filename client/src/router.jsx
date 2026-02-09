
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            // {
            //   path: '/login',
            //   element: <Login />,
            // },
            // {
            //   path: '/dashboard',
            //   element: <Dashboard />,
            // },
        ],
    },
]);

export default router;
