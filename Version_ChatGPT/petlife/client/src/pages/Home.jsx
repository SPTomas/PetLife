export default function Home() {
  return (
    <div className="container py-4">
      <h1 className="mb-3">Página Principal</h1>
      <p className="text-muted">Bienvenido a PetLife. Elegí una sección para empezar.</p>
      <div className="row g-3">
        {[
          { title: 'Perros', desc: 'Registrar, consultar, editar y eliminar', to: '/dogs' },
          { title: 'Notas', desc: 'Notas médicas y de seguimiento', to: '/notes' },
          { title: 'Calendario', desc: 'Próximos eventos y recordatorios', to: '/calendar' },
          { title: 'Perfil', desc: 'Tus datos y preferencias', to: '/profile' },
        ].map((c, i) => (
          <div className="col-12 col-md-6 col-lg-3" key={i}>
            <a className="card text-decoration-none h-100" href={c.to}>
              <div className="card-body">
                <h5 className="card-title">{c.title}</h5>
                <p className="card-text text-secondary">{c.desc}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
