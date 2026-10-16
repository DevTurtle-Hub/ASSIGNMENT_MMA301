export interface Team {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  code: string; // 6-character code for joining
  createdAt: string;
}

export type TeamMemberRole = 'owner' | 'member';

export interface TeamMember {
  id?: string;
  teamId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: TeamMemberRole;
  joinedAt: string;
}

export interface CreateTeamInput {
  name: string;
  description: string;
}
