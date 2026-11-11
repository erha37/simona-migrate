import { useState } from "react";
import { Form, Input, Button, Card, Row, Col, Alert, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { authAPI } from "../services/api";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h2 {
    color: #1a202c;
    margin: 0;
    font-weight: bold;
  }
  
  p {
    color: #718096;
    margin: 5px 0 0 0;
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
                style={{ marginBottom: "20px" }}
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
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderColor: "transparent",
                    }}
                  >
                    Masuk
                  </Button>
                </Form.Item>
              </Form>
            </Spin>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <p style={{ color: "#718096", margin: 0 }}>
                © 2026 SIMONA. All rights reserved.
              </p>
            </div>
          </StyledCard>
        </Col>
      </Row>
    </Container>
  );
}

export default SignIn;
