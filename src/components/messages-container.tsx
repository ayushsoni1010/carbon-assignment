import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Messages from "./messages";
import MessageContent from "./message-content";
import { API_URL } from "@/constants/main";
import { useCallback, useEffect } from "react";
import type { IMesseage } from "@/types/message";
import { useEmailStore } from "@/store/useEmailStore";

interface EmailDataFromAPI {
  id: string;
  from: string;
  address: string;
  time: string;
  message: string;
  subject: string;
  tag: string;
  read: string | boolean; // API returns string "true"/"false"
}

export function MessagesContainer() {
  const setEmails = useEmailStore((state) => state.setEmails);

  const getEmailsData = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      const data: EmailDataFromAPI[] = await response.json();
      
      // Convert read property from string to boolean and ensure proper typing
      const normalizedEmails: IMesseage[] = data.map((email) => ({
        ...email,
        read:
          typeof email.read === "string"
            ? email.read === "true"
            : Boolean(email.read),
      }));

      setEmails(normalizedEmails);
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  }, [setEmails]);

  useEffect(() => {
    getEmailsData();
  }, [getEmailsData]);

  return (
    <div className="h-screen w-full overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full"
      >
        <ResizablePanel defaultSize={40} minSize={30} maxSize={50}>
          <div className="h-full overflow-hidden">
            <Messages />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60} minSize={50}>
          <div className="h-full overflow-hidden">
            <MessageContent />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
