import { useEffect, useRef, useState } from "react";
import { CarColor } from "~/types/CarColor";

export interface ColorPickerProps {
    colors: CarColor[],
    handleColorChange: Function,
    initialColor?: CarColor,
};

interface SearchableSelectProps {
    label: string;
    options: string[];
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
}

function SearchableSelect({ label, options, value, placeholder, onChange }: SearchableSelectProps) {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const filtered = search
        ? options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
        : options;

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="flex flex-col gap-1.5 relative">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
            <input
                type="text"
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent"
                placeholder={placeholder}
                value={isOpen ? search : value || ""}
                onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
                onFocus={() => { setIsOpen(true); setSearch(""); }}
            />
            {isOpen && (
                <ul className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {filtered.length === 0 && (
                        <li className="px-3 py-2 text-sm text-gray-400">No results</li>
                    )}
                    {filtered.map((option) => (
                        <li
                            key={option}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-fuchsia-50 hover:text-fuchsia-600 ${option === value ? 'bg-fuchsia-50 text-fuchsia-600' : 'text-gray-900'}`}
                            onMouseDown={() => { onChange(option); setIsOpen(false); setSearch(""); }}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const ColorPicker = ({ colors, handleColorChange, initialColor }: ColorPickerProps) => {
    // Keeps track of the selected manufacturer
    const [selectedManufacturer, setSelectedManufacturer] = useState<string>(initialColor?.MAKE || "");

    // List of manufacturers to display
    const manufacturers = [...new Set(colors.map(c => c.MAKE))];

    // List of available colors to display
    const [colorNameOptions, setColorNameOptions] = useState<CarColor[]>(
        initialColor ? colors.filter(c => c.MAKE === initialColor.MAKE) : []
    );

    // Keeps track of the selected color
    const [selectedColorName, setSelectedColorName] = useState<string>(initialColor?.COLOUR_NAME || "");

    // Update the color options when a manufacturer is selected
    useEffect(() => {
        const nextColorOptions: CarColor[] = colors.filter(color => color.MAKE === selectedManufacturer);

        setColorNameOptions(nextColorOptions);

        // Update the selected color to the first in the list when the options
        if (nextColorOptions.length && nextColorOptions[0]["COLOUR_NAME"]) {
            setSelectedColorName(nextColorOptions[0]["COLOUR_NAME"]);
        }
    }, [selectedManufacturer])

    // Notify parent component of selected color change
    useEffect(() => {
        if (handleColorChange) {
            const color: CarColor = colors.find(color => color.MAKE === selectedManufacturer && color["COLOUR_NAME"] === selectedColorName)!;
            handleColorChange(color);
        }
    }, [selectedColorName]);

    return (
        <div className="flex flex-col gap-4">
            <SearchableSelect
                label="Manufacturer"
                options={manufacturers}
                value={selectedManufacturer}
                placeholder="Search manufacturers..."
                onChange={setSelectedManufacturer}
            />
            <SearchableSelect
                label="Color"
                options={colorNameOptions.map(c => c["COLOUR_NAME"])}
                value={selectedColorName}
                placeholder="Search colors..."
                onChange={setSelectedColorName}
            />
        </div>
    );
};

export default ColorPicker