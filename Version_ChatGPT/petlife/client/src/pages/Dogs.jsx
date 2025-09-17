import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Dogs() {
  const [dogs, setDogs] = useState([]);
  const ownerId = 1; // placeholder hasta que hagamos auth

  useEffect(() => {
    api.get(`/dogs/owner/${ownerId}`).then(res => setDogs(res.data));
  }, []);

  return (
    <div className="container py-4">
      <h2>Perros</h2>
      <ul className="list-group mt-3">
        {dogs.map(d => (
          <li key={d.id} className="list-group-item d-flex justify-content-between">
            <span>{d.name} {d.breed ? `· ${d.breed}` : ''}</span>
            <small className="text-secondary">ID {d.id}</small>
          </li>
        ))}
        {dogs.length === 0 && <li className="list-group-item text-secondary">Sin perros aún</li>}
      </ul>
    </div>
  );
}
