import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


const ProtectedRoutes = ({ children, allowedRoles }) => {
 const { user } = useSelector((state) => state.Auth);
  const location = useLocation();

/*   if (!user) {
    // Rediriger vers login si non authentifié
    return <Navigate to="/login" state={{ from: location }} replace />;
  } */

  if (!allowedRoles.includes(user.role)) {
    // Rediriger vers la page d'accueil si le rôle n'est pas autorisé
    return <Navigate to="/" replace />;
    console.log("acces dined")
  }

  return children;
};

export default ProtectedRoutes;

