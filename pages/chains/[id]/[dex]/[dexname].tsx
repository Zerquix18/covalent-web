import { ExchangeVolumeV2, HealthData, TokenV2Volume, UniswapLikeEcosystemCharts } from "covalent-sdk";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { Content, Heading, Tabs } from "react-bulma-components";
import { Layout } from "../../../../components";
import Charts from "../../../../components/Charts";
import { covalentService } from "../../../../services";

interface DexProps {
  pools: ExchangeVolumeV2[]; 
  tokens: TokenV2Volume[];
  ecosystemChartData: UniswapLikeEcosystemCharts;
  healthData: HealthData[];
}

type CurrentTab = 'charts';
const tabs: { id: CurrentTab, name: string }[] = [
  { id: 'charts', name: 'Charts' },
];

function Dex({ pools, tokens, ecosystemChartData, healthData }: DexProps) {
  const [currentTab, setCurrentTab] = useState<CurrentTab>('charts');

  const dexName = ecosystemChartData.dex_name;

  return (
    <Layout>
      <Head>
        <title>Exchange { dexName }</title>
      </Head>

      <Heading>Exchange { dexName }</Heading>

      <Tabs>
        { tabs.map(tab => {
          const onClick = () => {
            setCurrentTab(tab.id);
          };
          return <Tabs.Tab key={tab.id} active={tab.id === currentTab} onClick={onClick}>{ tab.name }</Tabs.Tab>
        })}
      </Tabs>

      <Content>
        { currentTab === 'charts' && <Charts chartData={ecosystemChartData} /> }
      </Content>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id: chainId, dexname } = context.params as { id: string; dexname: string };

  const chain = covalentService.exchange(dexname, parseInt(chainId));
  const [pools, tokens, ecosystemChartData, healthData] = await Promise.all([
    chain.pools(),
    chain.tokens(),
    chain.ecosystemChartData(),
    chain.healthData(),
  ]);

  const props: DexProps = {
    pools: pools.items,
    tokens: tokens.items,
    ecosystemChartData: ecosystemChartData.items[0],
    healthData: healthData.items,
  };

  return { props };
}

export default Dex;
