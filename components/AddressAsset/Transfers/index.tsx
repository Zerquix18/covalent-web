import { TransactionResponse } from "covalent-sdk";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Progress, Table } from "react-bulma-components";
import { covalentService } from "../../../services";

interface TransfersProps {
  address: string;
  chainId: string;
  contractAddress: string;
}

function Transfers({ address, chainId, contractAddress }: TransfersProps) {
  const [loading, setLoading] = useState(false);
  const [transactionResponse, setTransactionResponse] = useState<TransactionResponse | null>(null);

  const fetchTransfers = useCallback(async () => {
    try {
      const result = await covalentService.address(address, parseInt(chainId)).tokenTransfers(contractAddress);
      setTransactionResponse(result);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  if (loading) {
    return <Progress />;
  }

  if (! transactionResponse) {
    return <div>Error</div>
  }

  const transactions = transactionResponse.items;

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Block</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Hash</th>
          </tr>
        </thead>
        <tbody>
          { transactions.map(transaction => {
            const transfers = (transaction.transfers as any)[0];

            return (
              <tr key={transaction.tx_hash}>
                <td>{ format(new Date(transaction.block_signed_at), 'YYY/MM/dd hh:mm:ss') }</td>
                <td>{ transaction.block_height }</td>
                <td>{ transaction.from_address.slice(0, 7) + '...' + transaction.from_address.slice(-4)  }</td>
                <td>{ transaction.to_address.slice(0, 7) + '...' + transaction.to_address.slice(-4)  }</td>
                <td>{ transfers.delta / (10 ** transfers.contract_decimals) }</td>
                <td>{ transfers.transfer_type }</td>
                <td>{ transaction.tx_hash.slice(0, 7) + '...' + transaction.tx_hash.slice(-4) }</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default Transfers;
