import { UniswapLikeExchangeListResponse } from "covalent-sdk";
import { useCallback, useEffect, useState } from "react";
import { Progress, Table } from "react-bulma-components";
import { covalentService } from "../../services";

interface PoolsProps {
  dexName: string;
  chainId: string;
  pools: UniswapLikeExchangeListResponse;
}

function Pools({ chainId, dexName, pools: poolsResult }: PoolsProps) {
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
      const result = await covalentService.exchange(dexName, parseInt(chainId)).pools({
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
            <th>Tokens</th>
            <th>Total Supply</th>
            <th>Total Liquidity</th>
            <th>Swaps 24hr</th>
            <th>Fees 24hr</th>
            <th>Volume 7d</th>
            <th>Annual Fee</th>
          </tr>
        </thead>
        <tbody>
          { pools.map(pool => {
            const key = pool.token_0.contract_ticker_symbol + pool.token_1.contract_ticker_symbol;

            return (
              <tr key={key}>
                <td>{ pool.token_0.contract_ticker_symbol} / { pool.token_1.contract_ticker_symbol }</td>
                <td>{ pool.total_supply }</td>
                <td>{ pool.total_liquidity_quote }</td>
                <td>{ pool.swap_count_24h }</td>
                <td>{ pool.fee_24h_quote }</td>
                <td>{ pool.volume_7d_quote }</td>
                <td>{ pool.annualized_fee }</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      { loadingMore && ( <Progress /> )}
    </div>
  );
}

export default Pools;
