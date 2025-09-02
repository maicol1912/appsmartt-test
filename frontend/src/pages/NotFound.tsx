import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
            <h1 className="text-9xl font-extrabold text-red-500 tracking-widest">404</h1>
            <div className="bg-red-100 px-2 text-sm rounded rotate-12 absolute">
                Página no encontrada
            </div>

            <p className="mt-6 text-gray-600 text-lg">
                Lo sentimos, la página que buscas no existe o fue movida.
            </p>

            <Link
                to="/"
                className="mt-8 px-6 py-3 text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-md transition"
            >
                Volver al inicio
            </Link>
        </div>
    );
};

export default NotFound;
