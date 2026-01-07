"use client";
import React, { useState, useEffect } from 'react';

// --- CONFIGURACIÓN DE NEGOCIO ---
const CLAVE_ADMIN = "1234"; // Clave para entrar al panel
const HORARIO_APERTURA = 9;  // 9 AM
const HORARIO_CIERRE = 21;   // 9 PM
const WHATSAPP_NUMERO = "50581251478"; // Número de la dueña

const PRODUCTOS_INICIALES = [
  { id: 1, categoria: "postres", nombre: "Cheesecake de Fresa", precio: 15.00, img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500" },
  { id: 2, categoria: "postres", nombre: "Brownie Melcochudo", precio: 8.50, img: "https://images.unsplash.com/photo-1543255006-d6395b6f1171?q=80&w=500" },
  { id: 3, categoria: "pasteles", nombre: "Torta de Chocolate", precio: 20.00, img: "https://images.unsplash.com/photo-1578985543219-10ac14b39535?q=80&w=500" },
  { id: 4, categoria: "pizza", nombre: "Pizza Pepperoni", precio: 12.00, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500" },
];

export default function Home() {
  // --- ESTADOS ---
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

  // --- CARGA INICIAL Y PERSISTENCIA ---
  useEffect(() => {
    const guardados = localStorage.getItem('productos_samuelito');
    setProductos(guardados ? JSON.parse(guardados) : PRODUCTOS_INICIALES);
    
    const revisarHorario = () => {
      const hora = new Date().getHours();
      setEstaAbierto(hora >= HORARIO_APERTURA && hora < HORARIO_CIERRE);
    };
    revisarHorario();
    const intervalo = setInterval(revisarHorario, 60000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (productos.length > 0) {
      localStorage.setItem('productos_samuelito', JSON.stringify(productos));
    }
  }, [productos]);

  // --- FUNCIONES DE CARRITO ---
  const agregarAlCarrito = (prod: any) => {
    if (!estaAbierto) return;
    setCarrito(prev => {
      const existe = prev.find(item => item.id === prod.id);
      if (existe) {
        return prev.map(item => item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  const restarDelCarrito = (id: number) => {
    setCarrito(prev => {
      const prod = prev.find(item => item.id === id);
      if (prod?.cantidad > 1) {
        return prev.map(item => item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const enviarPedido = () => {
    const lista = carrito.map(p => `- ${p.cantidad}x ${p.nombre}`).join('%0A');
    const totalPedido = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=Hola! Pedido nuevo:%0A${lista}%0A*Total: $${totalPedido.toFixed(2)}*`, '_blank');
    setCarrito([]);
    setIsCartOpen(false);
    setMostrarGracias(true);
    setTimeout(() => setMostrarGracias(false), 5000);
  };

  // --- FUNCIONES ADMIN ---
  const gestionarGuardar = (e: any) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const pData = {
      id: editando ? editando.id : Date.now(),
      nombre: f.get('nombre'),
      precio: parseFloat(f.get('precio') as string),
      img: f.get('img'),
      categoria: f.get('categoria')
    };
    setProductos(editando ? productos.map(p => p.id === editando.id ? pData : p) : [...productos, pData]);
    setEditando(null);
    e.target.reset();
  };

  // --- FILTROS ---
  const productosFiltrados = productos.filter(p => 
    (categoriaActiva === "todos" || p.categoria === categoriaActiva) &&
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F8F7FF] p-4 md:p-8 font-sans transition-all">
      
      {/* MENSAJE DE ÉXITO */}
      {mostrarGracias && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce font-bold">
          ¡Pedido enviado con éxito! 🚀✨
        </div>
      )}

      {/* HEADER */}
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-purple-50">
        <div>
          <h1 className="text-3xl font-black text-purple-700 italic tracking-tighter">Samuelito Mix 🚀</h1>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${estaAbierto ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{estaAbierto ? 'Abierto' : 'Cerrado'}</p>
          </div>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-4 bg-purple-50 rounded-full text-purple-600 transition-transform active:scale-90">
          <span className="text-2xl">🛍️</span>
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          )}
        </button>
      </header>

      {/* BUSCADOR Y CATEGORÍAS */}
      <div className="max-w-6xl mx-auto space-y-6 mb-12">
        <input 
          type="text" 
          placeholder="🔍 ¿Qué se te antoja hoy?" 
          className="w-full p-5 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-purple-300 outline-none text-gray-600 font-medium"
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {["todos", "postres", "pasteles", "pizza"].map((cat) => (
            <button key={cat} onClick={() => setCategoriaActiva(cat)}
              className={`px-8 py-3 rounded-2xl font-black capitalize transition-all whitespace-nowrap ${
                categoriaActiva === cat ? "bg-purple-600 text-white shadow-lg shadow-purple-100" : "bg-white text-purple-300 border border-purple-50"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DE PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {productosFiltrados.map((prod) => (
          <div key={prod.id} className="bg-white rounded-[2.5rem] shadow-sm border border-purple-50 overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="h-56 overflow-hidden relative">
               <img src={prod.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-[10px] font-black text-purple-600 uppercase italic">
                 {prod.categoria}
               </div>
            </div>
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{prod.nombre}</h2>
              <div className="flex justify-between items-center">
                <p className="text-2xl text-purple-700 font-black">${prod.precio.toFixed(2)}</p>
                <button 
                  disabled={!estaAbierto}
                  onClick={() => agregarAlCarrito(prod)} 
                  className={`w-12 h-12 rounded-2xl font-bold text-2xl transition-all ${estaAbierto ? 'bg-purple-600 text-white hover:bg-purple-700 active:scale-90 shadow-lg' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
                  {estaAbierto ? '+' : '×'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CARRITO */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-purple-900/20 backdrop-blur-md z-[100]" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[110] shadow-2xl p-8 flex flex-col animate-slide-in">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-3xl font-black text-gray-800 italic">Tu Bolsa 🛍️</h2>
               <button onClick={() => setIsCartOpen(false)} className="text-gray-300 text-4xl hover:text-purple-600 transition-colors">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {carrito.length === 0 ? (
                <div className="text-center py-20 italic text-gray-400">¡Tu bolsa está vacía! 🍩</div>
              ) : (
                carrito.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-purple-50/30 p-4 rounded-2xl border border-purple-50">
                    <div className="max-w-[150px]">
                      <p className="font-bold text-gray-800 text-sm truncate">{item.nombre}</p>
                      <p className="text-purple-600 text-xs font-black">${(item.precio * item.cantidad).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-purple-100">
                      <button onClick={() => restarDelCarrito(item.id)} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-purple-600">-</button>
                      <span className="font-bold text-sm text-gray-700">{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} className="w-6 h-6 flex items-center justify-center text-purple-600">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {carrito.length > 0 && (
              <div className="mt-8 pt-8 border-t border-purple-100">
                <div className="flex justify-between mb-8">
                  <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Total:</span>
                  <span className="text-4xl font-black text-purple-700">${carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0).toFixed(2)}</span>
                </div>
                <button onClick={enviarPedido} className="w-full py-5 rounded-[2rem] font-black text-xl bg-green-500 text-white hover:bg-green-600 shadow-xl shadow-green-100 transition-all active:scale-95">
                  WhatsApp 💬
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* PANEL ADMIN (Protegido) */}
      <button onClick={() => setIsAdminOpen(true)} className="fixed bottom-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-sm shadow-xl rounded-full flex items-center justify-center z-50 border border-purple-100 opacity-30 hover:opacity-100 transition-all text-xl">⚙️</button>
      
      {isAdminOpen && (
        <div className="fixed inset-0 bg-purple-900/60 backdrop-blur-lg z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-8">
              {!isAutenticado ? (
                <div className="text-center space-y-6 py-10">
                  <div className="text-5xl">🔐</div>
                  <h2 className="text-xl font-bold">Acceso Restringido</h2>
                  <input type="password" placeholder="Clave de Admin" className="w-full p-4 rounded-2xl border-2 border-purple-100 outline-none text-center text-2xl tracking-widest" 
                    onChange={(e) => setPasswordInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (passwordInput === CLAVE_ADMIN ? setIsAutenticado(true) : alert('Error'))} />
                  <button onClick={() => passwordInput === CLAVE_ADMIN ? setIsAutenticado(true) : alert('Clave incorrecta')} className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold">Entrar</button>
                  <button onClick={() => setIsAdminOpen(false)} className="text-gray-400 text-sm">Cancelar</button>
                </div>
              ) : (
                <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black italic">Editor 👩‍🍳</h2>
                    <button onClick={() => {setIsAdminOpen(false); setIsAutenticado(false)}} className="text-3xl text-gray-300">&times;</button>
                  </div>
                  <form onSubmit={gestionarGuardar} className="space-y-4 bg-purple-50/50 p-6 rounded-[2rem] border-2 border-purple-400">
                    <input name="nombre" placeholder="Nombre" defaultValue={editando?.nombre} className="w-full p-4 rounded-xl outline-none" required />
                    <input name="precio" type="number" step="0.01" placeholder="Precio ($)" defaultValue={editando?.precio} className="w-full p-4 rounded-xl outline-none" required />
                    <input name="img" placeholder="URL de imagen" defaultValue={editando?.img} className="w-full p-4 rounded-xl outline-none" required />
                    <select name="categoria" defaultValue={editando?.categoria || "postres"} className="w-full p-4 rounded-xl outline-none bg-white">
                      <option value="postres">Postres</option><option value="pasteles">Pasteles</option><option value="pizza">Pizza</option>
                    </select>
                    <button className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-100">
                      {editando ? "Actualizar" : "Publicar Nuevo"}
                    </button>
                  </form>
                  <div className="space-y-3">
                    {productos.map(p => (
                      <div key={p.id} className="flex justify-between items-center bg-white border border-purple-50 p-3 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <img src={p.img} className="w-10 h-10 rounded-lg object-cover" />
                          <p className="font-bold text-xs truncate max-w-[100px]">{p.nombre}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditando(p)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">EDITAR</button>
                          <button onClick={() => setProductos(productos.filter(item => item.id !== p.id))} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold">BORRAR</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}