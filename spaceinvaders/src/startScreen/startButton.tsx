import ReactDOM from 'react-dom/client';

const buttonStyle = {
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
}

const StartButton = () => {
    const clickStart = () => {
        document.getElementById('SplashScreen')!.style.display = 'none';
        document.getElementById('GameCanvas')!.style.display = 'block';
    }
    
    return (
        <div>
            <input id="StartButton" type="button" value="Start" style={buttonStyle} onClick={clickStart} />

        </div>
    )
}

const root = ReactDOM.createRoot(
  document.getElementById('startButton') as HTMLElement
);
root.render(
    <StartButton />
);

// export default StartButton