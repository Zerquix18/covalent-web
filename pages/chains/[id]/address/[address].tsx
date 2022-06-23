import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { BalanceResponseType, HistoricalPortfolioResponse } from "covalent-sdk";
import { AddressAsset, Layout } from "../../../../components";
import { covalentService } from "../../../../services";
import { Columns, Heading } from "react-bulma-components";

interface ChainAddressProps {
  portfolioResult: HistoricalPortfolioResponse;
}

const Address: NextPage<ChainAddressProps> = ({ portfolioResult }) => {
  const router = useRouter();
  const { address } = router.query;

  const assets = portfolioResult.items;

  return (
    <Layout>
      <Head>
        <title>{ address } | ChainsPlorer</title>
      </Head>

      <Heading>Address { address }</Heading>
      <Heading subtitle>Click on a asset to see more info.</Heading>

      <Columns>
        {assets.map(asset => {
          return (
            <Columns.Column key={asset.contract_address} size="one-third">
              <AddressAsset asset={asset} />
            </Columns.Column>
          );
        })}
      </Columns>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id: chainId, address: _address } = context.params as { id: string; address: string };

  const portfolioResult = await covalentService.address(_address, parseInt(chainId)).portfolio();

  return {
    props: { portfolioResult },
  };
}

export default Address;
