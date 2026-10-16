import { DayPicker } from "react-day-picker";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import { ru } from "date-fns/locale";
import { useState, useRef, useEffect } from "react";
import { COLOR } from "../config/theme";

interface Props {
  value: Date;
  onChange: (date: Date) => void;
}

export function DashboardDayPicker({ value, onChange }: Props) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles } = useFloating({
    open: isPickerOpen,
    onOpenChange: setIsPickerOpen,
    placement: "bottom-start",
    middleware: [
      offset(6), // отступ от кнопки
      flip(), // перевернуть наверх, если снизу не помещается
      shift({ padding: 8 }), // сдвинуть по горизонтали, если вылезает за край экрана
    ],
    whileElementsMounted: autoUpdate, // пересчитывать позицию при скролле/ресайзе
  });

  useEffect(() => {
    if (isPickerOpen) setDisplayMonth(value);
  }, [isPickerOpen, value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      )
        setIsPickerOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(date: Date | undefined) {
    if (date) {
      onChange(date);
      setIsPickerOpen(false);
    }
  }

  return (
    <div ref={pickerRef}>
      <button ref={refs.setReference} onClick={() => setIsPickerOpen(true)} style={styles.trigger}>
        {value.toLocaleDateString("ru-RU")}
      </button>

      {isPickerOpen && (
        <div ref={refs.setFloating} style={{ ...floatingStyles, zIndex: 10 }}>
          <DayPicker
            mode="single"
            selected={value}
            onSelect={handleSelect}
            month={displayMonth}
            onMonthChange={setDisplayMonth}
            locale={ru}
          />
        </div>
      )}
    </div>
  );
}


const styles = {
  trigger: {
    background: COLOR.periodControl,
    border: `1px solid ${COLOR.border}`,
    color: COLOR.text,
    borderRadius: 8,
    padding: "8px 13px",
    fontFamily: "inherit",
    fontSize: 16,
    cursor: "pointer",
  },
} as const;