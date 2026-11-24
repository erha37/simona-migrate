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
  Divider,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  FilterOutlined,
  DownloadOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ApexChart from "react-apexcharts";
import { dashboardAPI } from "../services/api";
import styled from "styled-components";
import simonaTheme from "../theme/simonaTheme";

const Container = styled.div`
  padding: ${simonaTheme.spacing.xl};
  background-color: ${simonaTheme.background.primary};
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  border-radius: ${simonaTheme.borderRadius.lg};
  border: none;
  box-shadow: ${simonaTheme.shadows.md};
  transition: box-shadow ${simonaTheme.transition.normal}, transform ${simonaTheme.transition.fast};
  
  &:hover {
    box-shadow: ${simonaTheme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const StatisticCard = styled(StyledCard)`
  background: ${props => props.gradient || `linear-gradient(135deg, ${simonaTheme.primary[500]} 0%, ${simonaTheme.primary[600]} 100%)`};
  color: white;
  
  .ant-statistic-title {
    color: rgba(255, 255, 255, 0.8);
    font-size: ${simonaTheme.typography.body2.fontSize};
    font-weight: 500;
  }
  
  .ant-statistic-content {
    color: white;
    font-size: ${simonaTheme.typography.h3.fontSize};
    font-weight: 700;
  }
  
  .ant-statistic-content-value {
    color: white;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${simonaTheme.spacing.xl};
  padding-bottom: ${simonaTheme.spacing.md};
  border-bottom: 1px solid ${simonaTheme.border.light};
  
  h1 {
    margin: 0;
    color: ${simonaTheme.neutral[900]};
    font-size: ${simonaTheme.typography.h2.fontSize};
    font-weight: ${simonaTheme.typography.h2.fontWeight};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${simonaTheme.spacing.md};
`;

const StatsRow = styled(Row)`
  margin-bottom: ${simonaTheme.spacing.xl};
`;

const ChartRow = styled(Row)`
  margin-bottom: ${simonaTheme.spacing.xl};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${simonaTheme.spacing.sm};
  align-items: center;
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${simonaTheme.spacing.md};
  padding-bottom: ${simonaTheme.spacing.sm};
  border-bottom: 1px solid ${simonaTheme.border.light};
  
  h3 {
    margin: 0;
    color: ${simonaTheme.neutral[800]};
    font-size: ${simonaTheme.typography.h3.fontSize};
    font-weight: ${simonaTheme.typography.h3.fontWeight};
  }
`;

function Dashboard() {
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
      fontFamily: simonaTheme.typography.fontFamily,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: [simonaTheme.chart.primary, simonaTheme.chart.success],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: { colors: simonaTheme.neutral[500], fontSize: '12px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: "Miliar (Rp)", style: { color: simonaTheme.neutral[600] } },
      labels: {
        style: { colors: simonaTheme.neutral[500], fontSize: '12px' },
        formatter: (val) => val.toLocaleString('id-ID'),
      },
    },
    tooltip: {
      theme: "light",
      style: { fontFamily: simonaTheme.typography.fontFamily },
      y: { formatter: (val) => `Rp ${val.toLocaleString('id-ID')} Miliar` },
    },
    legend: {
      position: "top",
      fontSize: '13px',
      labels: { colors: simonaTheme.neutral[600] },
    },
    grid: {
      borderColor: simonaTheme.border.light,
      strokeDashArray: 4,
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
      fontFamily: simonaTheme.typography.fontFamily,
    },
    colors: [simonaTheme.chart.primary],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: { colors: simonaTheme.neutral[500], fontSize: '12px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: "Persentase (%)", style: { color: simonaTheme.neutral[600] } },
      max: 100,
      labels: {
        style: { colors: simonaTheme.neutral[500], fontSize: '12px' },
        formatter: (val) => `${val}%`,
      },
    },
    tooltip: {
      theme: "light",
      style: { fontFamily: simonaTheme.typography.fontFamily },
      y: { formatter: (val) => `${val.toFixed(1)}%` },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: simonaTheme.border.light,
      strokeDashArray: 4,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
      },
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
        <ActionButtons>
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
          <Tooltip title="Settings">
            <Button icon={<SettingOutlined />} />
          </Tooltip>
        </ActionButtons>
      </Header>

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

      <Spin spinning={loading} tip="Loading dashboard...">
        {/* Summary Cards */}
        <StatsRow gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard gradient={`linear-gradient(135deg, ${simonaTheme.primary[500]} 0%, ${simonaTheme.primary[600]} 100%)`}>
              <Statistic
                title="Total Pagu"
                value={parseFloat(summary.total_pagu).toLocaleString("id-ID")}
                suffix="Miliar"
                prefix={<ArrowUpOutlined />}
              />
            </StatisticCard>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard gradient={`linear-gradient(135deg, ${simonaTheme.success[400]} 0%, ${simonaTheme.success[500]} 100%)`}>
              <Statistic
                title="Total Realisasi"
                value={parseFloat(summary.total_realisasi).toLocaleString("id-ID")}
                suffix="Miliar"
              />
            </StatisticCard>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard gradient={`linear-gradient(135deg, ${simonaTheme.warning[400]} 0%, ${simonaTheme.warning[500]} 100%)`}>
              <Statistic
                title="Satuan Kerja"
                value={summary.total_unit}
                suffix="Unit"
              />
            </StatisticCard>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard gradient={`linear-gradient(135deg, ${simonaTheme.danger[400]} 0%, ${simonaTheme.danger[500]} 100%)`}>
              <Statistic
                title="Total Program"
                value={summary.total_program}
                suffix="Program"
              />
            </StatisticCard>
          </Col>
        </StatsRow>

        {/* Charts Row */}
        <ChartRow gutter={[24, 24]}>
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
        </ChartRow>

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
                rowKey="key"
              />
            </StyledCard>
          </Col>
        </Row>
      </Spin>
    </Container>
  );
}

export default Dashboard;
