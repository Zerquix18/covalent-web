import { CovalentExchangeItem } from "covalent-sdk";
import { NextPage } from "next";
import Link from "next/link";
import { Heading } from "react-bulma-components";
import { Layout } from "../../components";
import { covalentService } from "../../services";

interface ExchangesProps {
  exchanges: CovalentExchangeItem[];
}

type TreeItem = { chainId: string; chainName: string; exchanges: CovalentExchangeItem[] };

const Exchanges: NextPage<ExchangesProps> = ({ exchanges }) => {
  const tree = exchanges.reduce<TreeItem[]>((result, current) => {
    const index = result.findIndex(item => item.chainName === current.chain_name);
    if (index === -1) {
      result.push({ chainId: current.chain_id, chainName: current.chain_name, exchanges: [current] });
    } else {
      result[index].exchanges.push(current);
    }

    return result;
  }, []);

  return (
    <Layout>
      <Heading>Exchanges</Heading>
      <Heading subtitle>All exchanges regardless of chain.</Heading>

      <div className="content">
        <ul>
          { tree.map(item => {
            return (
              <li key={item.chainName}>
                { item.chainName }
                <ul>
                  { item.exchanges.map(exchange => {
                    const href = `/chains/${exchange.chain_id}/dex/${exchange.dex_name}`;
                    return (
                      <li key={exchange.dex_name}>
                        <Link href={href}>
                          { exchange.dex_name }
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const result = await covalentService.exchanges();
  const exchanges = result.items;

  const props: ExchangesProps = { exchanges };

  return { props };
}

export default Exchanges;
