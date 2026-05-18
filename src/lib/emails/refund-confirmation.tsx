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
  } from "@react-email/components";
  
  interface RefundConfirmationProps {
    name: string;
    amountRefunded: number;
    currency: string;
  }
  
  export function RefundConfirmationEmail({ name, amountRefunded, currency }: RefundConfirmationProps) {
    return (
      <Html>
        <Head />
        <Preview>Your refund has been processed</Preview>
        <Body style={{ backgroundColor: "#fafafa", fontFamily: "sans-serif" }}>
          <Container style={{ maxWidth: "560px", margin: "40px auto", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e4e4e7", padding: "40px" }}>
            <Heading style={{ fontSize: "20px", fontWeight: "600", color: "#09090b", marginBottom: "8px" }}>
              Refund processed
            </Heading>
            <Text style={{ color: "#71717a", fontSize: "14px", marginBottom: "24px" }}>
              Hi {name}, your refund has been processed successfully.
            </Text>
  
            <Section style={{ backgroundColor: "#f4f4f5", borderRadius: "8px", padding: "20px", marginBottom: "24px" }}>
              <Text style={{ color: "#71717a", fontSize: "12px", margin: "0 0 4px" }}>Amount refunded</Text>
              <Text style={{ color: "#09090b", fontSize: "14px", fontWeight: "600", margin: "0" }}>
                ${(amountRefunded / 100).toFixed(2)} {currency.toUpperCase()}
              </Text>
            </Section>
  
            <Text style={{ color: "#71717a", fontSize: "14px", marginBottom: "24px" }}>
              Refunds typically appear on your statement within 5-10 business days depending on your bank.
              Your account has been moved back to the Free plan.
            </Text>
  
            <Hr style={{ borderColor: "#e4e4e7", marginBottom: "24px" }} />
  
            <Text style={{ color: "#a1a1aa", fontSize: "12px", margin: "0" }}>
              Questions? Contact support@mysaas.app
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }