import { GenericChainInfoDisplay } from "covalent-sdk";
import { useState } from "react";
import { Card, Heading, Media, Image, Tag, Content } from "react-bulma-components";
import ChainInfo from "./ChainInfo";

interface ChainProps {
  chain: GenericChainInfoDisplay;
}

function Chain({ chain }: ChainProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(state => ! state);
  };

  return (
    <Card style={{ cursor: 'pointer' }}>
      <Card.Content>
        <Media onClick={toggleExpanded}>
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
        { expanded && (
          <Content>
            <ChainInfo chainId={chain.chain_id} />
          </Content>
        )}
      </Card.Content>
    </Card>
  );
}

export default Chain;
