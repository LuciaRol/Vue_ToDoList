const { createApp } = Vue;

        createApp({
            data() {
                return {
                    nuevaNota: "",
                    notas: [],
                    textoFiltrado: "",
                    filtrarNotas: false,
                    notasEditada: null,
                };
            },

            mounted() {
                this.cargarNotas();
            },

            methods: {
                guardaAtributosNota() {
                    if (this.nuevaNota.trim() !== "") {
                        if (this.notasEditada !== null) {
                            // Edita nota ya existente
                            const index = this.notas.findIndex(nota => nota.id === this.notasEditada);
                            if (index !== -1) {
                                this.notas[index].texto = this.nuevaNota;
                                this.notasEditada = null;
                            }
                        } else {
                            // Agrega nueva nota
                            this.notas.push({
                                id: Date.now(), 
                                texto: this.nuevaNota,
                                prioridad: "normal",
                                fecha: Date.now(),
                                completada: false,
                            });
                        }
                        this.nuevaNota = "";
                        this.ordenarPorPrioridad(); 
                    }
                },

                editarNota(id) {
                    this.notasEditada = id;
                    const notaEditada = this.notas.find(nota => nota.id === id);
                    if (notaEditada) {
                        this.nuevaNota = notaEditada.texto;
                    }
                },

                borrarNota(id) {
                    this.notas = this.notas.filter(nota => nota.id !== id);
                    this.ordenarPorPrioridad(); 
                },

                eliminarcompletadas() {
                    this.notas = this.notas.filter(nota => !nota.completada);
                    this.ordenarByPriority(); 
                },

                ordenarPorPrioridad(notas) {
                    this.notas.sort((a, b) => {
                        const prioridades = { alta: 0, normal: 1, baja: 2 };
                        return prioridades[a.prioridad] - prioridades[b.prioridad];
                    });
                    this.guardarNotas();
                },

                guardarNotas() {
                    localStorage.setItem('notas', JSON.stringify(this.notas));
                },

                cargarNotas() {
                    const notasAlmacenadas = localStorage.getItem("notas");
                    if (notasAlmacenadas) {
                        this.notas = JSON.parse(notasAlmacenadas);
                    }
                }
            },

            computed: {
                notasFiltradas() {
                    if (this.filtrarNotas) {
                        return this.notas.filter(nota => nota.texto.includes(this.textoFiltrado));
                    } else {
                        return this.notas;
                    }
                },

                mensajeTotalTareas() {
                    const tareasTotales = this.notas.length;
                    const tareasPendientes = this.notas.filter(nota => !nota.completada).length;
                    
                    if (tareasTotales) {
                        return `Tienes ${tareasPendientes} tareas pendientes de un total de ${tareasTotales}`;
                    } else {
                        return "No hay tareas pendientes";
                    }
                },

                notasOrdenadas() {
                    return [...this.notasFiltradas].sort((a, b) => {
                        const prioridades = { alta: 0, normal: 1, baja: 2 };
                        return prioridades[a.prioridad] - prioridades[b.prioridad];
                    });
                },
            }
        }).mount("#app");