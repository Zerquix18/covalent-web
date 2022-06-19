import { UniswapLikeEcosystemCharts } from "covalent-sdk";
import { Button, Columns } from "react-bulma-components";
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { useState } from "react";

interface ChartProps {
  chartData: UniswapLikeEcosystemCharts;
}

type Period = '7d' | '30d';

function Charts({ chartData }: ChartProps) {
  const { liquidity_chart_7d, liquidity_chart_30d, volume_chart_7d, volume_chart_30d } = chartData;
  const [period, setPeriod] = useState<Period>('7d');

  const togglePeriod = () => {
    setPeriod(period => period === '7d' ? '30d' : '7d');
  };

  const liquidityChart7d = (period === '7d' ? liquidity_chart_7d : liquidity_chart_30d).map((item) => {
    const date = new Date(item.dt);
    const x = format(date, 'MM/dd');
    const y = item.liquidity_quote;
    return { x, y };
  });

  const volumeChart7d = (period === '7d' ? volume_chart_7d : volume_chart_30d).map((item) => {
    const date = new Date(item.dt);
    const x = format(date, 'MM/dd');
    const y = item.volume_quote;
    return { x, y };
  });

  const liquidityChart7dData = {
    datasets: [
      {
        label: 'Liquidity',
        data: liquidityChart7d,
        yAxisID: 'y',
        borderColor: '#ff0000',
      },
      {
        label: 'Volume',
        data: volumeChart7d,
        yAxisID: 'y2',
        borderColor: '#3275a8',
      }
    ]
  };

  return (
    <div>
      <Button.Group size="small" align="right">
        <Button rounded disabled={period === '7d'} onClick={togglePeriod}>7d</Button>
        <Button rounded disabled={period === '30d'} onClick={togglePeriod}>30d</Button>
      </Button.Group>

      <div style={{ height: 400 }}>
        <Line
          data={liquidityChart7dData}
          options={{
            scales: {
              y: {
                type: 'linear',
                position: 'left',
              },
              y2: {
                type: 'linear',
                position: 'right',
              },
            }
          }}
        />
      </div>
    </div>
  );
}

export default Charts;
