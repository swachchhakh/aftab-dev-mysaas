import { resend, FROM_EMAIL } from "../email";
import { render } from "@react-email/components";
import { PurchaseConfirmationEmail } from "../emails/purchase-confirmation";
import { RefundConfirmationEmail } from "../emails/refund-confirmation";
import { PasswordResetEmail } from "../emails/password-reset";

export async function sendPurchaseConfirmation({
  to,
  name,
  amount,
  currency,
  purchasedAt,
  tier,
}: {
  to: string;
  name: string;
  amount: number;
  currency: string;
  purchasedAt: string;
  tier: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "You're on Pro — payment confirmed",
    react: PurchaseConfirmationEmail({ name, amount, currency, purchasedAt, tier }),
  });
}

export async function sendRefundConfirmation({
  to,
  name,
  amountRefunded,
  currency,
}: {
  to: string;
  name: string;
  amountRefunded: number;
  currency: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Your refund has been processed",
    react: RefundConfirmationEmail({ name, amountRefunded, currency }),
  });
}

export async function sendPasswordReset({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset your password",
    react: PasswordResetEmail({ name, resetUrl }),
  });
}