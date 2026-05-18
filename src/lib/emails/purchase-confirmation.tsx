import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
    Button,
  } from "@react-email/components";
  
  interface PurchaseConfirmationProps {
    name: string;
    amount: number;
    currency: string;
    purchasedAt: string;
    tier: string;
  }
  
  export function PurchaseConfirmationEmail({
    name,
    amount,
    currency,
    purchasedAt,
    tier,
  }: PurchaseConfirmationProps) {
    return (
      <Html>
        <Head />
        <Preview>Your Pro upgrade is confirmed — welcome to the team!</Preview>
        <Body style={{ backgroundColor: "#fafafa", fontFamily: "sans-serif" }}>
          <Container style={{ maxWidth: "560px", margin: "40px auto", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e4e4e7", padding: "40px" }}>
            <Heading style={{ fontSize: "20px", fontWeight: "600", color: "#09090b", marginBottom: "8px" }}>
              You're on Pro 
            </Heading>
            <Text style={{ color: "#71717a", fontSize: "14px", marginBottom: "24px" }}>
              Hi {name}, your payment was successful and your account has been upgraded.
            </Text>
  
            <Section style={{ backgroundColor: "#f4f4f5", borderRadius: "8px", padding: "20px", marginBottom: "24px" }}>
              <Text style={{ color: "#71717a", fontSize: "12px", margin: "0 0 4px" }}>Plan</Text>
              <Text style={{ color: "#09090b", fontSize: "14px", fontWeight: "600", margin: "0 0 16px", textTransform: "capitalize" }}>{tier}</Text>
  
              <Text style={{ color: "#71717a", fontSize: "12px", margin: "0 0 4px" }}>Amount paid</Text>
              <Text style={{ color: "#09090b", fontSize: "14px", fontWeight: "600", margin: "0 0 16px" }}>
                ${(amount / 100).toFixed(2)} {currency.toUpperCase()}
              </Text>
  
              <Text style={{ color: "#71717a", fontSize: "12px", margin: "0 0 4px" }}>Date</Text>
              <Text style={{ color: "#09090b", fontSize: "14px", fontWeight: "600", margin: "0" }}>
                {new Date(purchasedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </Text>
            </Section>
  
            <Button
              href={`${process.env.BETTER_AUTH_URL}/dashboard`}
              style={{ backgroundColor: "#09090b", color: "#ffffff", borderRadius: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: "500", textDecoration: "none", display: "inline-block", marginBottom: "24px" }}
            >
              Go to dashboard →
            </Button>
  
            <Hr style={{ borderColor: "#e4e4e7", marginBottom: "24px" }} />
  
            <Text style={{ color: "#a1a1aa", fontSize: "12px", margin: "0" }}>
              Questions? Reply to this email or contact support@mysaas.app
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }