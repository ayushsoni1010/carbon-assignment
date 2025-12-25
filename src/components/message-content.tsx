import { useEmailStore } from "@/store/useEmailStore";
import React from "react";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardHeader } from "./ui/card";

const MessageContent: React.FunctionComponent = () => {
  const selectedEmail = useEmailStore((state) => state.selectedEmail);

  if (!selectedEmail) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">No email selected</p>
          <p className="text-sm mt-2">Select an email from the list to view its contents</p>
        </div>
      </div>
    );
  }

  const formatFullDate = (time: string): string => {
    const date = new Date(time);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-6">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-4">
              <h1 className="text-2xl font-bold mb-4">{selectedEmail.subject}</h1>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    From:
                  </span>
                  <span className="text-sm">{selectedEmail.from}</span>
                  <span className="text-sm text-muted-foreground">
                    &lt;{selectedEmail.address}&gt;
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Date:
                  </span>
                  <span className="text-sm">{formatFullDate(selectedEmail.time)}</span>
                </div>
              </div>
            </CardHeader>
            <Separator className="my-4" />
            <CardContent className="pt-4">
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedEmail.message}
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MessageContent;
