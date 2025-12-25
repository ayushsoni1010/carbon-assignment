import type { IMesseage } from "@/types/message";
import { create } from "zustand";

interface EmailState {
  emails: IMesseage[];
  selectedEmail: IMesseage | null;
  checkedEmailIds: Set<string>;
  setEmails: (emails: IMesseage[]) => void;
  setSelectedEmail: (email: IMesseage | null) => void;
  toggleEmailChecked: (emailId: string) => void;
  toggleAllEmailsChecked: () => void;
  markEmailsAsRead: (emailIds: string[]) => void;
  markEmailsAsUnread: (emailIds: string[]) => void;
  markCheckedEmailsAsRead: () => void;
  markCheckedEmailsAsUnread: () => void;
  clearCheckedEmails: () => void;
}

export const useEmailStore = create<EmailState>()((set, get) => ({
  emails: [],
  selectedEmail: null,
  checkedEmailIds: new Set<string>(),

  setEmails: (emails: IMesseage[]) =>
    set({ emails, checkedEmailIds: new Set<string>() }),

  setSelectedEmail: (email: IMesseage | null) => {
    if (!email) {
      set({ selectedEmail: null });
      return;
    }

    const { emails } = get();
    // Find the email from the emails array to ensure we have the latest state
    const emailFromStore = emails.find((e) => e.id === email.id) || email;

    // Mark email as read when selected
    if (!emailFromStore.read) {
      const updatedEmails = emails.map((e) =>
        e.id === email.id ? { ...e, read: true } : e
      );
      set({
        selectedEmail: { ...emailFromStore, read: true },
        emails: updatedEmails,
      });
    } else {
      set({ selectedEmail: emailFromStore });
    }
  },

  toggleEmailChecked: (emailId: string) =>
    set((state) => {
      const newCheckedIds = new Set(state.checkedEmailIds);
      if (newCheckedIds.has(emailId)) {
        newCheckedIds.delete(emailId);
      } else {
        newCheckedIds.add(emailId);
      }
      return { checkedEmailIds: newCheckedIds };
    }),

  toggleAllEmailsChecked: () =>
    set((state) => {
      const allChecked =
        state.emails.length > 0 &&
        state.emails.every((email) => state.checkedEmailIds.has(email.id));

      if (allChecked) {
        return { checkedEmailIds: new Set<string>() };
      } else {
        return { checkedEmailIds: new Set(state.emails.map((e) => e.id)) };
      }
    }),

  markEmailsAsRead: (emailIds: string[]) =>
    set((state) => {
      const updatedEmails = state.emails.map((email) =>
        emailIds.includes(email.id) ? { ...email, read: true } : email
      );
      return {
        emails: updatedEmails,
        selectedEmail:
          state.selectedEmail && emailIds.includes(state.selectedEmail.id)
            ? updatedEmails.find((e) => e.id === state.selectedEmail!.id) ||
              state.selectedEmail
            : state.selectedEmail,
      };
    }),

  markEmailsAsUnread: (emailIds: string[]) =>
    set((state) => {
      const updatedEmails = state.emails.map((email) =>
        emailIds.includes(email.id) ? { ...email, read: false } : email
      );
      return {
        emails: updatedEmails,
        selectedEmail:
          state.selectedEmail && emailIds.includes(state.selectedEmail.id)
            ? updatedEmails.find((e) => e.id === state.selectedEmail!.id) ||
              state.selectedEmail
            : state.selectedEmail,
      };
    }),

  markCheckedEmailsAsRead: () => {
    const { checkedEmailIds, markEmailsAsRead, clearCheckedEmails } = get();
    markEmailsAsRead(Array.from(checkedEmailIds));
    clearCheckedEmails();
  },

  markCheckedEmailsAsUnread: () => {
    const { checkedEmailIds, markEmailsAsUnread, clearCheckedEmails } = get();
    markEmailsAsUnread(Array.from(checkedEmailIds));
    clearCheckedEmails();
  },

  clearCheckedEmails: () => set({ checkedEmailIds: new Set<string>() }),
}));
