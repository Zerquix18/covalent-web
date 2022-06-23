import { HistoricalPortfolioResponseItemToken } from "covalent-sdk";
import { format } from "date-fns";
import { Line } from "react-chartjs-2";

interface HoldingsProps {
  holdings: HistoricalPortfolioResponseItemToken[];
  decimals: number;
}

function Holdings({ holdings, decimals }: HoldingsProps) {
  const holdingsData = holdings.map((item) => {
    const date = new Date(item.timestamp);
    const x = format(date, 'MM/dd');
    const y = parseInt(item.close.balance) / (10 ** decimals);
    return { x, y };
  });

  const data = {
    datasets: [
      {
        label: 'Liquidity',
        data: holdingsData.reverse(),
        yAxisID: 'y',
        borderColor: '#3275a8',
      },
    ]
  };

  return <Line data={data} />
}

export default Holdings;
