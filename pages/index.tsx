import type { NextPage } from 'next';
import Head from 'next/head';
import { Card, Columns, Heading, Media, Tag, Image } from 'react-bulma-components';
import { GenericChainInfoDisplay } from 'covalent-sdk';
import { Layout } from '../components';
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
      <Heading subtitle>Select a blockchain to explore it.</Heading>

      <Columns>
        {chains.map(chain => {
          return (
            <Columns.Column key={chain.chain_id} size="one-third">
              <Card style={{ cursor: 'pointer' }}>
                <Card.Content>
                  <Media>
                    <Media.Item renderAs="figure" align="left">
                      <Image rounded size={48} alt={`${chain.label} logo`} src={chain.logo_url} />
                    </Media.Item>
                    <Media.Item>
                      <Heading size={4}>{ chain.label }</Heading>
                      <Heading subtitle size={6}>
                        <Tag color={chain.is_testnet ? 'warning' : 'success'}>
                          { chain.is_testnet ? 'Test' : 'Live' }
                        </Tag>
                      </Heading>
                    </Media.Item>
                  </Media>
                </Card.Content>
              </Card>
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
