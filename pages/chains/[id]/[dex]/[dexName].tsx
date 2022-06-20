import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { EcosystemResponse, NetworkExchangeTokenResponse, UniswapLikeExchangeListResponse } from "covalent-sdk";
import { Content, Heading, Tabs } from "react-bulma-components";
import { Charts, Layout, Pools, Tokens } from "../../../../components";
import { covalentService } from "../../../../services";

interface DexProps {
  dexName: string;
  chainId: string;
  poolsResponse: UniswapLikeExchangeListResponse;
  tokensResponse: NetworkExchangeTokenResponse;
  ecosystemChartDataResponse: EcosystemResponse;
}

type CurrentTab = 'pools' | 'tokens' | 'charts';
const tabs: { id: CurrentTab, name: string }[] = [
  { id: 'pools', name: 'Pools' },
  { id: 'tokens', name: 'Tokens' },
  { id: 'charts', name: 'Charts' },
];

function Dex({ dexName, chainId, poolsResponse, tokensResponse, ecosystemChartDataResponse }: DexProps) {
  const [currentTab, setCurrentTab] = useState<CurrentTab>('pools');

  const chartData = ecosystemChartDataResponse.items[0];

  return (
    <Layout>
      <Head>
        <title>Exchange { dexName }</title>
      </Head>

      <Heading>Exchange { dexName }</Heading>
      <p>
        <strong>Swaps 24h:</strong> { chartData.total_swaps_24h }
      </p>
      <p>
        <strong>Active pairs 7d:</strong> { chartData.total_active_pairs_7d }
      </p>
      <p>
        <strong>Total fees 24h:</strong> { chartData.total_fees_24h }
      </p>

      <hr />

      <Tabs>
        { tabs.map(tab => {
          const onClick = () => {
            setCurrentTab(tab.id);
          };
          return <Tabs.Tab key={tab.id} active={tab.id === currentTab} onClick={onClick}>{ tab.name }</Tabs.Tab>
        })}
      </Tabs>

      <Content>
        { currentTab === 'pools' && <Pools pools={poolsResponse} dexName={dexName} chainId={chainId} /> }
        { currentTab === 'tokens' && <Tokens tokens={tokensResponse} dexName={dexName} chainId={chainId} /> }
        { currentTab === 'charts' && <Charts chartData={chartData} /> }
      </Content>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id: chainId, dexName } = context.params as { id: string; dexName: string };

  const chain = covalentService.exchange(dexName, parseInt(chainId));
  const [poolsResponse, tokensResponse, ecosystemChartDataResponse, healthDataResponse] = await Promise.all([
    chain.pools(),
    chain.tokens(),
    chain.ecosystemChartData(),
    chain.healthData(),
  ]);

  const props: DexProps = { chainId, dexName, poolsResponse, tokensResponse, ecosystemChartDataResponse };
  return { props };
}

export default Dex;
