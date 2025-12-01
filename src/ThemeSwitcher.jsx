import { useTheme } from './useTheme';

const options = [
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="font-text hidden xl:flex flex-col items-end text-sm fixed bottom-4 right-4">
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`transition-opacity ${
            theme === value ? 'opacity-100' : 'opacity-40 hover:opacity-70'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

