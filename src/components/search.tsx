"use client";

import React, { type ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "~/components/ui/label";

interface Item {
  id: number;
  name: string;
}

interface ComponentProps<TData extends Item> {
  data: TData[];
  label: string;
  setSelected: (value: Item) => void;
}

export default function SearchDropdown<TData extends Item>({
  data,
  label,
  setSelected,
}: ComponentProps<TData>) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (search.length >= 2) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [data, search]);

  const handleSelect = (item: Item) => {
    setSelected(item);
    setSearch(item.name);
    setResults([]);
  };

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="grid w-full grid-cols-4 items-center gap-4">
        <Label htmlFor={"id"} className="text-right">
          {label}
        </Label>
        <Input
          placeholder="Suche..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          className="col-span-3"
        />
      </div>

      {results.length > 0 && isFocused && (
        <ul className="absolute z-10 mt-1 w-full rounded-lg border shadow">
          {results.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className="hover:bg-secondary cursor-pointer px-4 py-2"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
