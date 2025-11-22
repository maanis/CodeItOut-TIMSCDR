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
    Img,
} from '@react-email/components';

const OTPEmail = ({ otp = '000000', userName = 'User', expiryMinutes = 5 }) => {
    return (
        <Html>
            <Head />
            <Preview>Your CodeItOut verification code is {otp}</Preview>
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
                                Your email verification code is:
                            </Text>

                            <Section style={otpContainer}>
                                <Text style={otpText}>{otp}</Text>
                            </Section>

                            <Text style={paragraph}>
                                This code will expire in {expiryMinutes} minutes.
                            </Text>

                            <Text style={paragraph}>
                                If you didn't request this code, you can safely ignore this email.
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

const otpContainer = {
    textAlign: 'center',
    backgroundColor: '#f0f4ff',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '20px',
    marginTop: '20px',
};

const otpText = {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#3b82f6',
    letterSpacing: '8px',
    margin: '0',
    fontFamily: 'monospace',
};

const footer = {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
};

export default OTPEmail;
