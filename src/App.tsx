import {useRef} from 'react';
import {IRefPhaserGame, PhaserGame} from './game/PhaserGame';

function App() {
  // The sprite can only be moved in the MainMenu Scene
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  const setScene = (scene: Phaser.Scene) => {
    console.log(`Setting active scene ${scene.scene.key}`)
  }

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} currentActiveScene={setScene}/>
    </div>
  )
}

export default App
