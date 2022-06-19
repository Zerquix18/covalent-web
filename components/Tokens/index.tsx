import { NetworkExchangeTokenResponse } from "covalent-sdk";
import { useCallback, useEffect, useState } from "react";
import { Progress, Table, Image } from "react-bulma-components";
import { covalentService } from "../../services";

interface TokensProps {
  dexName: string;
  chainId: string;
  tokens: NetworkExchangeTokenResponse;
}

function Tokens({ chainId, dexName, tokens: tokensResult }: TokensProps) {
  const [tokensResponse, setTokensResponse] = useState(tokensResult);
  const [loadingMore, setLoadingMore] = useState(false);

  const onScroll = useCallback(async () => {
    if (! ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500))) {
      return;
    }

    if (loadingMore) {
      return;
    }
    
    if (! tokensResponse.pagination) {
      return;
    }

    try {
      setLoadingMore(true);
      const result = await covalentService.exchange(dexName, parseInt(chainId)).tokens({
        "page-number": tokensResponse.pagination!.page_number + 1
      });
      const newPoolsResponse = {
        ...result,
        items: tokensResponse.items.concat(result.items),
      };
      setTokensResponse(newPoolsResponse);
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

  const tokens = tokensResponse.items;

  return (
    <div>
      <Table bordered>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Token Name</th>
            <th>Ticker</th>
            <th>Swaps 24h</th>
            <th>Volume 24h</th>
            <th>Liquidity</th>
          </tr>
        </thead>
        <tbody>
          { tokens.map(token => {
            return (
              <tr key={token.contract_address}>
                <td>
                  <Image rounded size={24} src={token.logo_url} />
                </td>
                <td>{ token.contract_name }</td>
                <td>{ token.contract_ticker_symbol }</td>
                <td>{ token.swap_count_24h }</td>
                <td>{ token.total_volume_24h }</td>
                <td>{ token.total_liquidity }</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      { loadingMore && ( <Progress /> )}
    </div>
  );
}

export default Tokens;
