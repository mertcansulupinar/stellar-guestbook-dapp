"use client";

import React from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface GuestbookEntry {
  id: string;
  sender: string;
  message: string;
  timestamp: number | bigint;
}

interface GuestbookEntriesProps {
  entries: GuestbookEntry[];
  isLoading: boolean;
}

export default function GuestbookEntries({ entries, isLoading }: GuestbookEntriesProps) {
  // Format the public key for display
  const formatPublicKey = (key: string) => {
    return `${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: number | bigint) => {
    try {
      // Convert BigInt to number if needed
      const numericTimestamp = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;

      // Handle seconds vs milliseconds (if timestamp is less than 2030, it's probably in seconds)
      // 1893456000 = Jan 1, 2030 in seconds
      const finalTimestamp = numericTimestamp < 1893456000 ? numericTimestamp * 1000 : numericTimestamp;

      const date = new Date(finalTimestamp);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return format(date, "MMM d, yyyy, HH:mm", { locale: enUS });
    } catch (error) {
      //console.warn("Error formatting date:", error);
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 mt-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-white/80 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-2xl">
            <CardContent className="p-4">
              <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-3"></div>
              <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Guestbook Messages</h3>

      {entries.length === 0 ? (
        <Card className="bg-white/80 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-2xl">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No messages yet. Would you like to leave the first one?
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[400px] rounded-2xl border border-gray-300 dark:border-gray-700">
          <div className="p-4 space-y-4">
            <AnimatePresence>
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 overflow-hidden rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                          {formatPublicKey(entry.sender)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white">{entry.message}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export { GuestbookEntries };
