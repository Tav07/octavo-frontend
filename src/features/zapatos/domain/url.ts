// La URL es la fuente de verdad del catálogo: página, filtro de marca
// y texto de búsqueda viven en la query (?page=&marcaId=&q=).
// Un único punto arma la URL para que paginación, chips y buscador
// escriban siempre el mismo formato.

export interface ParametrosCatalogo {
  page?: number;
  marcaId?: number;
  q?: string;
}

export function urlCatalogo(parametros: ParametrosCatalogo): string {
  const consulta = new URLSearchParams();
  if (parametros.page !== undefined && parametros.page > 1) {
    consulta.set("page", String(parametros.page));
  }
  if (parametros.marcaId !== undefined) {
    consulta.set("marcaId", String(parametros.marcaId));
  }
  if (parametros.q !== undefined && parametros.q !== "") {
    consulta.set("q", parametros.q);
  }
  const cadena = consulta.toString();
  return cadena === "" ? "/catalogo" : `/catalogo?${cadena}`;
}

// El parámetro que llega de URLSearchParams() es string | null (o
// string[] en edge cases): solo se considera válido un string numérico.
export function numeroDeParametro(valor: string | null): number | undefined {
  if (valor === null || valor === "") return undefined;
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : undefined;
}