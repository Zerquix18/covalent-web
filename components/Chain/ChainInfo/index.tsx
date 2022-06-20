import { useCallback, useEffect, useState } from "react";
import { Block, CovalentExchangeItem } from "covalent-sdk";
import { Heading, Notification, Progress, Tag } from "react-bulma-components";
import { covalentService } from "../../../services";
import Link from "next/link";

interface ChainInfoProps {
  chainId: string;
}

interface Result {
  lastBlock: Block;
  exchanges: CovalentExchangeItem[];
}

function ChainInfo({ chainId }: ChainInfoProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const fetchInfo = useCallback(async () => {
    try {
      const blocks = await covalentService.blocks(parseInt(chainId)).get();
      const allExchanges = await covalentService.exchanges();
    
      const lastBlock = blocks.items[0];
      const exchanges = allExchanges.items.filter(item => item.chain_id === chainId);
      setResult({ lastBlock, exchanges });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [chainId]);

  useEffect(() => void fetchInfo(), [fetchInfo]);

  if (loading) {
    return <Progress />
  }

  if (error) {
    return <div>Error: { error }</div>;
  }

  if (! result) {
    return <div>Something went wrong.</div>
  }

  const { lastBlock, exchanges } = result;

  return (
    <div>
      <Tag.Group hasAddons>
        <Tag color="info">
          last block
        </Tag>
        <Tag>
        { lastBlock.height }
        </Tag>
      </Tag.Group>

      <Heading size={5}>Exchanges</Heading>

      { exchanges.length === 0 ? (
        <Notification color="warning">Could not find exchanges for this chain.</Notification> 
      ) : (
        <ul>
          { exchanges.map(exchange => {
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
      )}
    </div>
  );
}

export default ChainInfo;
