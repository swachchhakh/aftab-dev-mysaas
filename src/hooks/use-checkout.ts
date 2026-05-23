import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/treaty";



export function useCheckout() {
  return useMutation({
    mutationFn: async (priceId: string) => {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, cancelUrl: window.location.href }),
      });

      if (!res.ok) throw new Error("Failed to create checkout session");
      return res.json();
    },
    onSuccess: (data) => {
      if (data?.url) window.location.href = data.url;
    },
  });
}