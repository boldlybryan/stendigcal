import { useState } from 'react'
import './App.css'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Analytics } from "@vercel/analytics/next"

function getMonthCells(year, month) {
  // getDay() returns 0 for Sunday, 1 for Monday, etc.
  // Shift so Monday = 0, Sunday = 6
  const startDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Build initial cells
  const cells = Array(startDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  
  // If we need a 6th row (more than 35 cells), stack overflow days
  // Stendig style: combine with same weekday from previous week (e.g., "24/31")
  if (cells.length > 35) {
    const overflow = cells.splice(35); // Remove overflow days
    overflow.forEach((day, i) => {
      if (day !== null) {
        const targetIdx = 28 + i; // 5th row starts at index 28
        cells[targetIdx] = [cells[targetIdx], day]; // Stack as array
      }
    });
  }
  
  // Pad to exactly 35 cells (5 rows)
  while (cells.length < 35) cells.push(null);
  return cells;
}

const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Custom kerning for two-digit day numbers
const dayKern = {
  10: -0.015,
  11: -0.01,
  12: 0.005,
  13: 0.01,
  14: -0.01,
  15: -0.0025,
  16: -0.015,
  17: -0.025,
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
            {cells.map((d, i) => {
              const isStacked = Array.isArray(d);
              
              if (isStacked) {
                // Stacked cell: two dates with diagonal divider
                return (
                  <div
                    key={i}
                    className="pl-[2px] border-l border-neutral-200 dark:border-neutral-700 relative leading-[0.775]"
                  >
                    {/* Diagonal line from top-right to bottom-left */}
                    <div className="stacked-divider absolute inset-0 pointer-events-none" />
                    {/* First date - top left */}
                    <span 
                      className="text-[0.475em] tracking-[-0.09em] block pl-1"
                      style={dayKern[d[0]] ? { letterSpacing: `${-0.09 + dayKern[d[0]]}em` } : undefined}
                    >
                      {d[0]}
                    </span>
                    {/* Second date - bottom right */}
                    <span 
                      className="text-[0.475em] tracking-[-0.09em] block text-right pr-4"
                      style={dayKern[d[1]] ? { letterSpacing: `${-0.09 + dayKern[d[1]]}em` } : undefined}
                    >
                      {d[1]}
                    </span>
                  </div>
                );
              }
              
              // Regular single-date cell
              const kern = dayKern[d] ? { letterSpacing: `${-0.09 + dayKern[d]}em` } : undefined;
              return (
                <div
                  key={i}
                  className="pl-[2px] border-l border-neutral-200 dark:border-neutral-700 tracking-[-0.09em] leading-[0.775]"
                  style={kern}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ThemeSwitcher />
      <Analytics />
    </div>
  );
}

export default App
