import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { SingleNetworkExchangeTokenResponse, TokenAddressTransactionsResponse } from "covalent-sdk";
import { Heading, Tabs } from "react-bulma-components";
import { ExchangeTokenPools, ExchangeTokenTransactions, Layout } from "../../../../../../components";
import { covalentService } from "../../../../../../services";

interface ChainTokenProps {
  chainId: string;
  dexName: string;
  tokenId: string;
  tokenResponse: SingleNetworkExchangeTokenResponse;
  transactionsResponse: TokenAddressTransactionsResponse;
}

type CurrentTab = 'pools' | 'transactions';
const tabs: { id: CurrentTab, name: string }[] = [
  { id: 'pools', name: 'Pools' },
  { id: 'transactions', name: 'Transactions' },
];

function ChainToken({ chainId, dexName, tokenId, tokenResponse, transactionsResponse }: ChainTokenProps) {
  const [currentTab, setCurrentTab] = useState<CurrentTab>('pools');

  const tokenPools = tokenResponse.items;
  const token = tokenPools.find(item => item.token_1.contract_address === tokenId)!.token_1;

  return (
    <Layout>
      <Head>
        <title>{ token.contract_name } ({ token.contract_ticker_symbol }) on { dexName }</title>
      </Head>

      <Heading>{ token.contract_name } ({ token.contract_ticker_symbol }) on { dexName }</Heading>

      <Tabs>
        { tabs.map(tab => {
          const onClick = () => {
            setCurrentTab(tab.id);
          };
          return <Tabs.Tab key={tab.id} active={tab.id === currentTab} onClick={onClick}>{ tab.name }</Tabs.Tab>
        })}
      </Tabs>
      
      { currentTab === 'pools' && (
        <ExchangeTokenPools
          chainId={chainId}
          dexName={dexName}
          contractAddress={tokenId}
          pools={tokenResponse}
        />
      )}

      { currentTab === 'transactions' && (
        <ExchangeTokenTransactions
          chainId={chainId}
          dexName={dexName}
          contractAddress={tokenId}
          transactions={transactionsResponse}
        />
      )}
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id: chainId, dexName, tokenId } = context.params as { id: string; dexName: string; tokenId: string; };

  const token = covalentService.exchange(dexName, parseInt(chainId)).token(tokenId);

  const [tokenResponse, transactionsResponse] = await Promise.all([token.get(), token.transactions()]);

  const props: ChainTokenProps = { chainId, dexName, tokenId, tokenResponse, transactionsResponse };
  return { props };
}

export default ChainToken;
