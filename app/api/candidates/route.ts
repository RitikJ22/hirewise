import { NextRequest, NextResponse } from 'next/server';
import { Candidate, ApiResponse } from '@/lib/types';
import fs from 'fs';
import path from 'path';

// Helper function to calculate match score based on applied filters
function calculateMatchScore(
  candidate: Candidate, 
  filters: {
    skills: string;
    workAvailability: string[];
    location: string;
    roleName: string;
    company: string;
    educationLevel: string;
    degreeSubject: string;
  }
): number {
  let totalScore = 0;
  let totalWeight = 0;
  
  // Skills match (30% weight)
  if (filters.skills) {
    const requiredSkills = filters.skills.toLowerCase().split(',').map(s => s.trim());
    const candidateSkills = candidate.skills?.map(s => s.toLowerCase()) || [];
    const matchedSkills = requiredSkills.filter(skill => 
      candidateSkills.some(candidateSkill => candidateSkill.includes(skill))
    );
    const skillsScore = (matchedSkills.length / requiredSkills.length) * 30;
    totalScore += skillsScore;
    totalWeight += 30;
  }
  
  // Work availability match (20% weight)
  if (filters.workAvailability.length > 0) {
    const hasMatchingAvailability = filters.workAvailability.some(availability =>
      candidate.work_availability?.includes(availability)
    );
    if (hasMatchingAvailability) {
      totalScore += 20;
    }
    totalWeight += 20;
  }
  
  // Location match (15% weight)
  if (filters.location) {
    const locationMatch = candidate.location?.toLowerCase().includes(filters.location.toLowerCase());
    if (locationMatch) {
      totalScore += 15;
    }
    totalWeight += 15;
  }
  
  // Role name match (15% weight)
  if (filters.roleName) {
    const hasMatchingRole = candidate.work_experiences?.some(exp =>
      exp.roleName?.toLowerCase().includes(filters.roleName.toLowerCase())
    );
    if (hasMatchingRole) {
      totalScore += 15;
    }
    totalWeight += 15;
  }
  
  // Company match (10% weight)
  if (filters.company) {
    const hasMatchingCompany = candidate.work_experiences?.some(exp =>
      exp.company?.toLowerCase().includes(filters.company.toLowerCase())
    );
    if (hasMatchingCompany) {
      totalScore += 10;
    }
    totalWeight += 10;
  }
  
  // Education level match (5% weight)
  if (filters.educationLevel && filters.educationLevel !== 'all') {
    if (candidate.education?.highest_level === filters.educationLevel) {
      totalScore += 5;
    }
    totalWeight += 5;
  }
  
  // Degree subject match (5% weight)
  if (filters.degreeSubject) {
    const hasMatchingDegree = candidate.education?.degrees?.some(degree =>
      degree.subject?.toLowerCase().includes(filters.degreeSubject.toLowerCase())
    );
    if (hasMatchingDegree) {
      totalScore += 5;
    }
    totalWeight += 5;
  }
  
  // If no filters are applied, return 0
  if (totalWeight === 0) {
    return 0;
  }
  
  // Calculate percentage based on applied filters
  return Math.round((totalScore / totalWeight) * 100);
}

