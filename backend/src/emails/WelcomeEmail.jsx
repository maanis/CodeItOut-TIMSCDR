import React from 'react';
import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Preview,
    Row,
    Section,
    Text,
} from '@react-email/components';

const WelcomeEmail = ({ userName = 'User', email = '' }) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to CodeItOut!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Row>
                            <Text style={heading}>CodeItOut</Text>
                        </Row>

                        <Section style={section}>
                            <Text style={paragraph}>
                                Welcome {userName}! 🎉
                            </Text>

                            <Text style={paragraph}>
                                Thank you for joining CodeItOut. We're excited to have you on board!
                            </Text>

                            <Text style={paragraph}>
                                Your account has been successfully created with the email: <strong>{email}</strong>
                            </Text>

                            <Section style={highlightSection}>
                                <Text style={highlightText}>
                                    Get Started Now
                                </Text>
                                <Text style={paragraph}>
                                    • Complete your profile
                                </Text>
                                <Text style={paragraph}>
                                    • Explore contests and challenges
                                </Text>
                                <Text style={paragraph}>
                                    • Earn badges and points
                                </Text>
                                <Text style={paragraph}>
                                    • Connect with the community
                                </Text>
                            </Section>

                            <Section style={buttonContainer}>
                                <Button style={button} href="https://codeItOut.com/dashboard">
                                    Go to Dashboard
                                </Button>
                            </Section>

                            <Text style={paragraph}>
                                If you have any questions, feel free to reach out to our support team.
                            </Text>

                            <Text style={paragraph}>
                                Happy coding! 💻
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

const highlightSection = {
    backgroundColor: '#f0f4ff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
};

const highlightText = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: '12px',
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

const footer = {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
};

export default WelcomeEmail;
