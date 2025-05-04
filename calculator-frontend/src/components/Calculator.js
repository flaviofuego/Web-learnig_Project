import React, { useState } from 'react';
import { calculate } from '../services/api.service';

const Calculator = ({ user }) => {
  const [display, setDisplay] = useState('0');
  const [error, setError] = useState('');
  const [lastResult, setLastResult] = useState(null);

  const handleButtonClick = (value) => {
    setError('');

    switch (value) {
      case 'C':
        // Clear display
        setDisplay('0');
        break;
      case '=':
        // Calculate result
        calculateResult();
        break;
      case 'DEL':
        // Delete last character
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        break;
      default:
        // Add the value to display
        setDisplay(prev => {
          if (prev === '0' && value !== '.') {
            return value;
          } else if (prev.includes('.') && value === '.') {
            // Prevent multiple decimal points
            return prev;
          } else {
            return prev + value;
          }
        });
        break;
    }
  };

  const calculateResult = async () => {
    try {
      const expression = display;
      // Validate expression to prevent injection attacks
      if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
        setError('Invalid expression');
        return;
      }

      // First calculate locally for immediate feedback
      let localResult;
      try {
        // eslint-disable-next-line no-eval
        localResult = eval(expression).toString();
        setDisplay(localResult);
      } catch (e) {
        setError('Invalid expression');
        return;
      }
      
      console.log('Sending calculation to server:', expression);
      
      // Then save to the server
      const response = await calculate(expression);
      console.log('Calculation response:', response);
      
      setLastResult(response);
    } catch (err) {
      console.error('Calculation error:', err);
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // Calculator button layout
  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
    'C', 'DEL'
  ];

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            Calculator
            {user && <span className="float-end text-muted">User: {user.username}</span>}
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            
            {/* Calculator display */}
            <div className="mb-3">
              <input 
                type="text" 
                className="form-control form-control-lg text-end" 
                value={display} 
                readOnly 
              />
            </div>
            
            {/* Calculator buttons */}
            <div className="calculator-buttons">
              <div className="row g-2">
                {buttons.map((btn, index) => (
                  <div key={index} className={`col-${btn === 'C' || btn === 'DEL' ? '6' : '3'}`}>
                    <button 
                      className={`btn btn-${btn === '=' ? 'success' : btn === 'C' || btn === 'DEL' ? 'danger' : /[0-9.]/.test(btn) ? 'light' : 'primary'} w-100`}
                      onClick={() => handleButtonClick(btn)}
                    >
                      {btn}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Last calculation result */}
            {lastResult && (
              <div className="mt-3">
                <h6>Last Calculation:</h6>
                <p>
                  {lastResult.expression} = {lastResult.result}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;