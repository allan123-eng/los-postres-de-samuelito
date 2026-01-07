"use client";
import React, { useState, useEffect } from 'react';

const HORARIO_APERTURA = 9; 
const HORARIO_CIERRE = 21;  
const WHATSAPP_NUMERO = "50581251478"; 

const PRODUCTOS_INICIALES = [
  { id: 1, categoria: "postres", nombre: "Cheesecake de Fresa", precio: 15.00, img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500" },
  { id: 2, categoria: "postres", nombre: "Brownie Melcochudo", precio: 8.50, img: "https://images.unsplash.com/photo-1543255006-d6395b6f1171?q=80&w=500" },
  { id: 4, categoria: "pizza", nombre: "Pizza Pepperoni", precio: 12.00, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500" },
];

export default function Home() {
  const [productos, setProductos] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [estaAbierto, setEstaAbierto] = useState(true);

  // Estado para el formulario de edición
  const [editando, setEditando] = useState<any>(null);

  // Cargar productos al iniciar
  useEffect(() => {
    const guardados = localStorage.getItem('productos_samuelito');
    if (guardados) {
      setProductos(JSON.parse(guardados));
    } else {
      setProductos(PRODUCTOS_INICIALES);
    }
    
    const horaActual = new Date().getHours();
    setEstaAbierto(horaActual >= HORARIO_APERTURA && horaActual < HORARIO_CIERRE);
  }, []);

  // Guardar productos cada vez que cambien
  useEffect(() => {
    if (productos.length > 0) {
      localStorage.setItem('productos_samuelito', JSON.stringify(productos));
    }
  }, [productos]);

  const guardarProducto = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nuevoProd = {
      id: editando ? editando.id : Date.now(),
      nombre: formData.get('nombre'),
      precio: parseFloat(formData.get('precio') as string),
      img: formData.get('img'),
      categoria: formData.get('categoria')
    };

    if (editando) {
      setProductos(productos.map(p => p.id === editando.id ? nuevoProd : p));
    } else {
      setProductos([...productos, nuevoProd]);
    }
    setEditando(null);
    e.target.reset();
  };

  const eliminarProducto = (id: number) => {
    if(confirm("¿Seguro que quieres eliminar este producto?")) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  const productosFiltrados = productos.filter(p => 
    (categoriaActiva === "todos" || p.categoria === categoriaActiva) &&
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarAlCarrito = (prod: any) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === prod.id);
      if (existe) return prev.map(item => item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <main className="min-h-screen bg-[#F8F7FF] p-4 font-sans">
      
      {/* HEADER */}
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-6 bg-white p-4 rounded-3xl shadow-sm">
        <h1 className="text-2xl font-black text-purple-700 italic">Samuelito Mix 🚀</h1>
        <div className="flex gap-2">
          <button onClick={() => setIsAdminOpen(true)} className="p-3 bg-gray-100 rounded-full">⚙️</button>
          <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-purple-600 rounded-full text-white">
            🛍️ {carrito.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{carrito.length}</span>}
          </button>
        </div>
      </header>

      {/* BUSCADOR */}
      <div className="max-w-6xl mx-auto mb-6">
        <input 
          type="text" 
          placeholder="🔍 Buscar mi postre favorito..." 
          className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* CATEGORÍAS */}
      <div className="flex gap-2 max-w-6xl mx-auto mb-8 overflow-x-auto pb-2 no-scrollbar">
        {["todos", "postres", "pasteles", "pizza"].map((cat) => (
          <button key={cat} onClick={() => setCategoriaActiva(cat)}
            className={`px-6 py-2 rounded-xl font-bold capitalize transition-all ${
              categoriaActiva === cat ? "bg-purple-600 text-white" : "bg-white text-purple-300"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* GRID PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {productosFiltrados.map((prod) => (
          <div key={prod.id} className="bg-white rounded-3xl shadow-sm border border-purple-50 overflow-hidden">
            <img src={prod.img} className="h-48 w-full object-cover" />
            <div className="p-6">
              <h2 className="font-bold text-gray-800">{prod.nombre}</h2>
              <div className="flex justify-between items-center mt-4">
                <p className="text-xl font-black text-purple-700">${prod.precio.toFixed(2)}</p>
                <button onClick={() => agregarAlCarrito(prod)} className="bg-purple-600 text-white px-4 py-2 rounded-xl">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PANEL DE ADMINISTRADORA */}
      {isAdminOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2rem] p-8 overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Panel de Control 👩‍🍳</h2>
              <button onClick={() => {setIsAdminOpen(false); setEditando(null)}} className="text-3xl">&times;</button>
            </div>

            <form onSubmit={guardarProducto} className="grid grid-cols-1 gap-4 mb-8 bg-purple-50 p-6 rounded-2xl">
              <input name="nombre" placeholder="Nombre del postre" defaultValue={editando?.nombre} required className="p-3 rounded-xl border-none" />
              <input name="precio" type="number" step="0.01" placeholder="Precio ($)" defaultValue={editando?.precio} required className="p-3 rounded-xl border-none" />
              <input name="img" placeholder="Link de la imagen" defaultValue={editando?.img} required className="p-3 rounded-xl border-none" />
              <select name="categoria" defaultValue={editando?.categoria || "postres"} className="p-3 rounded-xl border-none">
                <option value="postres">Postres</option>
                <option value="pasteles">Pasteles</option>
                <option value="pizza">Pizza</option>
              </select>
              <button className="bg-purple-600 text-white py-3 rounded-xl font-bold">
                {editando ? "Actualizar Producto" : "Agregar Nuevo Postre"}
              </button>
            </form>

            <div className="space-y-4">
              {productos.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-white border p-4 rounded-xl">
                  <div className="flex items-center gap-4">
                    <img src={p.img} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-sm">{p.nombre}</p>
                      <p className="text-purple-600 font-bold">${p.precio}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditando(p)} className="p-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">Editar</button>
                    <button onClick={() => eliminarProducto(p.id)} className="p-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold">Borrar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CARRITO Y WHATSAPP (Se mantienen igual que el anterior) */}
      {/* ... código del carrito ... */}
    </main>
  );
}