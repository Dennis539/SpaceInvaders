import ReactDOM from 'react-dom/client';

const buttonStyle = {
    backgroundColor: 'blue', // Background color of the button
    color: 'white',          // Text color of the button
    padding: '10px 20px',    // Padding inside the button
    border: 'none',          // No border for the button
    borderRadius: '5px',     // Rounded corners of the button
    cursor: 'pointer',       // Cursor changes to pointer on hover
    fontSize: '16px'         // Font size of the text
};

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