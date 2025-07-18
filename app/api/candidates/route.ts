import { NextRequest, NextResponse } from 'next/server';
import { Candidate, ApiResponse } from '@/lib/types';
import fs from 'fs';
import path from 'path';

// Helper function to calculate match score
function calculateMatchScore(candidate: Candidate, skillsFilter: string): number {
  let score = 0;
  
  // Skills match (50% weight)
  if (skillsFilter) {
    const requiredSkills = skillsFilter.toLowerCase().split(',').map(s => s.trim());
    const candidateSkills = candidate.skills.map(s => s.toLowerCase());
    const matchedSkills = requiredSkills.filter(skill => 
      candidateSkills.some(candidateSkill => candidateSkill.includes(skill))
    );
    score += (matchedSkills.length / requiredSkills.length) * 50;
  }
  
  // Experience score (25% weight)
  const experienceScore = Math.min(candidate.experienceProxy || 0, 10) / 10 * 25;
  score += experienceScore;
  
  // Education score (15% weight)
  if (candidate.isTopSchool) {
    score += 15;
  }
  
  // Salary competitiveness (10% weight)
  const avgSalary = 80000; // Example average salary
  const salaryDiff = Math.abs((candidate.salaryNumeric || 0) - avgSalary);
  const salaryScore = Math.max(0, 10 - (salaryDiff / avgSalary) * 10);
  score += salaryScore;
  
  return Math.round(score);
}

// Helper function to parse salary
function parseSalary(salaryObj: { [key: string]: string }): number {
  // Try to get the full-time salary first, then fall back to any available salary
  const salaryStr = salaryObj['full-time'] || Object.values(salaryObj)[0] || '';
  const match = salaryStr.match(/[\d,]+/);
  if (match) {
    return parseInt(match[0].replace(/,/g, ''), 10);
  }
  return 0;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const skills = searchParams.get('skills') || '';
    const minExp = parseInt(searchParams.get('minExp') || '0', 10);
    const maxExp = parseInt(searchParams.get('maxExp') || '20', 10);
    const minSalary = parseInt(searchParams.get('minSalary') || '0', 10);
    const maxSalary = parseInt(searchParams.get('maxSalary') || '500000', 10);
    const topSchool = searchParams.get('topSchool') === 'true';
    const sortBy = searchParams.get('sortBy') || 'matchScore';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    // Read and parse the JSON data
    const dataPath = path.join(process.cwd(), 'public', 'form-submissions.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const candidates: Candidate[] = JSON.parse(rawData);
    
    // Process candidates and add computed properties
    const processedCandidates = candidates.map(candidate => {
      const experienceProxy = candidate.work_experiences.length;
      const salaryNumeric = parseSalary(candidate.annual_salary_expectation);
      const isTopSchool = candidate.education.degrees.some(
        degree => degree.isTop50 || degree.isTop25
      );
      const matchScore = calculateMatchScore(candidate, skills);
      
      return {
        ...candidate,
        experienceProxy,
        salaryNumeric,
        isTopSchool,
        matchScore,
      };
    });
    
    // Apply filters
    const filteredCandidates = processedCandidates.filter(candidate => {
      // Experience filter
      if (candidate.experienceProxy < minExp || candidate.experienceProxy > maxExp) {
        return false;
      }
      
      // Salary filter
      if (candidate.salaryNumeric < minSalary || candidate.salaryNumeric > maxSalary) {
        return false;
      }
      
      // Top school filter
      if (topSchool && !candidate.isTopSchool) {
        return false;
      }
      
      // Skills filter
      if (skills) {
        const requiredSkills = skills.toLowerCase().split(',').map(s => s.trim());
        const candidateSkills = candidate.skills.map(s => s.toLowerCase());
        const hasRequiredSkills = requiredSkills.some(skill =>
          candidateSkills.some(candidateSkill => candidateSkill.includes(skill))
        );
        if (!hasRequiredSkills) {
          return false;
        }
      }
      
      return true;
    });
    
    // Apply sorting
    filteredCandidates.sort((a, b) => {
      switch (sortBy) {
        case 'matchScore':
          return (b.matchScore || 0) - (a.matchScore || 0);
        case 'date':
          return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
        case 'experience':
          return (b.experienceProxy || 0) - (a.experienceProxy || 0);
        case 'salary':
          return (b.salaryNumeric || 0) - (a.salaryNumeric || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredCandidates.length;
    
    const response: ApiResponse = {
      candidates: paginatedCandidates,
      hasMore,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
} 