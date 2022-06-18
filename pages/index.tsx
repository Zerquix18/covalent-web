import type { NextPage } from 'next';
import Head from 'next/head';
import { Columns, Heading } from 'react-bulma-components';
import { GenericChainInfoDisplay } from 'covalent-sdk';
import { Chain, Layout } from '../components';
import { covalentService } from '../services';

interface HomeProps {
  chains: GenericChainInfoDisplay[];
}

const Home: NextPage<HomeProps> = ({ chains }) => {
  return (
    <Layout>
      <Head>
        <title>Home | ChainsPlorer</title>
      </Head>

      <Heading>Blockchains</Heading>
      <Heading subtitle>Click on a chain to expand.</Heading>

      <Columns>
        {chains.map(chain => {
          return (
            <Columns.Column key={chain.chain_id} size="one-third">
              <Chain chain={chain} />
            </Columns.Column>
          );
        })}
      </Columns>
    </Layout>
  );
}

export async function getServerSideProps() {
  const result = await covalentService.chains().list();
  const chains = result.items;

  return {
    props: { chains },
  };
}

export default Home
