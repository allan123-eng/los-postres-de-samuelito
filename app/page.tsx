"use client";
import React, { useState, useEffect } from 'react';

// --- CONFIGURACIÓN DE NEGOCIO ---
const CLAVE_ADMIN = "1234"; 
const HORARIO_APERTURA = 9;  
const HORARIO_CIERRE = 21;   
const WHATSAPP_NUMERO = "50581251478"; 

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
  const [mostrarGracias, setMostrarGracias] = useState(false);
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
    setInterval(revisarHorario, 60000);
  }, []);

  useEffect(() => {
    if (productos.length > 0) localStorage.setItem('productos_samuelito', JSON.stringify(productos));
  }, [productos]);

  // Manejador de imagen desde archivos
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
    setEditando(null);
    setTempImg("");
    e.target.reset();
  };

  const agregarAlCarrito = (prod: any) => {
    if (!estaAbierto) return;
    setCarrito(prev => {
      const existe = prev.find(item => item.id === prod.id);
      if (existe) return prev.map(item => item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  const productosFiltrados = productos.filter(p => 
    (categoriaActiva === "todos" || p.categoria === categoriaActiva) &&
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F8F7FF] p-4 md:p-8 text-slate-900">
      
      {mostrarGracias && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] bg-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce font-bold">
          ¡Pedido enviado con éxito! 🚀
        </div>
      )}

      {/* HEADER */}
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-purple-50">
        <div>
          <h1 className="text-3xl font-black text-purple-700 italic">LOS POSTRES DE SAMUELITO</h1>
          <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
            {estaAbierto ? '🟢 Abierto' : '🔴 Cerrado'}
          </p>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-4 bg-purple-50 rounded-full text-purple-600">
          <span className="text-2xl">🛍️</span>
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          )}
        </button>
      </header>

      {/* BUSCADOR */}
      <div className="max-w-6xl mx-auto mb-8">
        <input 
          type="text" 
          placeholder="🔍 Buscar mi postre..." 
          className="w-full p-5 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-purple-300 outline-none text-gray-700 bg-white"
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {productosFiltrados.map((prod) => (
          <div key={prod.id} className="bg-white rounded-[2.5rem] shadow-sm border border-purple-50 overflow-hidden group">
            <div className="h-56 overflow-hidden">
               <img src={prod.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{prod.nombre}</h2>
              <div className="flex justify-between items-center">
                <p className="text-2xl text-purple-700 font-black">C$ {prod.precio.toFixed(2)}</p>
                <button 
                  disabled={!estaAbierto}
                  onClick={() => agregarAlCarrito(prod)} 
                  className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-bold text-2xl shadow-lg active:scale-90 disabled:bg-gray-100">
                  {estaAbierto ? '+' : '×'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PANEL ADMIN (SOLO PARA LA ADMINISTRADORA) */}
      <button onClick={() => setIsAdminOpen(true)} className="fixed bottom-6 right-6 w-12 h-12 bg-white shadow-xl rounded-full z-50 opacity-20 hover:opacity-100 transition-opacity">⚙️</button>
      
      {isAdminOpen && (
        <div className="fixed inset-0 bg-purple-900/60 backdrop-blur-lg z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
            {!isAutenticado ? (
              <div className="text-center space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Clave de Administradora</h2>
                <input type="password" placeholder="Contraseña" className="w-full p-4 rounded-2xl border-2 border-purple-100 text-center text-gray-900" 
                  onChange={(e) => setPasswordInput(e.target.value)} />
                <button onClick={() => passwordInput === CLAVE_ADMIN ? setIsAutenticado(true) : alert('Clave incorrecta')} 
                  className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold">Entrar</button>
                <button onClick={() => setIsAdminOpen(false)} className="text-gray-400 text-sm">Cerrar</button>
              </div>
            ) : (
              <div className="space-y-6 text-gray-800">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black italic">Gestionar Menú 👩‍🍳</h2>
                  <button onClick={() => {setIsAdminOpen(false); setIsAutenticado(false)}} className="text-3xl">&times;</button>
                </div>

                <form onSubmit={gestionarGuardar} className="space-y-4 bg-purple-50 p-6 rounded-[2rem] border-2 border-purple-500">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-600 ml-2 uppercase">Nombre</label>
                    <input name="nombre" placeholder="Ej: Torta de Chocolate" defaultValue={editando?.nombre} className="w-full p-4 rounded-xl border border-purple-100 text-gray-900" required />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-600 ml-2 uppercase">Precio (Cordobas)</label>
                    <input name="precio" type="number" step="0.01" placeholder="Ej: 350.00" defaultValue={editando?.precio} className="w-full p-4 rounded-xl border border-purple-100 text-gray-900" required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-600 ml-2 uppercase">Foto del Producto</label>
                    <input type="file" accept="image/*" onChange={manejarImagen} className="w-full p-3 rounded-xl bg-white border border-purple-100 text-sm" />
                    {(tempImg || editando?.img) && <img src={tempImg || editando?.img} className="h-20 w-20 object-cover rounded-lg mx-auto border-2 border-white shadow-sm" alt="preview" />}
                  </div>

                  <select name="categoria" defaultValue={editando?.categoria || "postres"} className="w-full p-4 rounded-xl border border-purple-100 bg-white font-bold text-gray-700">
                    <option value="postres">🧁 Postres</option>
                    <option value="pasteles">🎂 Pasteles</option>
                    <option value="pizza">🍕 Pizza</option>
                  </select>

                  <button className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-100 active:scale-95 transition-transform">
                    {editando ? "💾 Guardar Cambios" : "➕ Publicar Postre"}
                  </button>
                </form>

                <div className="space-y-3">
                  <p className="text-xs font-black text-purple-300 uppercase tracking-widest ml-2">Productos actuales</p>
                  {productos.map(p => (
                    <div key={p.id} className="flex justify-between items-center bg-white border border-purple-50 p-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img src={p.img} className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                        <p className="font-bold text-xs text-gray-700 truncate max-w-[120px]">{p.nombre}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => {setEditando(p); setTempImg("")}} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">EDITAR</button>
                        <button onClick={() => setProductos(productos.filter(i => i.id !== p.id))} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold">BORRAR</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CARRITO (Mismo que antes pero con C$) */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-purple-900/20 backdrop-blur-md z-[100]" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[110] p-8 flex flex-col">
            <h2 className="text-3xl font-black text-gray-800 italic mb-10">Tu Bolsa 🛍️</h2>
            <div className="flex-1 overflow-y-auto space-y-4">
              {carrito.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-purple-50/30 p-4 rounded-2xl">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{item.nombre}</p>
                    <p className="text-purple-600 text-xs font-black">C$ {(item.precio * item.cantidad).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-2 rounded-xl">
                    <button onClick={() => restarDelCarrito(item.id)} className="text-gray-300">-</button>
                    <span className="font-bold text-sm">{item.cantidad}</span>
                    <button onClick={() => agregarAlCarrito(item)} className="text-purple-600">+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t">
              <div className="flex justify-between mb-8">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Total:</span>
                <span className="text-4xl font-black text-purple-700">C$ {carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0).toFixed(2)}</span>
              </div>
              <button onClick={() => {
                const lista = carrito.map(p => `- ${p.cantidad}x ${p.nombre}`).join('%0A');
                window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=Hola! Mi pedido es:%0A${lista}`, '_blank');
                setCarrito([]); setIsCartOpen(false); setMostrarGracias(true);
              }} className="w-full py-5 rounded-[2rem] font-black text-xl bg-green-500 text-white shadow-xl shadow-green-100">WhatsApp 💬</button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}