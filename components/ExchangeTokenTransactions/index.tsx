import { TokenAddressTransactionsResponse } from "covalent-sdk";
import { format } from "date-fns";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Progress, Table, Image } from "react-bulma-components";
import { covalentService } from "../../services";

interface ExchangeTokenTransactionsProps {
  dexName: string;
  chainId: string;
  contractAddress: string;
  transactions: TokenAddressTransactionsResponse;
}

function ExchangeTokenTransactions({ chainId, dexName, contractAddress, transactions: transactionResult }: ExchangeTokenTransactionsProps) {
  const [transactionResponse, setTransactionResponse] = useState(transactionResult);
  const [loadingMore, setLoadingMore] = useState(false);

  const onScroll = useCallback(async () => {
    if (! ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500))) {
      return;
    }

    if (loadingMore) {
      return;
    }
    
    if (! transactionResponse.pagination) {
      return;
    }

    try {
      setLoadingMore(true);
      const result = await covalentService.exchange(dexName, parseInt(chainId)).token(contractAddress).transactions({
        "page-number": transactionResponse.pagination!.page_number + 1
      });
      const newPoolsResponse = {
        ...result,
        items: transactionResponse.items.concat(result.items),
      };
      setTransactionResponse(newPoolsResponse);
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

  const transactions = transactionResponse.items;

  return (
    <div>
      <Table bordered>
        <thead>
          <tr>
            <th>Action</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
            <th>Token 0</th>
            <th>Token 1</th>
            <th>Hash</th>
          </tr>
        </thead>
        <tbody>
          { transactions.map(transaction => {
            return (
              <tr key={transaction.tx_hash}>
                <td>{ transaction.act }</td>
                <td>{ transaction.sender_address.slice(0, 7) + '...' + transaction.sender_address.slice(-4) }</td>
                <td>{ transaction.to_address.slice(0, 7) + '...' + transaction.to_address.slice(-4) }</td>
                <td>{ format(new Date(transaction.block_signed_at), 'YYY/MM/dd hh:mm:ss') }</td>
                <td>{ transaction.token_0.contract_name }</td>
                <td>{ transaction.token_1.contract_name }</td>
                <td>{ transaction.tx_hash.slice(0, 7) + '...' + transaction.tx_hash.slice(-4) }</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      { loadingMore && ( <Progress /> )}
    </div>
  );
}

export default ExchangeTokenTransactions;
