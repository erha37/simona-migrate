import { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Statistic,
  Select,
  Button,
  Table,
  Spin,
  Alert,
  Tooltip,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  FilterOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import ApexChart from "react-apexcharts";
import { dashboardAPI } from "../services/api";
import styled from "styled-components";

const Container = styled.div`
  padding: 30px;
  background-color: #f5f7fa;
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  
  &:hover {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  }
`;

const StatisticCard = styled(StyledCard)`
  background: linear-gradient(135deg, ${props => props.gradient || '#667eea 0%, #764ba2 100%'});
  color: white;
  
  .ant-statistic-title {
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
  }
  
  .ant-statistic-content {
    color: white;
    font-size: 24px;
    font-weight: bold;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  h1 {
    margin: 0;
    color: #1a202c;
  }
`;

function Home() {
  const { Title, Text } = Typography;
  const currentYear = new Date().getFullYear();

  const [summary, setSummary] = useState({
    total_pagu: 0,
    total_realisasi: 0,
    total_unit: 0,
    total_program: 0,
  });

  const [chartData, setChartData] = useState({ pagu: [], realisasi: [], sisa: [] });
  const [realisasiPercent, setRealisasiPercent] = useState({ persen: [] });
  const [topKegiatan, setTopKegiatan] = useState([]);
  const [tahun, setTahun] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, [tahun]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [summaryRes, chartRes, realisasiRes, topRes] = await Promise.all([
        dashboardAPI.getSummary(tahun),
        dashboardAPI.getChartData(tahun),
        dashboardAPI.getChartRealisasi(tahun),
        dashboardAPI.getTopKegiatan(tahun, 10),
      ]);

      if (summaryRes.data.status === "success")
        setSummary(summaryRes.data.data);
      if (chartRes.data.status === "success")
        setChartData(chartRes.data.data);
      if (realisasiRes.data.status === "success")
        setRealisasiPercent(realisasiRes.data.data);
      if (topRes.data.status === "success")
        setTopKegiatan(topRes.data.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Line chart config: Pagu vs Realisasi
  const lineChartOptions = {
    chart: {
      type: "line",
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: ["#667eea", "#48bb78"],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    yaxis: {
      title: { text: "Miliar (Rp)" },
    },
    tooltip: {
      theme: "light",
    },
    legend: {
      position: "top",
    },
  };

  const lineChartSeries = [
    {
      name: "Pagu",
      data: chartData.pagu || [],
    },
    {
      name: "Realisasi",
      data: chartData.realisasi || [],
    },
  ];

  // Bar chart config: Realisasi %
  const barChartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    colors: ["#667eea"],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    yaxis: {
      title: { text: "Persentase (%)" },
      max: 100,
    },
    tooltip: {
      theme: "light",
    },
    dataLabels: {
      enabled: false,
    },
  };

  const barChartSeries = [
    {
      name: "Realisasi %",
      data: realisasiPercent.persen || [],
    },
  ];

  // Top Kegiatan table columns
  const columns = [
    {
      title: "Unit Kerja",
      dataIndex: "nm_unit",
      key: "nm_unit",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Pagu (Miliar Rp)",
      dataIndex: "pagu",
      key: "pagu",
      render: (value) => (
        <Text>
          {parseFloat(value).toLocaleString("id-ID", {
            maximumFractionDigits: 2,
          })}
        </Text>
      ),
      align: "right",
    },
    {
      title: "Realisasi (Miliar Rp)",
      dataIndex: "realisasi",
      key: "realisasi",
      render: (value) => (
        <Text>
          {parseFloat(value).toLocaleString("id-ID", {
            maximumFractionDigits: 2,
          })}
        </Text>
      ),
      align: "right",
    },
    {
      title: "% Realisasi",
      key: "percent",
      render: (_, record) => {
        const percent = record.pagu > 0 ? ((record.realisasi / record.pagu) * 100).toFixed(1) : 0;
        let color = "green";
        if (percent < 50) color = "red";
        else if (percent < 75) color = "orange";
        return <Text style={{ color, fontWeight: "bold" }}>{percent}%</Text>;
      },
      align: "center",
    },
  ];

  const paguGrowth = summary.total_pagu > 0 ? 12 : 0;
  const realisasiGrowth = summary.total_realisasi > 0 ? 8 : 0;

  return (
    <Container>
      <Header>
        <Title level={2} style={{ margin: 0 }}>
          Dashboard SPM
        </Title>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Select
            value={tahun}
            onChange={setTahun}
            style={{ width: 150 }}
            options={Array.from({ length: 5 }, (_, i) => ({
              label: currentYear - i,
              value: currentYear - i,
            }))}
          />
          <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchDashboardData}
              loading={loading}
            />
          </Tooltip>
          <Tooltip title="Filter">
            <Button icon={<FilterOutlined />} />
          </Tooltip>
          <Tooltip title="Export">
            <Button icon={<DownloadOutlined />} />
          </Tooltip>
        </div>
      </Header>

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

      <Spin spinning={loading} tip="Loading dashboard...">
        {/* Summary Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: "30px" }}>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard gradient="#667eea 0%, #764ba2 100%">
              <Statistic
                title="Total Pagu"
                value={parseFloat(summary.total_pagu).toLocaleString("id-ID")}
                suffix="Miliar"
                prefix={<ArrowUpOutlined />}
              />
            </StatisticCard>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard gradient="#48bb78 0%, #38a169 100%">
              <Statistic
                title="Total Realisasi"
                value={parseFloat(summary.total_realisasi).toLocaleString("id-ID")}
                suffix="Miliar"
                valueStyle={{ color: "white" }}
              />
            </StatisticCard>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard gradient="#ed8936 0%, #dd6b20 100%">
              <Statistic
                title="Satuan Kerja"
                value={summary.total_unit}
                suffix="Unit"
                valueStyle={{ color: "white" }}
              />
            </StatisticCard>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard gradient="#9f7aea 0%, #805ad5 100%">
              <Statistic
                title="Total Program"
                value={summary.total_program}
                suffix="Program"
                valueStyle={{ color: "white" }}
              />
            </StatisticCard>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row gutter={[24, 24]} style={{ marginBottom: "30px" }}>
          <Col xs={24} lg={12}>
            <StyledCard title="Trend Pagu vs Realisasi">
              <ApexChart
                options={lineChartOptions}
                series={lineChartSeries}
                type="line"
                height={300}
              />
            </StyledCard>
          </Col>
          <Col xs={24} lg={12}>
            <StyledCard title="Realisasi Per Bulan">
              <ApexChart
                options={barChartOptions}
                series={barChartSeries}
                type="bar"
                height={300}
              />
            </StyledCard>
          </Col>
        </Row>

        {/* Top Kegiatan Table */}
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <StyledCard title="Top 10 Kegiatan Terbesar">
              <Table
                columns={columns}
                dataSource={topKegiatan.map((item, idx) => ({
                  ...item,
                  key: idx,
                }))}
                pagination={{ pageSize: 10, showSizeChanger: false }}
                loading={loading}
              />
            </StyledCard>
          </Col>
        </Row>
      </Spin>
    </Container>
  );
}

export default Home;
