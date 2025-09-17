import { Link, NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary px-3">
      <Link className="navbar-brand fw-bold" to="/">PetLife</Link>
      <div className="collapse navbar-collapse show">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item"><NavLink className="nav-link" to="/dogs">Perros</NavLink></li>
          <li className="nav-item"><NavLink className="nav-link" to="/notes">Notas</NavLink></li>
          <li className="nav-item"><NavLink className="nav-link" to="/calendar">Calendario</NavLink></li>
          <li className="nav-item"><NavLink className="nav-link" to="/profile">Perfil</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}
