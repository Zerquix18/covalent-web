import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { AddressWithHistoricalPricesItem, TokenHolderResponse, TokenIdResponseType } from "covalent-sdk";
import { Heading, Tabs } from "react-bulma-components";
import { Layout, TokenHolders } from "../../../../components";
import { covalentService } from "../../../../services";
import { useState } from "react";

interface TokenProps {
  holdersResult: TokenHolderResponse | null;
  nftTokenIds: TokenIdResponseType | null;
  pricingResult: AddressWithHistoricalPricesItem[] | null;
}

type CurrentTab = 'holders';
const tabs: { id: CurrentTab, name: string }[] = [
  { id: 'holders', name: 'Holders' },
];

const Token: NextPage<TokenProps> = ({ holdersResult, nftTokenIds, pricingResult }) => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<CurrentTab>('holders');

  const { tokenId } = router.query;

  const name = pricingResult ? pricingResult[0].contract_name : '';
  const price = pricingResult && pricingResult[0].prices[0].price ? pricingResult[0].prices[0].price : null;

  return (
    <Layout>
      <Head>
        <title>{ name } | ChainsPlorer</title>
      </Head>

      <Heading>{ name } { tokenId }</Heading>
      { price ? <Heading subtitle>${ price.toFixed(2) } USD</Heading> : null }

      <Tabs>
        { tabs.map(tab => {
          const onClick = () => {
            setCurrentTab(tab.id);
          };
          return <Tabs.Tab key={tab.id} active={tab.id === currentTab} onClick={onClick}>{ tab.name }</Tabs.Tab>
        })}
      </Tabs>
      
      { currentTab === 'holders' && (
        <TokenHolders holders={holdersResult ? holdersResult.items : []} />
      )}
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id: chainId, tokenId } = context.params as { id: string; tokenId: string };

  const token = covalentService.token(tokenId, parseInt(chainId));
  const pricing = covalentService.pricing(parseInt(chainId));

  const [holdersResultPromise, nftTokenIdsPromise, pricingResultPromise] = await Promise.allSettled([
    token.holders(),
    token.nftTokenIds(),
    pricing.prices([tokenId]),
  ]);

  const holdersResult = holdersResultPromise.status === 'fulfilled' ? holdersResultPromise.value : null;
  const nftTokenIds = nftTokenIdsPromise.status === 'fulfilled' ? nftTokenIdsPromise.value : null;
  const pricingResult = pricingResultPromise.status === 'fulfilled' ? pricingResultPromise.value : null;

  const props: TokenProps = { holdersResult, nftTokenIds, pricingResult };

  return { props };
}

export default Token;
