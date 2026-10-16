import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Team, TeamMember, CreateTeamInput } from '../types/team';
import { UserProfile } from '../types/user';

const TEAMS_COLLECTION = 'teams';
const TEAM_MEMBERS_COLLECTION = 'teamMembers';

/**
 * Generate a random 6-character alphanumeric team join code (e.g. "TF89A2")
 */
export const generateTeamCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Creates a new team and assigns creator as owner in teamMembers
 */
export const createTeam = async (
  input: CreateTeamInput,
  user: UserProfile
): Promise<Team> => {
  const code = generateTeamCode();
  const now = new Date().toISOString();

  // 1. Create Team doc in 'teams'
  const teamDocRef = await addDoc(collection(db, TEAMS_COLLECTION), {
    name: input.name.trim(),
    description: (input.description || '').trim(),
    ownerId: user.id,
    code,
    createdAt: now,
  });

  const teamId = teamDocRef.id;

  // 2. Add creator to 'teamMembers' collection as 'owner'
  await addDoc(collection(db, TEAM_MEMBERS_COLLECTION), {
    teamId,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    role: 'owner',
    joinedAt: now,
  });

  return {
    id: teamId,
    name: input.name.trim(),
    description: (input.description || '').trim(),
    ownerId: user.id,
    code,
    createdAt: now,
  };
};

/**
 * Joins an existing team via team code
 */
export const joinTeamByCode = async (
  code: string,
  user: UserProfile
): Promise<Team> => {
  const formattedCode = code.trim().toUpperCase();

  // 1. Search for team with code
  const qTeam = query(
    collection(db, TEAMS_COLLECTION),
    where('code', '==', formattedCode)
  );
  const snapTeam = await getDocs(qTeam);

  if (snapTeam.empty) {
    throw new Error(`Team with code "${formattedCode}" does not exist.`);
  }

  const teamDoc = snapTeam.docs[0];
  const teamId = teamDoc.id;
  const teamData = teamDoc.data();

  // 2. Check if already a member
  const qMember = query(
    collection(db, TEAM_MEMBERS_COLLECTION),
    where('teamId', '==', teamId),
    where('userId', '==', user.id)
  );
  const snapMember = await getDocs(qMember);

  if (!snapMember.empty) {
    throw new Error('You are already a member of this team.');
  }

  // 3. Add to teamMembers
  const now = new Date().toISOString();
  await addDoc(collection(db, TEAM_MEMBERS_COLLECTION), {
    teamId,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    role: 'member',
    joinedAt: now,
  });

  return {
    id: teamId,
    name: teamData.name,
    description: teamData.description,
    ownerId: teamData.ownerId,
    code: teamData.code,
    createdAt: teamData.createdAt,
  };
};

/**
 * Real-time listener for all teams the given user belongs to
 */
export const subscribeUserTeams = (
  userId: string,
  onNext: (teams: Team[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const qMembers = query(
    collection(db, TEAM_MEMBERS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    qMembers,
    async (snapshot) => {
      try {
        const teamIds = snapshot.docs.map((d) => d.data().teamId as string);

        if (teamIds.length === 0) {
          onNext([]);
          return;
        }

        // Fetch team documents for each teamId
        const teamPromises = teamIds.map(async (tid) => {
          const docSnap = await getDoc(doc(db, TEAMS_COLLECTION, tid));
          if (docSnap.exists()) {
            return {
              id: docSnap.id,
              ...(docSnap.data() as Omit<Team, 'id'>),
            };
          }
          return null;
        });

        const results = await Promise.all(teamPromises);
        const validTeams = results.filter((t): t is Team => t !== null);
        onNext(validTeams);
      } catch (err: any) {
        console.error('[teamService] Error fetching user teams:', err);
        if (onError) onError(err);
      }
    },
    (err) => {
      console.error('[teamService] onSnapshot error:', err);
      if (onError) onError(err);
    }
  );
};

/**
 * Real-time listener for members of a team
 */
export const subscribeTeamMembers = (
  teamId: string,
  onNext: (members: TeamMember[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const q = query(
    collection(db, TEAM_MEMBERS_COLLECTION),
    where('teamId', '==', teamId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const members: TeamMember[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          teamId: data.teamId,
          userId: data.userId,
          userName: data.userName,
          userEmail: data.userEmail,
          role: data.role || 'member',
          joinedAt: data.joinedAt,
        };
      });
      onNext(members);
    },
    (err) => {
      console.error('[teamService] subscribeTeamMembers error:', err);
      if (onError) onError(err);
    }
  );
};

/**
 * Fetch a single team by ID
 */
export const getTeamById = async (teamId: string): Promise<Team | null> => {
  try {
    const docSnap = await getDoc(doc(db, TEAMS_COLLECTION, teamId));
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...(docSnap.data() as Omit<Team, 'id'>),
      };
    }
    return null;
  } catch (err) {
    console.error('[teamService] Error getting team:', err);
    return null;
  }
};
