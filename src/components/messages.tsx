import type { IMesseage } from "@/types/message";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { useEmailStore } from "@/store/useEmailStore";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

const Messages: React.FunctionComponent = () => {
  const {
    emails,
    selectedEmail,
    checkedEmailIds,
    setSelectedEmail,
    toggleEmailChecked,
    toggleAllEmailsChecked,
    markCheckedEmailsAsRead,
    markCheckedEmailsAsUnread,
  } = useEmailStore();

  const handleEmailClick = (email: IMesseage, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest("[data-checkbox]")) {
      return;
    }
    setSelectedEmail(email);
  };

  const handleCheckboxChange = (emailId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    toggleEmailChecked(emailId);
  };

  const formatDate = (time: string): string => {
    const date = new Date(time);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const hasCheckedEmails = checkedEmailIds.size > 0;
  const allChecked =
    emails.length > 0 && emails.every((email) => checkedEmailIds.has(email.id));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header with bulk action buttons */}
      <div className="flex flex-col gap-2 border-b p-4 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Inbox</h2>
          <Checkbox
            checked={allChecked}
            onCheckedChange={toggleAllEmailsChecked}
            data-checkbox="select-all"
            aria-label="Select all emails"
          />
        </div>
        {hasCheckedEmails && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markCheckedEmailsAsRead}
                className="flex-1"
              >
                Mark as Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={markCheckedEmailsAsUnread}
                className="flex-1"
              >
                Mark as Unread
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Email list */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col">
            {emails.map((email: IMesseage) => {
              const isSelected = selectedEmail?.id === email.id;
              const isChecked = checkedEmailIds.has(email.id);

              return (
                <div
                  key={email.id}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handleEmailClick(email, e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleEmailClick(email, e as unknown as React.MouseEvent);
                    }
                  }}
                  className={cn(
                    "flex items-start gap-3 border-b p-4 transition-colors hover:bg-accent/50 cursor-pointer",
                    email.read
                      ? "bg-gray-100 dark:bg-gray-800/30"
                      : "bg-gray-200 dark:bg-gray-700/40",
                    isSelected && "bg-accent"
                  )}
                >
                  <div
                    onClick={(e) => handleCheckboxChange(email.id, e)}
                    className="pt-1"
                    data-checkbox
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleEmailChecked(email.id)}
                      data-checkbox
                      aria-label={`Select ${email.subject}`}
                    />
                  </div>
                  <Card
                    className={cn(
                      "flex-1 border-0 shadow-none p-0",
                      email.read ? "bg-transparent" : "bg-transparent"
                    )}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "font-medium truncate",
                              !email.read && "font-semibold"
                            )}
                          >
                            {email.from}
                          </p>
                          <p
                            className={cn(
                              "text-sm truncate mt-1",
                              !email.read && "font-medium"
                            )}
                          >
                            {email.subject}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatDate(email.time)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Messages;
