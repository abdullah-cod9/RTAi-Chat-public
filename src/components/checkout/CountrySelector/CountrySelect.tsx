/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Controller } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import { FlagImage } from "react-international-phone";
import ComboBoxResponsive from "@/components/ui/myButtons/ComboBoxResponsive";
import { useTranslations } from "next-intl";

interface CountrySelectProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  className?: string;
}

interface CountriesList {
  name: string;
  code: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  control,
  name,
  label,
  placeholder,
  required = false,
  className,
}) => {
  const t = useTranslations('checkout.countrySelect')
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<CountriesList[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await fetch("/api/supported-countries", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setCountries(
          data.countries.map((country: { title: string; value: string }) => ({
            name: country.title,
            code: country.value,
          })),
        );
      } catch (error) {
        console.error("Failed to load countries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    return countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [countries, searchTerm]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <label
            htmlFor={name}
            className="text-text-secondary mb-2 block text-sm font-medium"
          >
            {label}
          </label>
          <ComboBoxResponsive
            onOpen={setOpen}
            openValue={open}
            side="bottom"
            trigger={
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "font-body w-full items-center justify-between text-sm font-normal shadow-sm",
                  !field.value && "text-text-placeholder",
                )}
                disabled={isLoading}
              >
                <div className="flex items-center">
                  {field.value ? (
                    <>
                      <FlagImage
                        iso2={field.value.toLowerCase()}
                        style={{ width: "1.5em", height: "auto" }}
                        className="mr-2"
                      />
                      {
                        countries.find(
                          (country) => country.code === field.value,
                        )?.name
                      }
                    </>
                  ) : isLoading ? (
                    "Loading..."
                  ) : (
                    placeholder
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            }
          >
            <Command className="min-h-80">
              <CommandInput
                placeholder="Search country..."
                onValueChange={(value) => {
                  setSearchTerm(value);

                  if (value === "") {
                    field.onChange("");
                  }
                }}
              />
              <CommandList>
                <CommandEmpty>{t('commandEmpty')}</CommandEmpty>
                <CommandGroup>
                  {filteredCountries.map((country) => (
                    <CommandItem
                      key={country.code}
                      value={country.code}
                      className="hover:bg-muted"
                      onSelect={() => {
                        field.onChange(country.code);
                        setSearchTerm(""); // Reset search term after selection
                        setOpen(false);
                      }}
                    >
                      <FlagImage
                        iso2={country.code.toLowerCase()}
                        style={{ width: "1.5em", height: "auto" }}
                        className="mr-2"
                      />
                      {country.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          country.code === field.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </ComboBoxResponsive>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};
