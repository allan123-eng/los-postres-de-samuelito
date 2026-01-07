"use client";
import React, { useState } from 'react';

// 1. Agregamos el campo 'categoria' a los productos
const PRODUCTOS = [
  { id: 1, categoria: "postres", nombre: "Cheesecake de Fresa", precio: 15.00, img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500" },
  { id: 2, categoria: "postres", nombre: "Brownie Melcochudo", precio: 8.50, img: "https://images.unsplash.com/photo-1543255006-d6395b6f1171?q=80&w=500" },
  { id: 3, categoria: "pasteles", nombre: "Torta de Chocolate", precio: 20.00, img: "https://images.unsplash.com/photo-1578985543219-10ac14b39535?q=80&w=500" },
  { id: 4, categoria: "pizza", nombre: "Pizza Pepperoni", precio: 12.00, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500" },
  { id: 5, categoria: "pizza", nombre: "Pizza 4 Quesos", precio: 14.00, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500" },
];

export default function Home() {
  const [carrito, setCarrito] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("todos"); // Estado para el filtro

  const agregarAlCarrito = (prod: any) => {
    setCarrito([...carrito, { ...prod, uniqueId: Date.now() }]);
  };

  const eliminarDelCarrito = (uniqueId: number) => {
    setCarrito(carrito.filter(item => item.uniqueId !== uniqueId));
  };

  // Lógica de filtrado
  const productosFiltrados = categoriaActiva === "todos" 
    ? PRODUCTOS 
    : PRODUCTOS.filter(p => p.categoria === categoriaActiva);

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  const enviarPedido = () => {
    // 1. Creamos el texto para WhatsApp
    const lista = carrito.map(p => `- ${p.nombre} ($${p.precio.toFixed(2)})`).join('%0A');
    const mensaje = `Hola Samuelito! Quiero pedir:%0A${lista}%0A*Total: $${total.toFixed(2)}*`;
    
    // 2. Abrimos la ventana de WhatsApp
    window.open(`https://wa.me/50581251478?text=${mensaje}`, '_blank');

    // 3. LIMPIEZA: Vaciamos el estado del carrito
    setCarrito([]);
    
    // 4. OPCIONAL: Cerramos el panel lateral automáticamente
    setIsCartOpen(false);
  };
  return (
    <main className="min-h-screen bg-[#FFF9F5] p-6 font-sans">
      
      {/* HEADER E ICONO CARRITO */}
     <header className="flex justify-between items-center max-w-6xl mx-auto mb-8 bg-purple-50 p-4 rounded-2xl">
  <div>
    <h1 className="text-3xl font-black text-purple-600 uppercase tracking-tighter">Samuelito Mix 🚀</h1>
    <p className="text-gray-500 text-sm italic">¡Probando actualizaciones en vivo! ✨</p>
  </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-white rounded-full shadow-md border border-pink-100">
          <span className="text-2xl">🛍️</span>
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {carrito.length}
            </span>
          )}
        </button>
      </header>

      {/* BARRA DE CATEGORÍAS */}
      <div className="flex gap-4 max-w-6xl mx-auto mb-10 overflow-x-auto pb-2 no-scrollbar">
        {["todos", "postres", "pasteles", "pizza"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-6 py-2 rounded-full font-bold capitalize transition-all ${
              categoriaActiva === cat 
              ? "bg-pink-500 text-white shadow-lg shadow-pink-200" 
              : "bg-white text-gray-400 border border-pink-50 hover:border-pink-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID DINÁMICO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {productosFiltrados.map((prod) => (
          <div key={prod.id} className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden group">
            <div className="h-48 overflow-hidden">
              <img src={prod.img} alt={prod.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-300 mb-1 block">{prod.categoria}</span>
              <h2 className="text-lg font-bold text-gray-800 mb-4">{prod.nombre}</h2>
              <div className="flex justify-between items-center">
                <p className="text-2xl text-pink-500 font-black">${prod.precio.toFixed(2)}</p>
                <button onClick={() => agregarAlCarrito(prod)} className="bg-pink-500 text-white p-3 rounded-xl hover:bg-pink-600 transition-colors">
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-800">Tu Carrito 🛒</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 text-2xl">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4">
              {carrito.map((item) => (
                <div key={item.uniqueId} className="flex justify-between items-center border-b border-pink-50 pb-3">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{item.nombre}</p>
                    <p className="text-pink-500 text-xs">${item.precio.toFixed(2)}</p>
                  </div>
                  <button onClick={() => eliminarDelCarrito(item.uniqueId)} className="text-red-300 hover:text-red-500 text-xs font-bold">Quitar</button>
                </div>
              ))}
            </div>
            {carrito.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex justify-between mb-6">
                  <span className="font-bold text-gray-500">Total:</span>
                  <span className="text-2xl font-black text-pink-600">${total.toFixed(2)}</span>
                </div>
                <button onClick={enviarPedido} className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-600">
                  Confirmar WhatsApp 💬
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}