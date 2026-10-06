import './App.css'
import Grid from './components/grid/Grid'

function App() {

  return (
    <>
      <header>
        <h1>NeuroLaberint</h1>
      </header>
      <main>
        <Grid/>
      </main>
      <footer>
        <section id='simbols-container'>
          <h2 id='simbols-title'>Simbologia</h2>
          <p className='simbols'><span className="simbols_box base"></span>Casilla base</p>
          <p className='simbols'><span className="simbols_box start"></span>Punto de inicio</p>
          <p className='simbols'><span className="simbols_box end"></span>Punto de final</p>
          <p className='simbols'><span className="simbols_box wall"></span>Muro</p>
          <p className='simbols'><span className="simbols_box path"></span>Camino</p>
        </section>
      </footer>
    </>
  )
}

export default App
