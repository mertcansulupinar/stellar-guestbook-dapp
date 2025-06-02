"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SendHorizonal } from "lucide-react";

// Form schema with validation
const formSchema = z.object({
  message: z.string()
    .min(3, {
      message: "Your message must be at least 3 characters long.",
    })
    .max(140, {
      message: "Your message can be at most 140 characters long.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface GuestbookFormProps {
  publicKey: string | null;
  onSubmitMessage: (message: string) => Promise<boolean>;
}

export default function GuestbookForm({ publicKey, onSubmitMessage }: GuestbookFormProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  // Form initialization with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!publicKey) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your Freighter wallet to leave a message.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmitMessage(data.message);
      if (success) {
        toast({
          title: "Message Sent!",
          description: "Your message has been successfully recorded on the blockchain.",
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending your message.",
        variant: "destructive",
      });
      //console.error("Error submitting message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Your Message</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Leave a message in the guestbook..."
                        {...field}
                        disabled={isSubmitting || !publicKey}
                        className="bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {form.watch("message").length}/140
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || !publicKey}
                className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl"
              >
                <SendHorizonal className="h-4 w-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}

export { GuestbookForm };
