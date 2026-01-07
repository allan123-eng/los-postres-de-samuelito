"use client";
import React, { useState, useEffect } from 'react';

const HORARIO_APERTURA = 9; 
const HORARIO_CIERRE = 21;  
const WHATSAPP_NUMERO = "50581251478"; 

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
  const [mostrarGracias, setMostrarGracias] = useState(false);

  useEffect(() => {
    const revisarHorario = () => {
      const horaActual = new Date().getHours();
      setEstaAbierto(horaActual >= HORARIO_APERTURA && horaActual < HORARIO_CIERRE);
    };
    revisarHorario();
    const intervalo = setInterval(revisarHorario, 60000);
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
      if (producto && producto.cantidad > 1) {
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
    setMostrarGracias(true);
    setTimeout(() => setMostrarGracias(false), 5000); // El mensaje desaparece en 5 seg
  };

  const productosFiltrados = categoriaActiva === "todos" ? PRODUCTOS : PRODUCTOS.filter(p => p.categoria === categoriaActiva);

  return (
    <main className="min-h-screen bg-[#F8F7FF] p-6 font-sans">
      
      {/* AVISO DE GRACIAS */}
      {mostrarGracias && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce font-bold">
          ¡Pedido enviado con éxito! 🚀✨
        </div>
      )}

      {/* HEADER MORADO */}
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-8 bg-white p-6 rounded-3xl shadow-sm border border-purple-100">
        <div>
          <h1 className="text-3xl font-black text-purple-700 uppercase tracking-tighter italic">Samuelito Mix 🚀</h1>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${estaAbierto ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              {estaAbierto ? 'Abierto' : 'Cerrado'}
            </p>
          </div>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-purple-50 rounded-full text-purple-600 transition-transform hover:scale-110">
          <span className="text-2xl">🛍️</span>
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          )}
        </button>
      </header>

      {/* CATEGORÍAS MORADAS */}
      <div className="flex gap-4 max-w-6xl mx-auto mb-10 overflow-x-auto pb-2 no-scrollbar">
        {["todos", "postres", "pasteles", "pizza"].map((cat) => (
          <button key={cat} onClick={() => setCategoriaActiva(cat)}
            className={`px-8 py-3 rounded-2xl font-black capitalize transition-all whitespace-nowrap ${
              categoriaActiva === cat ? "bg-purple-600 text-white shadow-lg shadow-purple-200" : "bg-white text-purple-300 border border-purple-50 hover:border-purple-200"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* GRID PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {productosFiltrados.map((prod) => (
          <div key={prod.id} className="bg-white rounded-[2.5rem] shadow-sm border border-purple-50 overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="h-56 overflow-hidden relative">
               <img src={prod.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-black text-purple-600 uppercase italic">
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
                  className={`w-12 h-12 rounded-2xl font-bold text-2xl transition-all ${estaAbierto ? 'bg-purple-600 text-white hover:bg-purple-700 active:scale-90 shadow-lg shadow-purple-100' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
                  {estaAbierto ? '+' : '×'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CARRITO MORADO */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-purple-900/20 backdrop-blur-md z-40" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl p-8 flex flex-col animate-slide-in">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-3xl font-black text-gray-800 italic">Tu Bolsa 🛍️</h2>
               <button onClick={() => setIsCartOpen(false)} className="text-gray-400 text-4xl">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {carrito.length === 0 ? (
                <div className="text-center py-20">
                   <span className="text-6xl block mb-4">🍩</span>
                   <p className="text-gray-400 italic font-medium">¡Aún no hay antojitos!</p>
                </div>
              ) : (
                carrito.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-purple-50/50 p-4 rounded-2xl border border-purple-50">
                    <div>
                      <p className="font-bold text-gray-800">{item.nombre}</p>
                      <p className="text-purple-600 text-sm font-black">${(item.precio * item.cantidad).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-purple-100 shadow-sm">
                      <button onClick={() => restarDelCarrito(item.id)} className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-md font-bold text-gray-400 hover:text-purple-600">-</button>
                      <span className="font-bold text-gray-700">{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} className="w-6 h-6 flex items-center justify-center bg-purple-50 rounded-md font-bold text-purple-600">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {carrito.length > 0 && (
              <div className="mt-8 pt-8 border-t border-purple-100">
                <div className="flex justify-between mb-8">
                  <span className="font-bold text-gray-400 uppercase text-xs tracking-widest">Total del pedido:</span>
                  <span className="text-4xl font-black text-purple-700">${total.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={enviarPedido} 
                  disabled={!estaAbierto}
                  className={`w-full py-5 rounded-[2rem] font-black text-xl shadow-2xl flex items-center justify-center gap-3 transition-all ${
                    estaAbierto 
                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-100 hover:-translate-y-1' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  }`}>
                  {estaAbierto ? 'Pedir por WhatsApp 💬' : 'Local Cerrado'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}