// Tipos del catálogo. Espejan la respuesta de la API
// (el backend es la fuente de verdad; aquí no hay datos locales).

export interface ReferenciaMarca {
  id: number;
  nombre: string;
}

export interface Zapato {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  talla: number;
  tallas: number[];
  descripcion: string;
  // Ruta pública de la imagen: /images/archivo.jpg
  imagen: string;
  marcaId: number;
  marca: ReferenciaMarca;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Formato de GET /api/zapatos?page=&limit=
export interface RespuestaCatalogo {
  pagination: Pagination;
  data: Zapato[];
}

export interface Marca {
  id: number;
  nombre: string;
  descripcion: string;
  pais: string;
}