import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { ChatMessage } from '../types/chat';
import { subscribeTeamMessages, sendTeamMessage } from '../services/chatService';
import { colors, spacing, borderRadius, shadows } from '../theme';

interface ChatScreenProps {
  route: any;
  navigation: any;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { teamId, teamName } = route.params;
  const { user, firebaseUser } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeTeamMessages(
      teamId,
      (msgs) => {
        setMessages(msgs);
        setLoading(false);
        // Scroll to bottom when messages update
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 150);
      },
      (err) => {
        console.error('[ChatScreen] Error loading messages:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [teamId]);

  const handleSendMessage = async () => {
    const senderId = user?.id || firebaseUser?.uid;
    const senderName =
      user?.name ||
      firebaseUser?.displayName ||
      firebaseUser?.email?.split('@')[0] ||
      'User';

    if (!inputText.trim() || !senderId || sending) return;

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      await sendTeamMessage(teamId, senderId, senderName, messageText);
    } catch (err: any) {
      console.error('[ChatScreen] Failed to send message:', err);
      Alert.alert(
        'Lỗi gửi tin nhắn',
        err?.message || 'Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối mạng hoặc quyền Firestore.'
      );
      setInputText(messageText); // restore text on failure
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (isoString: string): string => {
    try {
      const d = new Date(isoString);
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const currentUserId = user?.id || firebaseUser?.uid;
    const isMe = Boolean(currentUserId && item.senderId === currentUserId);

    return (
      <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.otherMessageRow]}>
        {!isMe && (
          <View style={styles.senderAvatarCircle}>
            <Text style={styles.senderAvatarText}>
              {(item.senderName || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
          {!isMe && (
            <Text style={styles.senderNameText} numberOfLines={1}>
              {item.senderName}
            </Text>
          )}

          <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
            {item.text}
          </Text>

          <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.otherTimeText]}>
            {formatMessageTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {teamName || 'Team Chat'}
          </Text>
          <View style={styles.liveIndicatorRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Real-Time Firestore</Text>
          </View>
        </View>

        <View style={styles.headerPlaceholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Connecting to team chat channel...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View style={styles.emptyChatBox}>
                <View style={styles.emptyIconBox}>
                  <Ionicons name="chatbubbles-outline" size={36} color={colors.primary} />
                </View>
                <Text style={styles.emptyChatTitle}>No messages yet</Text>
                <Text style={styles.emptyChatDesc}>
                  Say hello to kick off real-time collaboration with your team!
                </Text>
              </View>
            }
          />
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a team message..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              !inputText.trim() && styles.sendBtnDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || sending}
            activeOpacity={0.8}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="send" size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
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
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16A34A',
  },
  headerPlaceholder: {
    width: 32,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
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
  messagesList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: 10,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginVertical: 2,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
  },
  senderAvatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  senderAvatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...shadows.sm,
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 2,
  },
  senderNameText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.cyanDark,
    marginBottom: 2,
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 18,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: colors.textPrimary,
  },
  timeText: {
    fontSize: 9.5,
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  myTimeText: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  otherTimeText: {
    color: colors.textMuted,
  },
  emptyChatBox: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: spacing.xl,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyChatTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  emptyChatDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    fontSize: 13,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  sendBtnDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.6,
  },
});
