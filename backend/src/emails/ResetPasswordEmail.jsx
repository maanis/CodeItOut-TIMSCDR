import React from 'react';
import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Heading,
} from '@react-email/components';

const ResetPasswordEmail = ({ resetLink = '#', userName = 'User', expiryMinutes = 30 }) => {
    return (
        <Html>
            <Head />
            <Preview>Reset your CodeItOut password</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Row>
                            <Text style={heading}>CodeItOut</Text>
                        </Row>

                        <Section style={section}>
                            <Text style={paragraph}>
                                Hi {userName},
                            </Text>

                            <Text style={paragraph}>
                                We received a request to reset your password. Click the button below to create a new password:
                            </Text>

                            <Section style={buttonContainer}>
                                <Button style={button} href={resetLink}>
                                    Reset Password
                                </Button>
                            </Section>

                            <Text style={paragraph}>
                                Or copy and paste this link in your browser:
                            </Text>

                            <Text style={link}>
                                {resetLink}
                            </Text>

                            <Text style={paragraph}>
                                This link will expire in {expiryMinutes} minutes. If you didn't request a password reset, you can safely ignore this email.
                            </Text>

                            <Text style={paragraph}>
                                For security reasons, never share this link with anyone.
                            </Text>

                            <Text style={footer}>
                                © 2024 CodeItOut. All rights reserved.
                            </Text>
                        </Section>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: '#f3f4f6',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const box = {
    padding: '0 48px',
};

const heading = {
    fontSize: '32px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '20px',
};

const section = {
    padding: '20px 0',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#4b5563',
    marginBottom: '16px',
};

const buttonContainer = {
    textAlign: 'center',
    margin: '32px 0',
};

const button = {
    backgroundColor: '#3b82f6',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
    padding: '12px 32px',
};

const link = {
    fontSize: '14px',
    color: '#3b82f6',
    wordBreak: 'break-all',
    marginBottom: '16px',
};

const footer = {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
};

export default ResetPasswordEmail;
