import { useState } from 'react'
import './App.css'

function getMonthCells(year, month) {
  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(startDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);
  return cells;
}

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function App() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const cells = getMonthCells(year, month);
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  const prev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const next = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div>
      <div>{monthName} {year}</div>
      <button onClick={prev}>prev</button>
      <button onClick={next}>next</button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {weekdays.map((day, i) => <div key={`h${i}`}>{day}</div>)}
        {cells.map((d, i) => <div key={i}>{d}</div>)}
      </div>
    </div>
  );
}

export default App
