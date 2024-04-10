"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useSafeRouter } from "@/hooks/use-safe-router";
import { Button } from "@/components/ui/button";

type Props = {};

const versions = [
  {
    value: "1",
    label: "1",
  },
];

const DEFAULT_VERSION = "1";
export const HealthHeaderVersionCombobox: React.FC<Props> = () => {
  const router = useSafeRouter(useRouter);
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(DEFAULT_VERSION);
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (value !== DEFAULT_VERSION) {
      newSearchParams.set("version", value);
    } else {
      newSearchParams.delete("version");
    }

    router.safePush(`/healths?${newSearchParams.toString()}`);
  }, [value]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[110px] justify-between h-8"
        >
          {value
            ? versions.find((order) => order.value === value)?.label
            : "Select order..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[110px] p-0">
        <Command>
          <CommandGroup>
            <CommandList>
              {versions.map((order) => {
                return (
                  <CommandItem
                    key={order.value}
                    value={order.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === order.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {order.label}
                  </CommandItem>
                );
              })}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
