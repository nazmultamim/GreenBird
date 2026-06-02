"use client";

import { useState, useEffect } from "react";

export function useVerificationBadge() {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const response = await fetch("/api/users/me");
        if (response.ok) {
          const data = await response.json();
          setIsVerified(data.user?.verificationBadge || false);
        }
      } catch (error) {
        console.error("Error fetching verification badge:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, []);

  return { isVerified, loading };
}
