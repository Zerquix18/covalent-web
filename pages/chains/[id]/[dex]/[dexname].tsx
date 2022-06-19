import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { EcosystemResponse, HealthDataResponse, NetworkExchangeTokenResponse, UniswapLikeExchangeListResponse } from "covalent-sdk";
import { Content, Heading, Tabs } from "react-bulma-components";
import { Layout } from "../../../../components";
import Charts from "../../../../components/Charts";
import { covalentService } from "../../../../services";

interface DexProps {
  poolsResponse: UniswapLikeExchangeListResponse;
  tokensResponse: NetworkExchangeTokenResponse;
  ecosystemChartDataResponse: EcosystemResponse;
  healthDataResponse: HealthDataResponse;
}

type CurrentTab = 'charts';
const tabs: { id: CurrentTab, name: string }[] = [
  { id: 'charts', name: 'Charts' },
];

function Dex({ ecosystemChartDataResponse }: DexProps) {
  const [currentTab, setCurrentTab] = useState<CurrentTab>('charts');

  const dexName = ecosystemChartDataResponse.items[0].dex_name;

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
        { currentTab === 'charts' && <Charts chartData={ecosystemChartDataResponse.items[0]} /> }
      </Content>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id: chainId, dexname } = context.params as { id: string; dexname: string };

  const chain = covalentService.exchange(dexname, parseInt(chainId));
  const [poolsResponse, tokensResponse, ecosystemChartDataResponse, healthDataResponse] = await Promise.all([
    chain.pools(),
    chain.tokens(),
    chain.ecosystemChartData(),
    chain.healthData(),
  ]);

  const props: DexProps = { poolsResponse, tokensResponse, ecosystemChartDataResponse, healthDataResponse };
  return { props };
}

export default Dex;
