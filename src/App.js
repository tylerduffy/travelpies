import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import Canvas from './Components/Canvas';

function App() {
    return (
        <div className='App'>
            <Canvas
                width={700}
                height={500}
            />
        </div>
    );
}

export default App;