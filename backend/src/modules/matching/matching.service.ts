import { UserSkill } from '../skills/skill.model';
import { User } from '../users/user.model';

export interface SmartMatchResult {
  candidateUser: any;
  skill: any;
  matchScore: number;
  reasons: string[];
}

export class MatchingService {
  /**
   * Natural Language Request Parser (Extracts structured requirement from free text)
   * Example input: "I need help with React and Node.js deployment this weekend in English"
   */
  static parseNaturalLanguageRequest(promptText: string) {
    const text = promptText.toLowerCase();
    
    // Heuristic skill detection keywords
    const keywords = [
      'react', 'node.js', 'node', 'typescript', 'javascript', 'python', 'django',
      'ui/ux', 'design', 'figma', 'marketing', 'seo', 'data science', 'sql', 'mongodb',
      'devops', 'docker', 'aws', 'public speaking', 'guitar', 'spanish', 'french'
    ];

    const detectedSkills = keywords.filter(k => text.includes(k));
    const isWeekend = text.includes('weekend') || text.includes('saturday') || text.includes('sunday');

    return {
      rawPrompt: promptText,
      extractedSkill: detectedSkills[0] || promptText,
      extractedKeywords: detectedSkills,
      preferredDays: isWeekend ? ['Saturday', 'Sunday'] : []
    };
  }

  /**
   * Candidates Search & AI Ranking Engine
   */
  static async findMatches(params: {
    query?: string;
    requesterUserId?: string;
    category?: string;
    availabilityDay?: string;
  }): Promise<SmartMatchResult[]> {
    const parsed = params.query ? this.parseNaturalLanguageRequest(params.query) : null;
    const searchPattern = parsed?.extractedSkill || params.query || '';

    // Find skills taught by users
    const queryCond: any = { mode: 'TEACH' };
    if (searchPattern) {
      queryCond.skillName = { $regex: searchPattern, $options: 'i' };
    }
    if (params.category) {
      queryCond.category = params.category;
    }

    const candidateSkills = await UserSkill.find(queryCond).populate('userId');

    const results: SmartMatchResult[] = [];

    for (const skill of candidateSkills) {
      const provider = skill.userId as any;
      if (!provider || (params.requesterUserId && provider._id.toString() === params.requesterUserId)) {
        continue;
      }

      const reasons: string[] = [];
      let score = 70; // base score

      // Skill exact/partial match check
      if (searchPattern && skill.skillName.toLowerCase().includes(searchPattern.toLowerCase())) {
        score += 15;
        reasons.push(`Direct skill match: ${skill.skillName}`);
      }

      // Availability check
      if (params.availabilityDay && skill.availabilityDays.includes(params.availabilityDay)) {
        score += 10;
        reasons.push(`Available on ${params.availabilityDay}`);
      } else if (parsed?.preferredDays.some(day => skill.availabilityDays.includes(day))) {
        score += 10;
        reasons.push(`Matches requested weekend availability`);
      }

      // Rating bonus
      if (provider.ratingAverage >= 4.5) {
        score += 10;
        reasons.push(`High community rating (${provider.ratingAverage} ★)`);
      }

      // Experience bonus
      if (provider.experienceYears >= 2) {
        score += 5;
        reasons.push(`${provider.experienceYears}+ years experience`);
      }

      if (reasons.length === 0) {
        reasons.push('Relevant skill offering in community catalog');
      }

      results.push({
        candidateUser: {
          _id: provider._id,
          name: provider.name,
          username: provider.username,
          avatarUrl: provider.avatarUrl,
          ratingAverage: provider.ratingAverage,
          ratingCount: provider.ratingCount,
          completedExchangesCount: provider.completedExchangesCount,
          timezone: provider.timezone,
          languages: provider.languages
        },
        skill: {
          _id: skill._id,
          skillName: skill.skillName,
          category: skill.category,
          proficiency: skill.proficiency,
          description: skill.description,
          availabilityDays: skill.availabilityDays
        },
        matchScore: Math.min(score, 99),
        reasons
      });
    }

    // Sort by match score descending
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }
}
