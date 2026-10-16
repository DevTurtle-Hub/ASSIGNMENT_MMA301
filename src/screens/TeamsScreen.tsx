import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Team } from '../types/team';
import {
  createTeam,
  joinTeamByCode,
  subscribeUserTeams,
} from '../services/teamService';
import { colors, spacing, borderRadius, shadows } from '../theme';

interface TeamsScreenProps {
  navigation: any;
}

export const TeamsScreen: React.FC<TeamsScreenProps> = ({ navigation }) => {
  const { user } = useAuth();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const unsubscribe = subscribeUserTeams(
      user.id,
      (userTeams) => {
        setTeams(userTeams);
        setLoading(false);
      },
      (err) => {
        console.error('[TeamsScreen] Error loading teams:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      Alert.alert('Required Field', 'Please enter a team name.');
      return;
    }
    if (!user) return;

    setCreating(true);
    try {
      const created = await createTeam(
        { name: newTeamName.trim(), description: newTeamDesc.trim() },
        user
      );
      setCreateModalVisible(false);
      setNewTeamName('');
      setNewTeamDesc('');
      Alert.alert(
        'Team Created!',
        `Your team code is ${created.code}. Share this code with members so they can join!`
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create team.');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!joinCode.trim()) {
      Alert.alert('Required Field', 'Please enter the 6-character team code.');
      return;
    }
    if (!user) return;

    setJoining(true);
    try {
      const team = await joinTeamByCode(joinCode.trim(), user);
      setJoinModalVisible(false);
      setJoinCode('');
      Alert.alert('Success', `You have successfully joined "${team.name}"!`);
    } catch (err: any) {
      Alert.alert('Join Failed', err.message || 'Could not join team with that code.');
    } finally {
      setJoining(false);
    }
  };

  const renderTeamCard = ({ item }: { item: Team }) => {
    const isOwner = user && item.ownerId === user.id;

    return (
      <TouchableOpacity
        style={styles.teamCard}
        onPress={() => navigation.navigate('TeamDetail', { teamId: item.id, teamName: item.name })}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <View style={styles.teamIconBox}>
              <Ionicons name="people" size={20} color={colors.primary} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.teamName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.badgeRow}>
                <View style={[styles.roleBadge, isOwner ? styles.ownerBadge : styles.memberBadge]}>
                  <Text style={[styles.roleText, isOwner ? styles.ownerText : styles.memberText]}>
                    {isOwner ? 'OWNER' : 'MEMBER'}
                  </Text>
                </View>
                <View style={styles.codeBadge}>
                  <Ionicons name="key-outline" size={11} color={colors.textSecondary} />
                  <Text style={styles.codeText}>{item.code}</Text>
                </View>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>

        {Boolean(item.description) && (
          <Text style={styles.teamDesc} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.footerAction}>
            <Ionicons name="chatbubbles-outline" size={14} color={colors.primary} />
            <Text style={styles.footerActionText}>Team Chat</Text>
          </View>
          <View style={styles.footerAction}>
            <Ionicons name="list-outline" size={14} color={colors.cyanDark} />
            <Text style={[styles.footerActionText, { color: colors.cyanDark }]}>Tasks & Members</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.headerTitle}>Teams & Collaboration</Text>
            <Text style={styles.headerSubtitle}>
              {teams.length} {teams.length === 1 ? 'team' : 'teams'} joined
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={() => setJoinModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="enter-outline" size={16} color={colors.primary} />
              <Text style={styles.joinBtnText}>Join</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => setCreateModalVisible(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.createBtnText}>New</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Syncing your collaborative teams...</Text>
          </View>
        ) : (
          <FlatList
            data={teams}
            keyExtractor={(item) => item.id}
            renderItem={renderTeamCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  setTimeout(() => setRefreshing(false), 800);
                }}
                colors={[colors.primary]}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="people-outline" size={40} color={colors.primary} />
                </View>
                <Text style={styles.emptyTitle}>No Teams Joined Yet</Text>
                <Text style={styles.emptyText}>
                  Create your own team workspace or join an existing team using a 6-character code.
                </Text>
                <View style={styles.emptyBtnRow}>
                  <TouchableOpacity
                    style={styles.emptyCreateBtn}
                    onPress={() => setCreateModalVisible(true)}
                  >
                    <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.emptyCreateBtnText}>Create Team</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.emptyJoinBtn}
                    onPress={() => setJoinModalVisible(true)}
                  >
                    <Ionicons name="enter-outline" size={18} color={colors.primary} />
                    <Text style={styles.emptyJoinBtnText}>Join Code</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
          />
        )}

        {/* Create Team Modal */}
        <Modal
          visible={createModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setCreateModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create New Team</Text>
                <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                  <Ionicons name="close" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.modalLabel}>TEAM NAME *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Mobile Dev Squad"
                  placeholderTextColor={colors.textMuted}
                  value={newTeamName}
                  onChangeText={setNewTeamName}
                />

                <Text style={styles.modalLabel}>DESCRIPTION</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextArea]}
                  placeholder="Goals, team purpose or deliverables..."
                  placeholderTextColor={colors.textMuted}
                  value={newTeamDesc}
                  onChangeText={setNewTeamDesc}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setCreateModalVisible(false)}
                  disabled={creating}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalSubmitBtn, creating && styles.btnDisabled]}
                  onPress={handleCreateTeam}
                  disabled={creating}
                >
                  {creating ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.modalSubmitText}>Create Team</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Join Team Modal */}
        <Modal
          visible={joinModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setJoinModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Join Team by Code</Text>
                <TouchableOpacity onPress={() => setJoinModalVisible(false)}>
                  <Ionicons name="close" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.modalLabel}>TEAM JOIN CODE *</Text>
                <TextInput
                  style={[styles.modalInput, styles.codeInput]}
                  placeholder="e.g. AB12CD"
                  placeholderTextColor={colors.textMuted}
                  value={joinCode}
                  onChangeText={setJoinCode}
                  autoCapitalize="characters"
                  maxLength={6}
                />
                <Text style={styles.modalHint}>
                  Ask your team owner for their 6-character team code.
                </Text>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setJoinModalVisible(false)}
                  disabled={joining}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalSubmitBtn, joining && styles.btnDisabled]}
                  onPress={handleJoinTeam}
                  disabled={joining}
                >
                  {joining ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.modalSubmitText}>Join Team</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  joinBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    gap: 2,
    ...shadows.sm,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 90,
  },
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  teamIconBox: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.sm,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  teamName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.xs,
  },
  ownerBadge: {
    backgroundColor: '#FEF3C7',
  },
  memberBadge: {
    backgroundColor: '#F1F5F9',
  },
  roleText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  ownerText: {
    color: '#D97706',
  },
  memberText: {
    color: colors.textSecondary,
  },
  codeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  codeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  teamDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm + 2,
    paddingTop: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: spacing.xl,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  emptyBtnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  emptyCreateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    gap: 6,
  },
  emptyCreateBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyJoinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    gap: 6,
  },
  emptyJoinBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalBody: {
    gap: 6,
  },
  modalLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 6,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textPrimary,
  },
  codeInput: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  modalTextArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  modalHint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  modalCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalSubmitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: borderRadius.sm,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
