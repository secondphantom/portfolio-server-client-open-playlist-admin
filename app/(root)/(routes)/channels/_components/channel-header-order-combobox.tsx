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

const orders = [
  {
    value: "recent",
    label: "Recent",
  },
  {
    value: "old",
    label: "Old",
  },
];

const DEFAULT_ORDER = "recent";
export const ChannelHeaderOrderCombobox: React.FC<Props> = () => {
  const router = useSafeRouter(useRouter);
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(DEFAULT_ORDER);
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (value !== DEFAULT_ORDER) {
      newSearchParams.set("order", value);
    } else {
      newSearchParams.delete("order");
    }

    router.safePush(`/channels?${newSearchParams.toString()}`);
  }, [value]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[110px] justify-between"
        >
          {value
            ? orders.find((order) => order.value === value)?.label
            : "Select order..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[110px] p-0">
        <Command>
          <CommandGroup>
            <CommandList>
              {orders.map((order) => {
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
