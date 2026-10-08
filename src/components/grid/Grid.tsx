import { useState } from 'react';
import './grid.css';
import { STATE_MAP, findPathBFS, findPathDFS, resetGrid, type GridMatrix } from './Utils';

// Crea una matriz cuadrada de tamaño `size` inicializada con el valor 1 (base, consultar STATE_MAP en Utils.tsx)
const createMatrix = (size: number): GridMatrix => {
  const validSize = size > 0 ? size : 1;
  return Array.from({ length: validSize }, () => Array(validSize).fill(1));
};

export default function Grid() {
  const [size, setSize] = useState<number>(4);
  const [inputValue, setInputValue] = useState<string>('');
  const [gridState, setGridState] = useState<GridMatrix>(() => createMatrix(4));

  // Maneja el cambio de tamaño del grid y actualiza el estado solo si es un número positivo
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    // Validar y actualizar el tamaño del grid solo si es un número positivo
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setSize(parsed);
      setGridState(createMatrix(parsed));
    }
  };
  // Cambia el estado de la casilla entre los valores 1 a 4 al hacer clic (consultar STATE_MAP en Utils.tsx)
  const changeState = (y: number, x: number) => {
    setGridState((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);
      const currentState = newGrid[y][x];
      const nextState = currentState >= 4 ? 1 : currentState + 1;
      newGrid[y][x] = nextState;
      return newGrid;
    });
  };
  // Resuelve el camino más corto y actualiza el estado del grid si se encuentra una ruta válida
  const handleSolveBFS = () => {
    const solvedGrid = findPathBFS(gridState);
    if (solvedGrid) setGridState(solvedGrid);
  };

  const handleSolveDFS = () => {
    const solvedGrid = findPathDFS(gridState);
    if (solvedGrid) setGridState(solvedGrid);
  };

  return (
    <div id="grid-wrapper">
      <section
        id="grid-container"
        style={{ '--grid-size': gridState.length } as React.CSSProperties}
      >
        {gridState.flatMap((row, y) =>
          row.map((stateValue, x) => (
            <div
              key={`${y}-${x}`}
              onClick={() => changeState(y, x)}
              className={`box ${STATE_MAP[stateValue]}`}
            />
          ))
        )}
      </section>

      <section id="controls">
        <input
          type="number"
          id="size"
          min="2"
          max="30"
          placeholder={size.toString()}
          value={inputValue}
          onChange={handleSizeChange}
        />
        <button onClick={handleSolveBFS}>Encontrar BFS</button>
        <button onClick={handleSolveDFS}>Encontrar DFS</button>
        <button onClick={() => setGridState(resetGrid(gridState))}>Reiniciar Grid</button>
      </section>
    </div>
  );
}