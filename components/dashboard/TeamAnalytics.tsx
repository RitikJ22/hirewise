"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Candidate } from "@/lib/types";
import { Users, DollarSign, GraduationCap, TrendingUp } from "lucide-react";

interface TeamAnalyticsProps {
  candidates: Candidate[];
}

export default function TeamAnalytics({ candidates }: TeamAnalyticsProps) {
  if (candidates.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <p className="text-muted-foreground">
          Add candidates to see team analytics
        </p>
      </motion.div>
    );
  }

  const avgSalary =
    candidates.reduce((sum, c) => sum + (c.salaryNumeric || 0), 0) /
    candidates.length;
  const avgExperience =
    candidates.reduce((sum, c) => sum + (c.experienceProxy || 0), 0) /
    candidates.length;
  const topSchoolCount = candidates.filter((c) => c.isTopSchool).length;
  const avgMatchScore =
    candidates.reduce((sum, c) => sum + (c.matchScore || 0), 0) /
    candidates.length;

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("us-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const stats = [
    {
      title: "Team Size",
      value: candidates.length,
      icon: Users,
      color: "text-[#454545]",
      bgColor: "bg-[#454545]/10",
    },
    {
      title: "Avg. Salary",
      value: formatSalary(avgSalary),
      icon: DollarSign,
      color: "text-[#454545]",
      bgColor: "bg-[#454545]/10",
    },
    {
      title: "Avg. Experience",
      value: `${avgExperience.toFixed(1)} years`,
      icon: TrendingUp,
      color: "text-[#454545]",
      bgColor: "bg-[#454545]/10",
    },
    {
      title: "Top Schools",
      value: `${topSchoolCount}/${candidates.length}`,
      icon: GraduationCap,
      color: "text-[#454545]",
      bgColor: "bg-[#454545]/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Team Analytics
        </h3>
        <Badge variant="secondary" className="bg-primary/20 text-primary">
          {candidates.length} selected
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-card border-border h-full">
              <CardContent className="p-4 h-full flex items-center">
                <div className="flex items-center space-x-3 w-full">
                  <div
                    className={`p-2.5 rounded-lg ${stat.bgColor} flex-shrink-0`}
                  >
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      {stat.title}
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Average Match Score */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Average Match Score
              </p>
              <p className="text-3xl font-bold text-foreground">
                {avgMatchScore.toFixed(0)}%
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-xl">
                {avgMatchScore.toFixed(0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Distribution */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Top Skills</h4>
        <div className="space-y-3">
          {getTopSkills(candidates)
            .slice(0, 5)
            .map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-muted-foreground truncate flex-1">
                  {skill.name}
                </span>
                <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                  {skill.count}
                </Badge>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}

function getTopSkills(candidates: Candidate[]) {
  const skillCounts: { [key: string]: number } = {};

  candidates.forEach((candidate) => {
    candidate.skills.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

  return Object.entries(skillCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
