"use client";

import React, { useEffect, useState } from "react";
import freighterApi from "@stellar/freighter-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, LogOut, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface WalletConnectionProps {
  onConnectionChange?: (publicKey: string | null) => void;
}

export function WalletConnection({ onConnectionChange }: WalletConnectionProps) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [hasCheckedConnection, setHasCheckedConnection] = useState<boolean>(false);

  // Only check connection once on mount, don't auto-connect
  useEffect(() => {
    const checkInitialConnection = async () => {
      if (hasCheckedConnection) return;

      try {
        // Only check if we're already connected, don't force connection
        const isAllowed = await freighterApi.isAllowed();
        if (isAllowed) {
          const userPublicKey = await freighterApi.getPublicKey();
          setPublicKey(userPublicKey);
          onConnectionChange?.(userPublicKey);
        }
      } catch (error) {
        //console.log("No existing wallet connection found");
      } finally {
        setHasCheckedConnection(true);
      }
    };

    checkInitialConnection();
  }, [hasCheckedConnection, onConnectionChange]);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Request permission to access Freighter
      await freighterApi.setAllowed();

      // Get the user's public key
      const userPublicKey = await freighterApi.getPublicKey();
      setPublicKey(userPublicKey);
      onConnectionChange?.(userPublicKey);
    } catch (error) {
      //console.error("Failed to connect wallet:", error);
      alert("Wallet connection failed. Please make sure Freighter extension is installed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      // Clear local state immediately
      setPublicKey(null);
      onConnectionChange?.(null);

      // Note: Freighter doesn't have a proper disconnect method
      // The user needs to revoke permission manually from Freighter extension
      //console.log("Wallet disconnected locally. To fully disconnect, revoke permissions in Freighter extension.");
    } catch (error) {
      //console.error("Error during disconnect:", error);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 backdrop-blur-sm rounded-2xl">
        <CardContent className="p-6">
          {!publicKey ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-gray-200 dark:bg-gray-500/20 p-3 rounded-full">
                  <Wallet className="h-8 w-8 text-gray-700 dark:text-gray-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Connect Your Wallet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Connect your Freighter wallet to start using the guestbook
                </p>
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white border-0 rounded-xl"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Freighter Wallet
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Wallet className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connected Wallet</p>
                  <p className="font-mono text-gray-900 dark:text-white text-sm">
                    {truncateAddress(publicKey)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://stellar.expert/explorer/testnet/account/${publicKey}`, '_blank')}
                  className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default WalletConnection;
