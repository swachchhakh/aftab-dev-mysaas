import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Text,
    Button,
  } from "@react-email/components";
  
  interface PasswordResetProps {
    name: string;
    resetUrl: string;
  }
  
  export function PasswordResetEmail({ name, resetUrl }: PasswordResetProps) {
    return (
      <Html>
        <Head />
        <Preview>Reset your password</Preview>
        <Body style={{ backgroundColor: "#fafafa", fontFamily: "sans-serif" }}>
          <Container style={{ maxWidth: "560px", margin: "40px auto", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e4e4e7", padding: "40px" }}>
            <Heading style={{ fontSize: "20px", fontWeight: "600", color: "#09090b", marginBottom: "8px" }}>
              Reset your password
            </Heading>
            <Text style={{ color: "#71717a", fontSize: "14px", marginBottom: "24px" }}>
              Hi {name}, we received a request to reset your password. Click the button below — this link expires in 1 hour.
            </Text>
  
            <Button
              href={resetUrl}
              style={{ backgroundColor: "#09090b", color: "#ffffff", borderRadius: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: "500", textDecoration: "none", display: "inline-block", marginBottom: "24px" }}
            >
              Reset password →
            </Button>
  
            <Text style={{ color: "#71717a", fontSize: "13px", marginBottom: "24px" }}>
              If you didn't request this, ignore this email. Your password won't change.
            </Text>
  
            <Hr style={{ borderColor: "#e4e4e7", marginBottom: "24px" }} />
  
            <Text style={{ color: "#a1a1aa", fontSize: "12px", margin: "0" }}>
              If the button doesn't work, copy this link: {resetUrl}
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }