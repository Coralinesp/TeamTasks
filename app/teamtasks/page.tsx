'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function TeamTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);

  const STORAGE_KEY = 'teamtasks_data';

  // Cargar tareas desde localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTasks(JSON.parse(saved));
    }
    setMounted(true);
  }, []);

  // Guardar tareas en localStorage cada vez que cambien
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  // Agregar nueva tarea
  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    const taskText = input.trim();

    if (taskText === '') return;

    const newTask: Task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toLocaleString('es-ES'),
    };

    setTasks([newTask, ...tasks]);
    setInput('');
  };

  // Alternar estado de tarea
  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Eliminar tarea con animación
  const deleteTask = (id: number) => {
    setRemoving(id);
    setTimeout(() => {
      setTasks(tasks.filter((task) => task.id !== id));
      setRemoving(null);
    }, 300);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-linear-to-br from-purple-600 to-purple-800 flex items-center justify-center p-5">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideIn">
        {/* Encabezado */}
        <div className="bg-linear-to-r from-purple-600 to-purple-800 text-white p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            📋 TeamTasks
          </h1>
          <p className="text-lg md:text-xl opacity-95 font-light">
            Gestiona las tareas de tu equipo de forma simple y eficientee.
          </p>
        </div>

        {/* Sección de entrada */}
        <div className="bg-gray-50 border-b-2 border-gray-200 p-6 md:p-8">
          <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe una nueva tarea..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all text-base"
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-6 md:px-8 py-3 bg-linear-to-r from-purple-600 to-purple-800 text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all whitespace-nowrap"
            >
              Agregar Tarea
            </button>
          </form>
        </div>

        {/* Sección de tareas */}
        <div className="p-6 md:p-8 min-h-64">
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 opacity-50">📝</div>
              <p className="text-xl text-gray-400 font-medium">
                No hay tareas aún. ¡Crea una para comenzar!
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 hover:translate-x-1 transition-all ${
                    removing === task.id ? 'animate-fadeOut' : 'animate-fadeIn'
                  } ${task.completed ? 'opacity-60' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 cursor-pointer accent-purple-600 rounded"
                  />
                  <span
                    className={`flex-1 text-base transition-all ${
                      task.completed
                        ? 'line-through text-gray-400 italic'
                        : 'text-gray-800'
                    }`}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-3 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm whitespace-nowrap"
                  >
                    ✕ Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contador */}
        <div className="bg-blue-50 text-purple-700 font-bold text-center py-4 px-6 border-t-2 border-gray-200">
          Total de tareas: <span className="text-lg">{totalTasks}</span> | Completadas:{' '}
          <span className="text-lg">{completedTasks}</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
            transform: translateX(20px);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
