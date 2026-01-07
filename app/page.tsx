"use client";
import React, { useState, useEffect } from 'react';

// --- CONFIGURACIÓN ---
const CLAVE_ADMIN = "1234"; 
const HORARIO_APERTURA = 9;  
const HORARIO_CIERRE = 21;   
const WHATSAPP_NUMERO = "50512345678"; 

const PRODUCTOS_INICIALES = [
  { id: 1, categoria: "postres", nombre: "Cheesecake de Fresa", precio: 15.00, img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500" },
  { id: 4, categoria: "pizza", nombre: "Pizza Pepperoni", precio: 12.00, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500" },
];

export default function Home() {
  const [productos, setProductos] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAutenticado, setIsAutenticado] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [estaAbierto, setEstaAbierto] = useState(true);
  const [editando, setEditando] = useState<any>(null);
  const [tempImg, setTempImg] = useState("");

  useEffect(() => {
    const guardados = localStorage.getItem('productos_samuelito');
    setProductos(guardados ? JSON.parse(guardados) : PRODUCTOS_INICIALES);
    const revisarHorario = () => {
      const hora = new Date().getHours();
      setEstaAbierto(hora >= HORARIO_APERTURA && hora < HORARIO_CIERRE);
    };
    revisarHorario();
  }, []);

  useEffect(() => {
    if (productos.length > 0) localStorage.setItem('productos_samuelito', JSON.stringify(productos));
  }, [productos]);

  const manejarImagen = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const gestionarGuardar = (e: any) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const pData = {
      id: editando ? editando.id : Date.now(),
      nombre: f.get('nombre'),
      precio: parseFloat(f.get('precio') as string),
      img: tempImg || editando?.img || "",
      categoria: f.get('categoria')
    };
    setProductos(editando ? productos.map(p => p.id === editando.id ? pData : p) : [...productos, pData]);
    setEditando(null); setTempImg(""); e.target.reset();
  };

  const productosFiltrados = productos.filter(p => 
    (categoriaActiva === "todos" || p.categoria === categoriaActiva) &&
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F8F7FF] p-4 text-slate-900">
      
      {/* HEADER */}
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-purple-100">
        <div>
          <h1 className="text-3xl font-black text-purple-700 italic">Samuelito Mix 🚀</h1>
          <p className="text-[10px] font-bold uppercase text-gray-500">{estaAbierto ? '🟢 Abierto' : '🔴 Cerrado'}</p>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="p-4 bg-purple-50 rounded-full text-purple-600">
          🛍️ {carrito.length > 0 && <span className="ml-2 font-bold">{carrito.reduce((acc, i) => acc + i.cantidad, 0)}</span>}
        </button>
      </header>

      {/* BUSCADOR */}
      <input 
        type="text" 
        placeholder="🔍 Buscar mi postre..." 
        className="w-full max-w-6xl mx-auto block p-5 rounded-2xl mb-8 border-2 border-purple-50 outline-none text-gray-900 bg-white placeholder-gray-400"
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* GRID PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {productosFiltrados.map((prod) => (
          <div key={prod.id} className="bg-white rounded-[2.5rem] shadow-sm border border-purple-50 overflow-hidden">
            <img src={prod.img} className="h-56 w-full object-cover" alt={prod.nombre} />
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{prod.nombre}</h2>
              <div className="flex justify-between items-center">
                <p className="text-2xl text-purple-700 font-black">C$ {prod.precio.toFixed(2)}</p>
                <button 
                  onClick={() => setCarrito(prev => {
                    const ex = prev.find(i => i.id === prod.id);
                    return ex ? prev.map(i => i.id === prod.id ? {...i, cantidad: i.cantidad + 1} : i) : [...prev, {...prod, cantidad: 1}];
                  })}
                  className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-bold text-2xl">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTÓN ADMIN */}
      <button onClick={() => setIsAdminOpen(true)} className="fixed bottom-6 right-6 w-12 h-12 bg-white shadow-xl rounded-full z-50 opacity-30 hover:opacity-100 transition-opacity">⚙️</button>
      
      {/* PANEL ADMIN CORREGIDO */}
      {isAdminOpen && (
        <div className="fixed inset-0 bg-purple-900/60 backdrop-blur-lg z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
            {!isAutenticado ? (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-black text-gray-800">Acceso Restringido 🔐</h2>
                <input 
                  type="password" 
                  placeholder="Escribe la clave aquí" 
                  className="w-full p-5 rounded-2xl border-2 border-purple-200 text-center text-gray-900 font-bold text-xl placeholder-gray-400" 
                  onChange={(e) => setPasswordInput(e.target.value)} 
                />
                <button onClick={() => passwordInput === CLAVE_ADMIN ? setIsAutenticado(true) : alert('Clave incorrecta')} 
                  className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold text-lg">Entrar al Panel</button>
                <button onClick={() => setIsAdminOpen(false)} className="text-gray-500 font-bold">Cerrar</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="text-2xl font-black text-gray-800">Editor Samuelito 👩‍🍳</h2>
                  <button onClick={() => {setIsAdminOpen(false); setIsAutenticado(false)}} className="text-gray-400 text-4xl">&times;</button>
                </div>

                <form onSubmit={gestionarGuardar} className="space-y-4 bg-purple-50 p-6 rounded-[2rem] border-2 border-purple-500">
                  <div className="space-y-1">
                    <label className="text-sm font-black text-purple-700 ml-1">NOMBRE DEL POSTRE:</label>
                    <input name="nombre" placeholder="Ej: Torta Chilena" defaultValue={editando?.nombre} className="w-full p-4 rounded-xl border-2 border-purple-100 text-gray-900 font-bold placeholder-gray-400 bg-white" required />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-black text-purple-700 ml-1">PRECIO EN C$:</label>
                    <input name="precio" type="number" step="0.01" placeholder="Ej: 500" defaultValue={editando?.precio} className="w-full p-4 rounded-xl border-2 border-purple-100 text-gray-900 font-bold bg-white" required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-black text-purple-700 ml-1">SUBIR IMAGEN:</label>
                    <input type="file" accept="image/*" onChange={manejarImagen} className="w-full p-3 rounded-xl bg-white border-2 border-purple-100 text-gray-900 font-medium" />
                  </div>

                  <select name="categoria" defaultValue={editando?.categoria || "postres"} className="w-full p-4 rounded-xl border-2 border-purple-100 bg-white font-bold text-gray-900">
                    <option value="postres">🧁 Postres</option>
                    <option value="pasteles">🎂 Pasteles</option>
                    <option value="pizza">🍕 Pizza</option>
                  </select>

                  <button className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg">
                    {editando ? "💾 GUARDAR CAMBIOS" : "➕ PUBLICAR AHORA"}
                  </button>
                </form>

                <div className="space-y-3">
                  <p className="text-xs font-black text-purple-400 uppercase tracking-widest ml-2">Lista de Productos</p>
                  {productos.map(p => (
                    <div key={p.id} className="flex justify-between items-center bg-white border-2 border-purple-50 p-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img src={p.img} className="w-12 h-12 rounded-lg object-cover" alt="miniatura" />
                        <p className="font-bold text-sm text-gray-800">{p.nombre}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => {setEditando(p); setTempImg("")}} className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-black text-[10px]">EDITAR</button>
                        <button onClick={() => setProductos(productos.filter(i => i.id !== p.id))} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg font-black text-[10px]">BORRAR</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}