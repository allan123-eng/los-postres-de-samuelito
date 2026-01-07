"use client";
import React, { useState, useEffect } from 'react';

// --- CONFIGURACIÓN DE TU NEGOCIO ---
const HORARIO_APERTURA = 9; // 9 AM
const HORARIO_CIERRE = 21;  // 9 PM (21:00)
const WHATSAPP_NUMERO = "50512345678"; // Tu número real

const PRODUCTOS = [
  { id: 1, categoria: "postres", nombre: "Cheesecake de Fresa", precio: 15.00, img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500" },
  { id: 2, categoria: "postres", nombre: "Brownie Melcochudo", precio: 8.50, img: "https://images.unsplash.com/photo-1543255006-d6395b6f1171?q=80&w=500" },
  { id: 3, categoria: "pasteles", nombre: "Torta de Chocolate", precio: 20.00, img: "https://images.unsplash.com/photo-1578985543219-10ac14b39535?q=80&w=500" },
  { id: 4, categoria: "pizza", nombre: "Pizza Pepperoni", precio: 12.00, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500" },
];

export default function Home() {
  const [carrito, setCarrito] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [estaAbierto, setEstaAbierto] = useState(true);

  // Lógica para verificar el horario automáticamente
  useEffect(() => {
    const revisarHorario = () => {
      const horaActual = new Date().getHours();
      if (horaActual >= HORARIO_APERTURA && horaActual < HORARIO_CIERRE) {
        setEstaAbierto(true);
      } else {
        setEstaAbierto(false);
      }
    };
    revisarHorario();
    const intervalo = setInterval(revisarHorario, 60000); // Revisa cada minuto
    return () => clearInterval(intervalo);
  }, []);

  const agregarAlCarrito = (prod: any) => {
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
      const producto = prev.find(item => item.id === id);
      if (producto.cantidad > 1) {
        return prev.map(item => item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const enviarPedido = () => {
    if (!estaAbierto) return;
    const lista = carrito.map(p => `- ${p.cantidad}x ${p.nombre}`).join('%0A');
    const mensaje = `Hola Samuelito! Pedido nuevo:%0A${lista}%0A*Total: $${total.toFixed(2)}*`;
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`, '_blank');
    setCarrito([]);
    setIsCartOpen(false);
  };

  const productosFiltrados = categoriaActiva === "todos" ? PRODUCTOS : PRODUCTOS.filter(p => p.categoria === categoriaActiva);

  return (
    <main className="min-h-screen bg-[#FFF9F5] p-6 font-sans">
      
      {/* HEADER CON ESTADO DE APERTURA */}
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-8 bg-white p-6 rounded-3xl shadow-sm border border-pink-50">
        <div>
          <h1 className="text-3xl font-black text-pink-600 uppercase tracking-tighter">Samuelito Mix 🚀</h1>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${estaAbierto ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <p className="text-gray-500 text-sm font-bold uppercase">
              {estaAbierto ? 'Abierto ahora' : 'Cerrado por ahora'}
            </p>
          </div>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-pink-50 rounded-full text-pink-600">
          <span className="text-2xl">🛍️</span>
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          )}
        </button>
      </header>

      {/* CATEGORÍAS */}
      <div className="flex gap-4 max-w-6xl mx-auto mb-10 overflow-x-auto pb-2">
        {["todos", "postres", "pasteles", "pizza"].map((cat) => (
          <button key={cat} onClick={() => setCategoriaActiva(cat)}
            className={`px-6 py-2 rounded-full font-bold capitalize transition-all ${
              categoriaActiva === cat ? "bg-pink-500 text-white shadow-lg" : "bg-white text-gray-400 border border-pink-50"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* GRID PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {productosFiltrados.map((prod) => (
          <div key={prod.id} className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden group">
            <div className="h-48 overflow-hidden"><img src={prod.img} className="w-full h-full object-cover group-hover:scale-110 transition-duration-500" /></div>
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">{prod.nombre}</h2>
              <div className="flex justify-between items-center">
                <p className="text-2xl text-pink-500 font-black">${prod.precio.toFixed(2)}</p>
                <button 
                  disabled={!estaAbierto}
                  onClick={() => agregarAlCarrito(prod)} 
                  className={`px-4 py-2 rounded-xl font-bold transition-colors ${estaAbierto ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  {estaAbierto ? '+' : '❌'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CARRITO (DRAWER) */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl p-8 flex flex-col transition-all">
            <h2 className="text-2xl font-black mb-8 text-gray-800">Tu Carrito 🛒</h2>
            <div className="flex-1 overflow-y-auto space-y-4">
              {carrito.length === 0 ? (
                <p className="text-gray-400 text-center py-20 italic">Tu bolsa está vacía...</p>
              ) : (
                carrito.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-pink-50 pb-4">
                    <div>
                      <p className="font-bold text-gray-800">{item.nombre}</p>
                      <p className="text-pink-500 text-sm font-bold">${(item.precio * item.cantidad).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => restarDelCarrito(item.id)} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-600">-</button>
                      <span className="font-bold">{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg font-bold">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {carrito.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex justify-between mb-6">
                  <span className="font-bold text-gray-400 uppercase text-xs tracking-widest">Total:</span>
                  <span className="text-3xl font-black text-pink-600">${total.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={enviarPedido} 
                  disabled={!estaAbierto}
                  className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all ${
                    estaAbierto 
                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-100' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  }`}>
                  {estaAbierto ? 'Confirmar por WhatsApp 💬' : 'Cerrado (Vuelve a las 9 AM)'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}