// Helper function to parse salary
function parseSalary(salaryObj: { [key: string]: string } | null | undefined): number {
  try {
    // Handle null/undefined cases
    if (!salaryObj || typeof salaryObj !== 'object') {
      return 0;
    }
    
    // Try to get the full-time salary first, then fall back to any available salary
    const salaryStr = salaryObj['full-time'] || Object.values(salaryObj)[0] || '';
    
    // Handle cases where salaryStr might be undefined or not a string
    if (!salaryStr || typeof salaryStr !== 'string') {
      return 0;
    }
    
    const match = salaryStr.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''), 10);
    }
    return 0;
  } catch (error) {
    console.error('Error parsing salary:', error, salaryObj);
    return 0;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const skills = searchParams.get('skills') || '';
    const workAvailabilityParam = searchParams.get('workAvailability') || '';
    const workAvailability = workAvailabilityParam ? workAvailabilityParam.split(',') : [];
    const minSalary = parseInt(searchParams.get('minSalary') || '45000', 10);
    const maxSalary = parseInt(searchParams.get('maxSalary') || '150000', 10);
    const location = searchParams.get('location') || '';
    const roleName = searchParams.get('roleName') || '';
    const company = searchParams.get('company') || '';
    const educationLevel = searchParams.get('educationLevel') || '';
    const degreeSubject = searchParams.get('degreeSubject') || '';
    const sortBy = searchParams.get('sortBy') || 'matchScore';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    // Read and parse the JSON data
    const dataPath = path.join(process.cwd(), 'public', 'form-submissions.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const candidates: Candidate[] = JSON.parse(rawData);
    
    // Check if any filters are applied (excluding default salary range)
    const hasFilters = skills || workAvailability.length > 0 || 
                      location || roleName || company || 
                      (educationLevel && educationLevel !== 'all') || degreeSubject;
    
    // Process candidates and add computed properties
    const processedCandidates = candidates.map(candidate => {
      try {
        const experienceProxy = candidate.work_experiences?.length || 0;
        const salaryNumeric = parseSalary(candidate.annual_salary_expectation);
        const isTopSchool = candidate.education?.degrees?.some(
          degree => degree.isTop50 || degree.isTop25
        ) || false;
        
        // Calculate match score based on all applied filters
        const appliedFilters = {
          skills,
          workAvailability,
          location,
          roleName,
          company,
          educationLevel,
          degreeSubject,
        };
        const matchScore = hasFilters ? calculateMatchScore(candidate, appliedFilters) : undefined;
        
        return {
          ...candidate,
          experienceProxy,
          salaryNumeric,
          isTopSchool,
          matchScore,
        };
      } catch (error) {
        console.error('Error processing candidate:', error, candidate);
        // Return a safe fallback candidate
        return {
          ...candidate,
          experienceProxy: 0,
          salaryNumeric: 0,
          isTopSchool: false,
          matchScore: undefined,
        };
      }
    });
    
        // Always apply salary filtering, then apply other filters if any are set
    let filteredCandidates = processedCandidates.filter(candidate => {
      try {
        // Always apply salary filter
        if (candidate.salaryNumeric < minSalary || candidate.salaryNumeric > maxSalary) {
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error applying salary filter:', error, candidate);
        return false;
      }
    });

    // Apply additional filters only if any are set
    if (hasFilters) {
      filteredCandidates = filteredCandidates.filter(candidate => {
        try {
          // Work availability filter
          if (workAvailability.length > 0) {
            const hasMatchingAvailability = workAvailability.some(availability =>
              candidate.work_availability?.includes(availability)
            );
            if (!hasMatchingAvailability) {
              return false;
            }
          }
          
          // Location filter
          if (location && !candidate.location?.toLowerCase().includes(location.toLowerCase())) {
            return false;
          }
          
          // Role name filter
          if (roleName) {
            const hasMatchingRole = candidate.work_experiences?.some(exp =>
              exp.roleName?.toLowerCase().includes(roleName.toLowerCase())
            );
            if (!hasMatchingRole) {
              return false;
            }
          }
          
          // Company filter
          if (company) {
            const hasMatchingCompany = candidate.work_experiences?.some(exp =>
              exp.company?.toLowerCase().includes(company.toLowerCase())
            );
            if (!hasMatchingCompany) {
              return false;
            }
          }
          
          // Education level filter
          if (educationLevel && educationLevel !== 'all' && candidate.education?.highest_level !== educationLevel) {
            return false;
          }
          
          // Degree subject filter
          if (degreeSubject) {
            const hasMatchingDegree = candidate.education?.degrees?.some(degree =>
              degree.subject?.toLowerCase().includes(degreeSubject.toLowerCase())
            );
            if (!hasMatchingDegree) {
              return false;
            }
          }
          
          // Skills filter
          if (skills) {
            const requiredSkills = skills.toLowerCase().split(',').map(s => s.trim());
            const candidateSkills = candidate.skills?.map(s => s.toLowerCase()) || [];
            const hasRequiredSkills = requiredSkills.some(skill =>
              candidateSkills.some(candidateSkill => candidateSkill.includes(skill))
            );
            if (!hasRequiredSkills) {
              return false;
            }
          }
          
          return true;
        } catch (error) {
          console.error('Error filtering candidate:', error, candidate);
          return false; // Exclude problematic candidates
        }
      });
    }
    
    // Apply sorting
    filteredCandidates.sort((a, b) => {
      try {
        switch (sortBy) {
          case 'matchScore':
            return (b.matchScore || 0) - (a.matchScore || 0);
          case 'date':
            return new Date(b.submitted_at || 0).getTime() - new Date(a.submitted_at || 0).getTime();
          case 'salary':
            return (b.salaryNumeric || 0) - (a.salaryNumeric || 0);
          case 'name':
            return (a.name || '').localeCompare(b.name || '');
          case 'location':
            return (a.location || '').localeCompare(b.location || '');
          case 'education':
            return (a.education?.highest_level || '').localeCompare(b.education?.highest_level || '');
          case 'experience':
            return (b.work_experiences?.length || 0) - (a.work_experiences?.length || 0);
          case 'topSchools':
            // Sort by top schools first (true values come first), then by name for tie-breaking
            if (a.isTopSchool !== b.isTopSchool) {
              return a.isTopSchool ? -1 : 1;
            }
            return (a.name || '').localeCompare(b.name || '');
          default:
            return 0;
        }
      } catch (error) {
        console.error('Error sorting candidates:', error);
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
      total: filteredCandidates.length,
      page,
      limit,
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