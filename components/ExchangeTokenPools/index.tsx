import { SingleNetworkExchangeTokenResponse } from "covalent-sdk";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Progress, Table } from "react-bulma-components";
import { covalentService } from "../../services";

interface ExchangeTokenTransactionsProps {
  dexName: string;
  chainId: string;
  contractAddress: string;
  pools: SingleNetworkExchangeTokenResponse;
}

function ExchangeTokenPools({ chainId, dexName, contractAddress, pools: poolsResult }: ExchangeTokenTransactionsProps) {
  const [poolsResponse, setPoolsResponse] = useState(poolsResult);
  const [loadingMore, setLoadingMore] = useState(false);

  const onScroll = useCallback(async () => {
    if (! ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500))) {
      return;
    }

    if (loadingMore) {
      return;
    }
    
    if (! poolsResponse.pagination) {
      return;
    }

    try {
      setLoadingMore(true);
      const result = await covalentService.exchange(dexName, parseInt(chainId)).token(contractAddress).get({
        "page-number": poolsResponse.pagination!.page_number + 1
      });
      const newPoolsResponse = {
        ...result,
        items: poolsResponse.items.concat(result.items),
      };
      setPoolsResponse(newPoolsResponse);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingMore(false);
    }
  }, [chainId, dexName, loadingMore]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

  const pools = poolsResponse.items;

  return (
    <div>
      <Table bordered>
        <thead>
          <tr>
            <th>Token 0</th>
            <th>Token 1</th>
            <th>Swaps 24h</th>
            <th>Volume 24h</th>
            <th>Volume 7d</th>
            <th>Total supply</th>
            <th>Charts</th>
          </tr>
        </thead>
        <tbody>
          { pools.map(pool => {
            const key = pool.token_0.contract_address + pool.token_1.contract_address;

            const href0 = `/chains/${chainId}/token/${pool.token_0.contract_address}`;
            const href1 = `/chains/${chainId}/token/${pool.token_1.contract_address}`;

            return (
              <tr key={key}>
                <td>
                  <Link href={href0}>
                    { pool.token_0.contract_name }
                  </Link>
                </td>
                <td>
                  <Link href={href1}>
                    { pool.token_1.contract_name }
                  </Link>
                </td>
                <td>{ pool.swap_count_24h }</td>
                <td>{ pool.volume_24h_quote }</td>
                <td>{ pool.volume_7d_quote }</td>
                <td>{ pool.total_supply }</td>
                <td>...</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      { loadingMore && ( <Progress /> )}
    </div>
  );
}

export default ExchangeTokenPools;
