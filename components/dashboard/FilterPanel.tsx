"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/lib/store";
import { Toast } from "@/lib/toast";

export const FilterPanel = () => {
  const { filters, setFilters } = useAppStore();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | number | boolean
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    setFilters(localFilters);

    // Show toast with filter summary
    const activeFilters = [];
    if (localFilters.skills)
      activeFilters.push(`Skills: ${localFilters.skills}`);
    if (localFilters.minExp > 0 || localFilters.maxExp < 20) {
      activeFilters.push(
        `Experience: ${localFilters.minExp}-${localFilters.maxExp} years`
      );
    }
    if (localFilters.minSalary > 0 || localFilters.maxSalary < 500000) {
      activeFilters.push(
        `Salary: $${localFilters.minSalary.toLocaleString()}-$${localFilters.maxSalary.toLocaleString()}`
      );
    }
    if (localFilters.topSchool) activeFilters.push("Top schools only");

    const filterCount = activeFilters.length;
    if (filterCount > 0) {
      Toast.success(
        "Filters applied",
        `${filterCount} filter${
          filterCount > 1 ? "s" : ""
        } applied: ${activeFilters.slice(0, 2).join(", ")}${
          filterCount > 2 ? "..." : ""
        }`
      );
    } else {
      Toast.info(
        "All filters cleared",
        "Showing all candidates without filters."
      );
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      skills: "",
      minExp: 0,
      maxExp: 20,
      minSalary: 0,
      maxSalary: 500000,
      topSchool: false,
      sortBy: "matchScore",
      page: 1,
      limit: 20,
    };
    setLocalFilters(defaultFilters);
    setFilters(defaultFilters);
    Toast.success(
      "Filters reset",
      "All filters have been reset to default values."
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        {/* Skills Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Skills</label>
          <Input
            placeholder="e.g., React, Python, AWS"
            value={localFilters.skills}
            onChange={(e) => handleFilterChange("skills", e.target.value)}
            className="bg-background border-border"
          />
        </div>

        {/* Experience Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Experience (years): {localFilters.minExp} - {localFilters.maxExp}
          </label>
          <Slider
            value={[localFilters.minExp, localFilters.maxExp]}
            onValueChange={(value) => {
              handleFilterChange("minExp", value[0]);
              handleFilterChange("maxExp", value[1]);
            }}
            max={20}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Salary Range: ${localFilters.minSalary.toLocaleString()} - $
            {localFilters.maxSalary.toLocaleString()}
          </label>
          <Slider
            value={[localFilters.minSalary, localFilters.maxSalary]}
            onValueChange={(value) => {
              handleFilterChange("minSalary", value[0]);
              handleFilterChange("maxSalary", value[1]);
            }}
            max={500000}
            min={0}
            step={10000}
            className="w-full"
          />
        </div>

        {/* Top School Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Education
          </label>
          <Select
            value={localFilters.topSchool ? "true" : "false"}
            onValueChange={(value) =>
              handleFilterChange("topSchool", value === "true")
            }
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">All Schools</SelectItem>
              <SelectItem value="true">Top 50 Schools Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Sort By</label>
          <Select
            value={localFilters.sortBy}
            onValueChange={(value) => handleFilterChange("sortBy", value)}
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="matchScore">Match Score</SelectItem>
              <SelectItem value="date">Date Applied</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={applyFilters}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Apply Filters
      </Button>
    </motion.div>
  );
};
