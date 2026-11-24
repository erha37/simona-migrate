import { useState } from "react";
import { Form, Input, Button, Card, Row, Col, Alert, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { authAPI } from "../services/api";
import simonaTheme from "../theme/simonaTheme";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, ${simonaTheme.primary[500]} 0%, ${simonaTheme.primary[600]} 100%);
`;

const StyledCard = styled(Card)`
  border-radius: ${simonaTheme.borderRadius.xl};
  box-shadow: ${simonaTheme.shadows.xl};
  width: 100%;
  max-width: 420px;
  border: none;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${simonaTheme.spacing.xl};
  
  h2 {
    color: ${simonaTheme.neutral[900]};
    margin: 0;
    font-size: ${simonaTheme.typography.h1.fontSize};
    font-weight: ${simonaTheme.typography.h1.fontWeight};
    letter-spacing: -0.5px;
  }
  
  p {
    color: ${simonaTheme.neutral[500]};
    margin: ${simonaTheme.spacing.xs} 0 0 0;
    font-size: ${simonaTheme.typography.body1.fontSize};
  }
`;

function SignIn() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  const onFinish = async (values) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await authAPI.login(values.username, values.password);
      
      if (response.data.status === "success") {
        const { token, user } = response.data.data;
        
        // Store token & user info
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Redirect to dashboard
        history.push("/dashboard");
      } else {
        setError(response.data.msg || "Login gagal");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || 
        err.message || 
        "Terjadi kesalahan saat login"
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Container>
      <Row gutter={[16, 16]} style={{ width: "100%" }}>
        <Col xs={24} sm={24} md={24} lg={24} style={{ display: "flex", justifyContent: "center" }}>
          <StyledCard>
            <Logo>
              <h2>SIMONA</h2>
              <p>Sistem Monitoring SPM</p>
            </Logo>

            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                closable
                style={{ marginBottom: simonaTheme.spacing.lg }}
                onClose={() => setError("")}
              />
            )}

            <Spin spinning={loading} tip="Authenticating...">
              <Form
                form={form}
                name="signin"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Username harus diisi" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Masukkan username"
                    size="large"
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Password harus diisi" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Masukkan password"
                    size="large"
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                style={{
                  background: `linear-gradient(135deg, ${simonaTheme.primary[500]} 0%, ${simonaTheme.primary[600]} 100%)`,
                  borderColor: "transparent",
                  borderRadius: simonaTheme.borderRadius.md,
                  height: 48,
                  fontSize: simonaTheme.typography.body1.fontSize,
                  fontWeight: 600,
                }}
              >
                Masuk
              </Button>
            </Form.Item>
          </Form>
        </Spin>

        <div style={{ 
          textAlign: "center", 
          marginTop: simonaTheme.spacing.lg,
          color: simonaTheme.neutral[400],
          fontSize: simonaTheme.typography.body2.fontSize,
        }}>
          © 2026 SIMONA. All rights reserved.
        </div>
          </StyledCard>
        </Col>
      </Row>
    </Container>
  );
}

export default SignIn;
