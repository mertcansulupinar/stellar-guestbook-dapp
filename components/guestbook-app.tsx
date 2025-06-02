"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GuestbookForm } from "./guestbook-form";
import { GuestbookEntries } from "./guestbook-entries";
import { WalletConnection } from "./wallet-connection";
import { ThemeToggle } from "./theme-toggle";
import { fetchGuestbookEntries, submitGuestbookMessage } from "@/lib/stellar-service";
import { Sparkles } from "lucide-react";
import freighterApi from "@stellar/freighter-api";

export interface GuestbookEntry {
  id: string;
  sender: string;
  message: string;
  timestamp: number;
}

export function GuestbookApp() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Check wallet connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await freighterApi.isConnected();
        if (isConnected) {
          const isAllowed = await freighterApi.isAllowed();
          if (isAllowed) {
            const publicKey = await freighterApi.getPublicKey();
            setPublicKey(publicKey);
            setIsWalletConnected(true);
          }
        }
      } catch (error) {
        //console.error("Error checking wallet connection:", error);
      }
    };

    checkConnection();
  }, []);

  // Fetch entries on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        setIsLoading(true);
        const data = await fetchGuestbookEntries();
        setEntries(data);
      } catch (error) {
        //console.error("Error loading entries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  const handleSubmitMessage = async (message: string): Promise<boolean> => {
    try {
      const success = await submitGuestbookMessage(message);
      // Reload entries
      const data = await fetchGuestbookEntries();
      setEntries(data);
      return success;
    } catch (error) {
      //console.error("Error submitting message:", error);
      throw error;
    }
  };

  const handleWalletConnect = (wallet: string | null) => {
    setPublicKey(wallet);
    setIsWalletConnected(!!wallet);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
    <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
    >
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-gray-800 dark:text-white" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Guestbook DApp
              </h1>
              <Sparkles className="h-8 w-8 text-gray-800 dark:text-white" />
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A decentralized guestbook powered by Stellar blockchain. Share your thoughts with the world!
            </p>
        </motion.div>

          {/* Theme Toggle */}
          <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>

          {/* Wallet Connection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <WalletConnection onConnectionChange={handleWalletConnect} />
          </motion.div>

          {/* Guestbook Form */}
          {isWalletConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <GuestbookForm
                publicKey={publicKey}
                onSubmitMessage={handleSubmitMessage}
              />
            </motion.div>
          )}

          {/* Guestbook Entries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
        <GuestbookEntries entries={entries} isLoading={isLoading} />
    </motion.div>
        </div>
      </div>
    </div>
  );
}
