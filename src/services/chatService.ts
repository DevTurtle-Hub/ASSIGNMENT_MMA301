import {
  collection,
  addDoc,
  query,
  onSnapshot,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { ChatMessage } from '../types/chat';

/**
 * Subscribes to real-time chat messages for a specific team in Firestore:
 * Subcollection: teams/{teamId}/messages
 * Ordered by createdAt ascending
 */
export const subscribeTeamMessages = (
  teamId: string,
  onNext: (messages: ChatMessage[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  try {
    const messagesRef = collection(db, 'teams', teamId, 'messages');
    // Using simple collection query and sorting client-side prevents index issues
    const q = query(messagesRef);

    return onSnapshot(
      q,
      (snapshot) => {
        const messages: ChatMessage[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            senderId: data.senderId,
            senderName: data.senderName,
            text: data.text,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toISOString()
                : data.createdAt || new Date().toISOString(),
          };
        });
        messages.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        onNext(messages);
      },
      (err) => {
        console.error('[chatService] subscribeTeamMessages error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.error('[chatService] Exception setting up messages listener:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Sends a new message in a team chat
 */
export const sendTeamMessage = async (
  teamId: string,
  senderId: string,
  senderName: string,
  text: string
): Promise<void> => {
  const cleanText = text.trim();
  if (!cleanText) return;

  const messagesRef = collection(db, 'teams', teamId, 'messages');
  await addDoc(messagesRef, {
    senderId,
    senderName,
    text: cleanText,
    createdAt: new Date().toISOString(),
  });
};
