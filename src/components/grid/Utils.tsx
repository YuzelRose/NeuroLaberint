// Estados posibles de cada casilla del grid
export const STATE_MAP: Record<number, string> = {
  1: "base",
  2: "start",
  3: "end",
  4: "wall",
  5: "path",
};
// Tipado de la matriz del grid, donde cada número representa un estado según STATE_MAP en un aposicion específica (y, x)
export type GridMatrix = number[][];

interface Point {
  x: number;
  y: number;
}

// Valida que haya exactamente un punto de inicio (STATE_MAP: 2) y un punto final (STATE_MAP: 3) en la matriz del grid.
export function validateAndGetPoints(grid: GridMatrix): { start: Point; end: Point } | null {
  const size = grid.length;
  let start: Point | null = null;
  let end: Point | null = null;
  let startCount = 0;
  let endCount = 0;
  // Recorre la matriz para contar y localizar los puntos de inicio y fin
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (grid[y][x] === 2) {
        startCount++;
        start = { x, y };
      } else if (grid[y][x] === 3) {
        endCount++;
        end = { x, y };
      }
    }
  }
  // Validación: debe haber exactamente un inicio y un fin
  if (!start || !end) {
    alert("Falta inicio o fin.");
    return null;
  }
  // Validación: no debe haber duplicados de inicio o fin
  if (startCount !== 1 || endCount !== 1 ) {
        alert("Inicio o fin duplicados.");
        return null;    
    }
  // Retorna los puntos de inicio y fin si la validación es exitosa
  return { start, end };
}

// Algoritmo BFS para encontrar el camino mas corto ente el punto de inicio (STATE_MAP: 2) y un punto final (STATE_MAP: 3)
export function findPath(grid: GridMatrix): GridMatrix | null {
  const points = validateAndGetPoints(grid);
  // Faltan inicio/fin o duplicados
  if (!points) return null;

  const { start, end } = points;
  const size = grid.length;

  // Matriz para rastrear celdas visitadas
  const visited: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  
  // Matriz para reconstruir el camino: guarda el padre de cada celda { parentY, parentX }
  const parent: (Point | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));

  // Cola para BFS
  const queue: Point[] = [start];
  visited[start.y][start.x] = true;

  // Direcciones ortogonales:
  const directions = [
    { x: 0, y: -1 }, // Arriba
    { x: 0, y: 1 },  // Abajo
    { x: -1, y: 0 }, // Izquierda
    { x: 1, y: 0 },  // Derecha
  ];

  let pathFound = false;

  while (queue.length > 0) {
    const current = queue.shift()!;

    // Si llegamos a la meta, terminamos el recorrido
    if (current.x === end.x && current.y === end.y) {
      pathFound = true;
      break;
    }

    for (const dir of directions) {
      const nextX = current.x + dir.x;
      const nextY = current.y + dir.y;

      // Validar límites del mapa
      if (nextX >= 0 && nextX < size && nextY >= 0 && nextY < size) {
        // No visitar paredes (4) ni nodos ya procesados
        if (!visited[nextY][nextX] && grid[nextY][nextX] !== 4) {
          visited[nextY][nextX] = true;
          parent[nextY][nextX] = current;
          queue.push({ x: nextX, y: nextY });
        }
      }
    }
  }

  // Si recorrió todas las posiciones posibles sin llegar al fin
  if (!pathFound) {
    alert("No se encontró solución. Asegúrate de tener una ruta libre.");
    return null;
  }

  // Crear una nueva copia profunda de la matriz para actualizar el estado
  const newGrid: GridMatrix = grid.map((row) => [...row]);

  // Reconstruir el camino desde el Fin hasta el Inicio usando los padres
  let curr: Point | null = parent[end.y][end.x];

  while (curr && !(curr.x === start.x && curr.y === start.y)) {
    newGrid[curr.y][curr.x] = 5; // Cambiar el estado a 5 (path)
    curr = parent[curr.y][curr.x];
  }

  return newGrid;
}

// Resetea la cuadrícula al estado base (1) manteniendo la dimensión actual
export function resetGrid(grid: GridMatrix): GridMatrix {
  return grid.map((row) => row.map(() => 1));
}