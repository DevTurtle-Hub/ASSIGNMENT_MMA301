import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Team, TeamMember } from '../types/team';
import { Task } from '../types/task';
import { getTeamById, subscribeTeamMembers } from '../services/teamService';
import {
  subscribeTeamTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../services/taskService';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { colors, spacing, borderRadius, shadows } from '../theme';

interface TeamDetailScreenProps {
  route: any;
  navigation: any;
}

export const TeamDetailScreen: React.FC<TeamDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { teamId, teamName: initialTeamName } = route.params;
  const { user } = useAuth();

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states for task creation/editing
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Delete modal states
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    let unsubMembers = () => {};
    let unsubTasks = () => {};

    const loadData = async () => {
      setLoading(true);
      const fetchedTeam = await getTeamById(teamId);
      if (fetchedTeam) {
        setTeam(fetchedTeam);
      }

      unsubMembers = subscribeTeamMembers(teamId, (m) => setMembers(m));
      unsubTasks = subscribeTeamTasks(
        teamId,
        (t) => {
          setTasks(t);
          setLoading(false);
        },
        (err) => {
          console.error('[TeamDetailScreen] subscribeTeamTasks error:', err);
          setLoading(false);
        }
      );
    };

    loadData();

    return () => {
      unsubMembers();
      unsubTasks();
    };
  }, [teamId]);

  const handleOpenChat = () => {
    navigation.navigate('Chat', {
      teamId,
      teamName: team?.name || initialTeamName || 'Team Chat',
    });
  };

  const handleToggleStatus = async (task: Task) => {
    const nextStatusMap: Record<string, Task['status']> = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo',
    };
    const nextStatus = nextStatusMap[task.status] || 'todo';
    try {
      await updateTask(task.id, { status: nextStatus });
      return true;
    } catch {
      return false;
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {team?.name || initialTeamName}
        </Text>
        <TouchableOpacity style={styles.chatHeaderBtn} onPress={handleOpenChat}>
          <Ionicons name="chatbubbles" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading team details...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Team Info Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.teamIconBox}>
                <Ionicons name="people" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.heroMeta}>
                <Text style={styles.teamTitle}>{team?.name}</Text>
                <View style={styles.codeRow}>
                  <Text style={styles.codeLabel}>JOIN CODE:</Text>
                  <View style={styles.codePill}>
                    <Text style={styles.codeVal}>{team?.code}</Text>
                  </View>
                </View>
              </View>
            </View>

            {Boolean(team?.description) && (
              <Text style={styles.heroDesc}>{team?.description}</Text>
            )}

            {/* Prominent Chat CTA Button */}
            <TouchableOpacity
              style={styles.chatCtaBtn}
              onPress={handleOpenChat}
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" />
              <Text style={styles.chatCtaText}>Open Real-Time Team Chat</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Members Section */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="person-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Team Members ({members.length})</Text>
            </View>
          </View>

          <View style={styles.membersCard}>
            {members.map((member, index) => {
              const isOwner = member.role === 'owner';
              const isMe = user && member.userId === user.id;

              return (
                <View
                  key={member.id || index}
                  style={[
                    styles.memberRow,
                    index !== members.length - 1 && styles.memberRowBorder,
                  ]}
                >
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberAvatarText}>
                      {(member.userName || member.userEmail || 'U').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <View style={styles.memberNameRow}>
                      <Text style={styles.memberName}>
                        {member.userName || 'Member'}
                      </Text>
                      {isMe && <Text style={styles.meTag}>(You)</Text>}
                    </View>
                    <Text style={styles.memberEmail}>{member.userEmail}</Text>
                  </View>
                  <View
                    style={[
                      styles.roleTag,
                      isOwner ? styles.ownerRoleTag : styles.memberRoleTag,
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleTagText,
                        isOwner ? styles.ownerRoleText : styles.memberRoleText,
                      ]}
                    >
                      {isOwner ? 'Owner' : 'Member'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Team Tasks Section */}
          <View style={[styles.sectionHeaderRow, { marginTop: spacing.lg }]}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="checkbox-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Team Tasks ({tasks.length})</Text>
            </View>
            <TouchableOpacity
              style={styles.addTaskBtn}
              onPress={() => {
                setEditingTask(null);
                setTaskModalVisible(true);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.addTaskBtnText}>Add Task</Text>
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <View style={styles.emptyTasksBox}>
              <Ionicons name="clipboard-outline" size={32} color={colors.textMuted} />
              <Text style={styles.emptyTasksTitle}>No tasks for this team yet</Text>
              <Text style={styles.emptyTasksSubtitle}>
                Create a task and assign it to a team member to collaborate.
              </Text>
            </View>
          ) : (
            <View style={styles.tasksList}>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(t) => {
                    setEditingTask(t);
                    setTaskModalVisible(true);
                  }}
                  onDelete={(t) => {
                    setTaskToDelete(t);
                    setDeleteModalVisible(true);
                  }}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Task Modal for Creating / Editing with Team info preselected */}
      <TaskModal
        visible={taskModalVisible}
        onClose={() => setTaskModalVisible(false)}
        onSubmitCreate={async (input) => {
          try {
            await createTask({
              ...input,
              teamId: team?.id || teamId,
              teamName: team?.name || initialTeamName,
            });
            return true;
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Could not create task.');
            return false;
          }
        }}
        onSubmitUpdate={async (id, updates) => {
          try {
            await updateTask(id, updates);
            return true;
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Could not update task.');
            return false;
          }
        }}
        taskToEdit={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={deleteModalVisible}
        task={taskToDelete}
        onClose={() => {
          setDeleteModalVisible(false);
          setTaskToDelete(null);
        }}
        onConfirmDelete={handleDeleteTask}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 6,
  },
  navTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  chatHeaderBtn: {
    padding: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: '#EFF6FF',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 40,
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
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  teamIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroMeta: {
    flex: 1,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  codePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  codeVal: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  heroDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  chatCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    gap: 8,
    marginTop: 4,
    ...shadows.sm,
  },
  chatCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
    paddingHorizontal: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  addTaskBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  membersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: spacing.sm,
  },
  memberRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  memberAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  meTag: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  memberEmail: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  roleTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  ownerRoleTag: {
    backgroundColor: '#FEF3C7',
  },
  memberRoleTag: {
    backgroundColor: '#F1F5F9',
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  ownerRoleText: {
    color: '#D97706',
  },
  memberRoleText: {
    color: colors.textSecondary,
  },
  tasksList: {
    marginTop: spacing.xs,
  },
  emptyTasksBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
  },
  emptyTasksTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: 2,
  },
  emptyTasksSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
