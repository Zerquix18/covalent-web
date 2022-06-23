import { useState } from "react";
import { HistoricalPortfolioResponseItem } from "covalent-sdk";
import { Card, Media, Image, Heading, Tag, Modal, Tabs } from "react-bulma-components";
import Holdings from "./Holdings";
import Transfers from "./Transfers";
import { useRouter } from "next/router";

interface AddressAssetProps {
  asset: HistoricalPortfolioResponseItem;
}

type CurrentTab = 'holdings' | 'transfers';
const tabs: { id: CurrentTab, name: string }[] = [
  { id: 'holdings', name: 'Holdings over time' },
  { id: 'transfers', name: 'Transfers' },
];

function AddressAsset({ asset }: AddressAssetProps) {
  const { query: { address, id }} = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<CurrentTab>('holdings');
  const holdings = parseInt(asset.holdings[0].close.balance);

  const toggleModal = () => {
    setModalOpen(state => ! state);
  };

  return (
    <Card style={{ cursor: 'pointer' }}>
      <Card.Content>
        <Media onClick={toggleModal}>
          <Media.Item renderAs="figure" align="left">
            <Image rounded size={48} alt={`${asset.contract_name} logo`} src={asset.logo_url} />
          </Media.Item>
          <Media.Item>
            <Heading size={4}>{ asset.contract_name } ({ asset.contract_ticker_symbol })</Heading>
            <Heading subtitle size={6}>
              <Tag>{ (holdings / (10 ** asset.contract_decimals)).toFixed(8) }</Tag>
            </Heading>
          </Media.Item>
        </Media>
        { modalOpen && (
          <Modal show onClose={toggleModal}>
            <Modal.Card>
              <Modal.Card.Header>
                <Modal.Card.Title>{ asset.contract_name }</Modal.Card.Title>
              </Modal.Card.Header>
              <Modal.Card.Body>
                <Tabs>
                  { tabs.map(tab => {
                    const onClick = () => {
                      setCurrentTab(tab.id);
                    };
                    return (
                      <Tabs.Tab
                        key={tab.id}
                        active={tab.id === currentTab}
                        onClick={onClick}
                      >
                        { tab.name }
                      </Tabs.Tab>
                    );
                  })}
                </Tabs>

                { currentTab === 'holdings' ? <Holdings holdings={asset.holdings} decimals={asset.contract_decimals} /> : null }
                { currentTab === 'transfers' ? (
                  <Transfers
                    address={address as string}
                    chainId={id as string}
                    contractAddress={asset.contract_address}
                  />
                ) : null }
              </Modal.Card.Body>
            </Modal.Card>
          </Modal>
        )}
      </Card.Content>
    </Card>
  );
}

export default AddressAsset;
