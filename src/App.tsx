import {useRef} from 'react';
import {IRefPhaserGame, PhaserGame} from './game/PhaserGame';

function App() {
  // The sprite can only be moved in the MainMenu Scene
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  const setScene = () => {
    // we can listen here for a scene change
  }

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} currentActiveScene={setScene}/>
    </div>
  )
}

export default App
