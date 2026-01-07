"use client";
import React, { useState, useEffect } from 'react';

// --- CONFIGURACIÓN ---
const CLAVE_ADMIN = "1234"; 
const HORARIO_APERTURA = 9;  
const HORARIO_CIERRE = 21;   
const WHATSAPP_NUMERO = "50512345678"; // Número para recibir pedidos

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
  const [mostrarGracias, setMostrarGracias] = useState(false);

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

  const agregarAlCarrito = (prod: any) => {
    if (!estaAbierto) return;
    setCarrito(prev => {
      const existe = prev.find(item => item.id === prod.id);
      if (existe) return prev.map(item => item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  const restarDelCarrito = (id: number) => {
    setCarrito(prev => {
      const prod = prev.find(item => item.id === id);
      if (prod?.cantidad > 1) return prev.map(item => item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item);
      return prev.filter(item => item.id !== id);
    });
  };

  const enviarPedido = () => {
    const lista = carrito.map(p => `- ${p.cantidad}x ${p.nombre}`).join('%0A');
    const totalPedido = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=Hola! Pedido Samuelito Mix:%0A${lista}%0A*Total: C$ ${totalPedido.toFixed(2)}*`, '_blank');
    setCarrito([]); setIsCartOpen(false); setMostrarGracias(true);
    setTimeout(() => setMostrarGracias(false), 5000);
  };

  const productosFiltrados = productos.filter(p => 
    (categoriaActiva === "todos" || p.categoria === categoriaActiva) &&
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F8F7FF] p-4 text-slate-900">
      {mostrarGracias && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold animate-bounce">
          ¡Pedido enviado con éxito! 🚀
        </div>
      )}

      {/* HEADER */}
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-8 bg-white p-6 rounded-3xl shadow-sm border border-purple-100">
        <div>
          <h1 className="text-3xl font-black text-purple-700 italic">Samuelito Mix 🚀</h1>
          <p className="text-[10px] font-bold text-gray-500">{estaAbierto ? '🟢 ABIERTO' : '🔴 CERRADO'}</p>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-4 bg-purple-50 rounded-full text-purple-600 active:scale-95 transition-transform">
          <span className="text-2xl">🛍️</span>
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {carrito.reduce((acc, i) => acc + i.cantidad, 0)}
            </span>
          )}
        </button>
      </header>

      {/* BUSCADOR */}
      <input 
        type="text" 
        placeholder="🔍 ¿Qué deseas buscar?" 
        className="w-full max-w-6xl mx-auto block p-5 rounded-2xl mb-8 border-2 border-purple-50 outline-none text-gray-900 bg-white font-bold placeholder-gray-400 shadow-sm"
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
                  onClick={() => agregarAlCarrito(prod)}
                  className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-bold text-2xl shadow-lg active:scale-90">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CARRITO (SIDEBAR) */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-purple-900/20 backdrop-blur-md z-[200]" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[210] p-8 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-3xl font-black text-gray-800 italic">Tu Bolsa 🛍️</h2>
               <button onClick={() => setIsCartOpen(false)} className="text-gray-400 text-4xl">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              {carrito.length === 0 ? (
                <div className="text-center py-20 text-gray-400 italic">¡La bolsa está vacía! 🍩</div>
              ) : (
                carrito.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                    <div className="max-w-[150px]">
                      <p className="font-bold text-gray-900 text-sm truncate">{item.nombre}</p>
                      <p className="text-purple-600 text-xs font-black">C$ {(item.precio * item.cantidad).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-purple-100 shadow-sm">
                      <button onClick={() => restarDelCarrito(item.id)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-purple-600 font-bold">-</button>
                      <span className="font-bold text-gray-800">{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} className="w-6 h-6 flex items-center justify-center text-purple-600 font-bold">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {carrito.length > 0 && (
              <div className="mt-8 pt-8 border-t border-purple-100">
                <div className="flex justify-between mb-8 text-gray-800">
                  <span className="font-bold uppercase text-[10px] tracking-widest">Total:</span>
                  <span className="text-4xl font-black text-purple-700">C$ {carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0).toFixed(2)}</span>
                </div>
                <button onClick={enviarPedido} className="w-full py-5 rounded-3xl font-black text-xl bg-green-500 text-white shadow-xl shadow-green-100 active:scale-95 transition-all">
                  Confirmar WhatsApp 💬
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* PANEL ADMIN PROTEGIDO */}
      <button onClick={() => setIsAdminOpen(true)} className="fixed bottom-6 right-6 w-12 h-12 bg-white shadow-xl rounded-full z-50 opacity-20 hover:opacity-100 transition-opacity">⚙️</button>
      
      {isAdminOpen && (
        <div className="fixed inset-0 bg-purple-900/60 backdrop-blur-lg z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
            {!isAutenticado ? (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-black text-gray-800">Acceso Admin 🔐</h2>
                <input 
                  type="password" 
                  placeholder="Escribe la clave aquí" 
                  className="w-full p-5 rounded-2xl border-2 border-purple-200 text-center text-gray-900 font-black text-xl bg-white shadow-inner" 
                  onChange={(e) => setPasswordInput(e.target.value)} 
                />
                <button onClick={() => passwordInput === CLAVE_ADMIN ? setIsAutenticado(true) : alert('Clave incorrecta')} 
                  className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold">ENTRAR</button>
                <button onClick={() => setIsAdminOpen(false)} className="text-gray-400 font-bold">CERRAR</button>
              </div>
            ) : (
              <div className="space-y-6 text-gray-800">
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="text-2xl font-black text-gray-800 uppercase italic">Editor 👩‍🍳</h2>
                  <button onClick={() => {setIsAdminOpen(false); setIsAutenticado(false)}} className="text-gray-400 text-4xl">&times;</button>
                </div>

                <form onSubmit={gestionarGuardar} className="space-y-4 bg-purple-50 p-6 rounded-[2rem] border-2 border-purple-500">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-purple-700 ml-1 uppercase">Nombre:</label>
                    <input name="nombre" placeholder="Nombre del postre" defaultValue={editando?.nombre} className="w-full p-4 rounded-xl border-2 border-purple-100 text-gray-900 font-bold bg-white" required />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-black text-purple-700 ml-1 uppercase">Precio (C$):</label>
                    <input name="precio" type="number" step="0.01" placeholder="Ej: 350" defaultValue={editando?.precio} className="w-full p-4 rounded-xl border-2 border-purple-100 text-gray-900 font-bold bg-white" required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-purple-700 ml-1 uppercase">Imagen:</label>
                    <input type="file" accept="image/*" onChange={manejarImagen} className="w-full p-3 rounded-xl bg-white border-2 border-purple-100 text-gray-900 font-bold" />
                  </div>

                  <button className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg">
                    {editando ? "💾 GUARDAR CAMBIOS" : "➕ PUBLICAR"}
                  </button>
                </form>

                <div className="space-y-3">
                  {productos.map(p => (
                    <div key={p.id} className="flex justify-between items-center bg-white border-2 border-purple-50 p-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img src={p.img} className="w-12 h-12 rounded-lg object-cover" alt="min" />
                        <p className="font-bold text-sm text-gray-800">{p.nombre}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => {setEditando(p); setTempImg("")}} className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold text-[10px]">EDITAR</button>
                        <button onClick={() => setProductos(productos.filter(i => i.id !== p.id))} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg font-bold text-[10px]">BORRAR</button>
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