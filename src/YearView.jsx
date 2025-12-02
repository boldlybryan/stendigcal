const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const monthLetters = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

// Generate year data: for each month, get starting weekday offset and days count
function getYearData(year) {
  const months = [];
  for (let m = 0; m < 12; m++) {
    // Monday = 0, Sunday = 6
    const startDay = (new Date(year, m, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    months.push({ startDay, daysInMonth });
  }
  return months;
}

export function YearView({ year, onYearChange, onMonthSelect }) {
  const yearData = getYearData(year);
  
  // Maximum rows needed: up to 6 (offset) + 31 (days) = 37 rows
  const maxRows = 37;
  
  // Build the grid data: for each month column, determine which day appears in each row
  const getMonthColumn = (monthIndex) => {
    const { startDay, daysInMonth } = yearData[monthIndex];
    const column = [];
    
    for (let row = 0; row < maxRows; row++) {
      if (row < startDay) {
        column.push(null);
      } else {
        const day = row - startDay + 1;
        if (day <= daysInMonth) {
          const weekdayIndex = row % 7;
          column.push({ day, isMonday: weekdayIndex === 0 });
        } else {
          column.push(null);
        }
      }
    }
    
    return column;
  };

  // Base cell styles
  const cellBase = "px-2 sm:py-1 text-6xl leading-[0.75] border-l border-neutral-200 dark:border-neutral-700 tracking-tight";
  const cellHeader = "font-semibold pb-2";
  const cellMonth = "text-center";
  const cellWeekday = "pr-2 sm:pr-2.5 !border-l-0";
  const cellDay = "";
  const cellMonday = "text-[#00A0E4]";
  const cellClickable = "cursor-pointer hover:opacity-70 transition-opacity";

  return (
    <div className="w-full max-w-7xl flex flex-col py-4">
      {/* Dark header bar */}
      <div className="flex justify-between items-start shrink-0 mb-20">
        <div className="flex gap-2 sm:gap-6 text-[clamp(1.25rem,4.3vw,3rem)] tracking-tighter font-display">
          <button onClick={() => onYearChange(year - 1)}>prev</button>
          <button onClick={() => onYearChange(year + 1)}>next</button>
        </div>
        <div className="px-2">
          <div className="text-[96px] font-display tracking-[-0.05em] leading-[0.9]">{year}</div>
        </div>
      </div>
      
      {/* Calendar grid - scrollable container */}
      <div className="flex-1">
        <div className="flex flex-col font-display">
          {/* Month header row */}
          <div className="grid grid-cols-[6rem_repeat(12,1fr)]">
            <div className={`${cellBase} ${cellHeader} !border-l-0`}></div>
            {monthLetters.map((letter, i) => (
              <div 
                key={`month-${i}`}
                onClick={() => onMonthSelect(i)}
                className={`${cellBase} ${cellHeader} ${cellMonth} ${cellClickable} ${i === 11 ? 'border-r' : ''}`}
              >
                {letter}
              </div>
            ))}
          </div>
          
          {/* Day rows */}
          {Array.from({ length: maxRows }).map((_, rowIndex) => {
            const weekdayIndex = rowIndex % 7;
            const weekdayLetter = weekdays[weekdayIndex];
            const isMonday = weekdayIndex === 0;
            
            return (
              <div key={`row-${rowIndex}`} className="grid grid-cols-[6rem_repeat(12,1fr)]">
                {/* Weekday label column */}
                <div className={`${cellBase} ${cellWeekday} ${isMonday ? cellMonday : ''} ${rowIndex === 0 ? '!pt-40' : ''}`}>
                  {weekdayLetter}
                </div>
                
                {/* Month columns */}
                {Array.from({ length: 12 }).map((_, monthIndex) => {
                  const column = getMonthColumn(monthIndex);
                  const cellData = column[rowIndex];
                  
                  return (
                    <div 
                      key={`cell-${monthIndex}-${rowIndex}`}
                      onClick={() => onMonthSelect(monthIndex)}
                      className={`${cellBase} ${cellDay} ${cellClickable} ${cellData?.isMonday ? cellMonday : ''} ${rowIndex === 0 ? '!pt-40' : ''} ${monthIndex === 11 ? 'border-r' : ''}`}
                    >
                      {cellData?.day || ''}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
