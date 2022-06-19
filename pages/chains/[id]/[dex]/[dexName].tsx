import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { EcosystemResponse, HealthDataResponse, NetworkExchangeTokenResponse, UniswapLikeExchangeListResponse } from "covalent-sdk";
import { Content, Heading, Tabs } from "react-bulma-components";
import { Charts, Layout, Pools } from "../../../../components";
import { covalentService } from "../../../../services";

interface DexProps {
  dexName: string;
  chainId: string;
  poolsResponse: UniswapLikeExchangeListResponse;
  tokensResponse: NetworkExchangeTokenResponse;
  ecosystemChartDataResponse: EcosystemResponse;
  healthDataResponse: HealthDataResponse;
}

type CurrentTab = 'pools' | 'charts';
const tabs: { id: CurrentTab, name: string }[] = [
  { id: 'pools', name: 'Pools' },
  { id: 'charts', name: 'Charts' },
];

function Dex({ dexName, chainId, poolsResponse, ecosystemChartDataResponse }: DexProps) {
  const [currentTab, setCurrentTab] = useState<CurrentTab>('pools');

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
        { currentTab === 'pools' && <Pools pools={poolsResponse} dexName={dexName} chainId={chainId} /> }
        { currentTab === 'charts' && <Charts chartData={ecosystemChartDataResponse.items[0]} /> }
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

  const props: DexProps = { chainId, dexName, poolsResponse, tokensResponse, ecosystemChartDataResponse, healthDataResponse };
  return { props };
}

export default Dex;
