import { useState } from 'react'
import './App.css'
import { ThemeSwitcher } from './ThemeSwitcher'

function getMonthCells(year, month) {
  // getDay() returns 0 for Sunday, 1 for Monday, etc.
  // Shift so Monday = 0, Sunday = 6
  const startDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(startDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);
  return cells;
}

const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Custom kerning for two-digit day numbers
// Neue Haas Grotesk lacks numeric kerning pairs — values tuned by eye
const dayKern = {
  10: -0.015,
  11: -0.01,  // Two narrow 1s — tightest
  12: 0.005,
  13: 0.01,
  14: -0.01,
  15: -0.0025,
  16: -0.015,
  17: -0.025,  // 1+7 both open-sided
  18: -0.01,
  19: -0.0075,
  20: 0.01,
  21: 0.01,
  22: 0.05,
  23: 0.025,
  24: -0.01,
  25: 0.035,
  26: 0.01,
  27: 0.04,
  28: 0.015,
  29: 0.02,
  30: 0.02,
  31: 0.015,
};

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
    <div className='h-screen w-screen flex items-center justify-center dark:bg-black dark:text-white'>
      <div className='font-display p-4 flex flex-col justify-between h-full w-full max-w-6xl'>
        <div className='grid grid-cols-7 tracking-tighter text-5xl'>
          <div className='col-span-3 flex gap-6'>
            <button onClick={prev}>prev</button>
            <button onClick={next}>next</button>
          </div>
          <div className='col-5'>{year}</div>
          <div className='col-span-2'>{monthName}</div>
        </div>
        <div>
          <div className='grid grid-cols-7 text-9xl'>
            {weekdays.map((day, i) => <div key={`h${i}`} className="pl-[2px] border-l border-neutral-200 dark:border-neutral-700 tracking-[-0.09em] leading-[0.775]">{day}</div>)}
            {cells.map((d, i) => (
              <div
                key={i}
                className="pl-[2px] border-l border-neutral-200 dark:border-neutral-700 tracking-[-0.09em] leading-[0.775]"
                style={dayKern[d] ? { letterSpacing: `${-0.09 + dayKern[d]}em` } : undefined}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ThemeSwitcher />
    </div>
  );
}

export default App
