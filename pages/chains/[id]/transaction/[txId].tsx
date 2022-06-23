import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { SingleTransactionResponse } from "covalent-sdk";
import { AddressAsset, Layout } from "../../../../components";
import { covalentService } from "../../../../services";
import { Columns, Content, Heading } from "react-bulma-components";
import { format } from "date-fns";

interface ChainAddressProps {
  transactionResult: SingleTransactionResponse;
}

const Address: NextPage<ChainAddressProps> = ({ transactionResult }) => {
  const router = useRouter();
  const { txId } = router.query;

  const transaction = transactionResult.items[0];

  return (
    <Layout>
      <Head>
        <title>{ txId } | ChainsPlorer</title>
      </Head>

      <Heading>Transaction { txId }</Heading>

      <Content>
        <p>
          <strong>Block:</strong> { transaction.block_height }
        </p>
        <p>
          <strong>Date:</strong> { format(new Date(transaction.block_signed_at), 'YYY/MM/dd hh:mm:ss') }
        </p>
        <p>
          <strong>From:</strong> { transaction.from_address }
        </p>
        <p>
          <strong>To:</strong> { transaction.to_address }
        </p>
        <p>
          <strong>Success?:</strong> { transaction.successful ? 'Yes' : 'No' }
        </p>
        <p>
          <strong>Value:</strong> { transaction.value }
        </p>
      </Content>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id: chainId, txId } = context.params as { id: string; txId: string };

  const transactionResult = await covalentService.transaction(parseInt(chainId)).get(txId);

  return {
    props: { transactionResult },
  };
}

export default Address;
