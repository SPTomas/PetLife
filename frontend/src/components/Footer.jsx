export default function Footer() {
  return (
    <footer className="fixed-bottom bg-light shadow-sm">
      <div className="d-flex justify-content-around align-items-center py-2">
        <button className="btn btn-light d-flex flex-column align-items-center">
          <i className="bi bi-basket-fill fs-4"></i>
          <small>Comida</small>
        </button>
        <button className="btn btn-light d-flex flex-column align-items-center">
          <i className="bi bi-bandaid fs-4"></i>
          <small>Vacuna</small>
        </button>
        <button className="btn btn-light d-flex flex-column align-items-center">
          <i className="bi bi-house-door-fill fs-4"></i>
          <small>Inicio</small>
        </button>
        <button className="btn btn-light d-flex flex-column align-items-center">
          <i className="bi bi-file-earmark-text-fill fs-4"></i>
          <small>Docs</small>
        </button>
        <button className="btn btn-light d-flex flex-column align-items-center">
          <i className="bi bi-heart-pulse-fill fs-4"></i>
          <small>Salud</small>
        </button>
      </div>
    </footer>
  );
}
